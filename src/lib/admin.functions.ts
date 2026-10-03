import { createServerFn } from "@tanstack/react-start";
import { createHash, timingSafeEqual } from "crypto";
import { z } from "zod";

/** Pedidos como chegam ao painel admin (DTO simples, já convertido do banco). */
export type AdminOrder = {
  id: string;
  status: string;
  amountCents: number;
  customer: { name?: string; email?: string; phone?: string; cpf?: string };
  endereco: string;
  cep: string;
  frete: { id?: string; name?: string; price?: number };
  items: { slug: string; name: string; qty: number; price: number }[];
  paidAt: string | null;
  trackingCode: string | null;
  createdAt: string;
  updatedAt: string;
};

export type AdminStats = {
  total: number;
  paid: number;
  waiting: number;
  revenueCents: number;
  avgCents: number;
};

const passwordField = z.object({ password: z.string().min(1).max(200) });

/** Comparação em tempo constante: o hash iguala os tamanhos antes do timingSafeEqual. */
function passwordMatches(password: string): boolean {
  const expected = process.env["ADMIN_PASSWORD"];
  if (!expected) return false;
  const sha = (v: string) => createHash("sha256").update(v).digest();
  return timingSafeEqual(sha(password), sha(expected));
}

function assertAdmin(password: string) {
  if (!passwordMatches(password)) throw new Error("Senha incorreta.");
}

export const adminLogin = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => passwordField.parse(d))
  .handler(async ({ data }): Promise<{ ok: boolean; configured: boolean }> => {
    const configured = !!process.env["ADMIN_PASSWORD"];
    return { ok: configured && passwordMatches(data.password), configured };
  });

function periodStart(period: "today" | "7d" | "30d" | "90d" | "all"): string | null {
  const day = 24 * 60 * 60 * 1000;
  switch (period) {
    case "today": {
      const d = new Date();
      d.setUTCHours(0, 0, 0, 0);
      return d.toISOString();
    }
    case "7d":
      return new Date(Date.now() - 7 * day).toISOString();
    case "30d":
      return new Date(Date.now() - 30 * day).toISOString();
    case "90d":
      return new Date(Date.now() - 90 * day).toISOString();
    default:
      return null;
  }
}

type OrderRow = {
  id: string;
  status: string;
  amount_cents: number;
  customer: unknown;
  endereco: string;
  cep: string;
  frete: unknown;
  items: unknown;
  paid_at: string | null;
  tracking_code: string | null;
  created_at: string;
  updated_at: string;
};

function toAdminOrder(r: OrderRow): AdminOrder {
  return {
    id: r.id,
    status: r.status,
    amountCents: r.amount_cents,
    customer: (r.customer ?? {}) as AdminOrder["customer"],
    endereco: r.endereco,
    cep: r.cep,
    frete: (r.frete ?? {}) as AdminOrder["frete"],
    items: Array.isArray(r.items) ? (r.items as AdminOrder["items"]) : [],
    paidAt: r.paid_at,
    trackingCode: r.tracking_code,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  };
}

export const adminGetOrders = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) =>
    z
      .object({
        password: z.string().min(1).max(200),
        period: z.enum(["today", "7d", "30d", "90d", "all"]).default("30d"),
        status: z.enum(["all", "paid", "waiting_payment", "canceled"]).default("all"),
        search: z.string().max(120).default(""),
      })
      .parse(d),
  )
  .handler(async ({ data }): Promise<{ orders: AdminOrder[]; stats: AdminStats }> => {
    assertAdmin(data.password);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    let query = supabaseAdmin.from("orders").select("*").order("created_at", { ascending: false }).limit(1000);
    const since = periodStart(data.period);
    if (since) query = query.gte("created_at", since);
    if (data.status !== "all") query = query.eq("status", data.status);

    const { data: rows, error } = await query;
    if (error) throw new Error("Não foi possível carregar os pedidos.");

    const all = ((rows ?? []) as OrderRow[]).map(toAdminOrder);

    // Cartões consideram o período escolhido (antes da busca e do filtro de status).
    const paid = all.filter((o) => o.status === "paid");
    const revenue = paid.reduce((s, o) => s + o.amountCents, 0);
    const stats: AdminStats = {
      total: all.length,
      paid: paid.length,
      waiting: all.filter((o) => o.status === "waiting_payment").length,
      revenueCents: revenue,
      avgCents: paid.length ? Math.round(revenue / paid.length) : 0,
    };

    const s = data.search.trim().toLowerCase();
    const orders = s
      ? all.filter((o) =>
          [o.customer.name, o.customer.email, o.customer.phone, o.customer.cpf, o.id].some((v) =>
            (v ?? "").toLowerCase().includes(s),
          ),
        )
      : all;

    return { orders, stats };
  });

export const adminSaveTracking = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) =>
    z
      .object({
        password: z.string().min(1).max(200),
        id: z.string().min(1).max(80),
        tracking_code: z.string().trim().max(80),
      })
      .parse(d),
  )
  .handler(async ({ data }): Promise<{ ok: boolean }> => {
    assertAdmin(data.password);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin
      .from("orders")
      .update({ tracking_code: data.tracking_code || null })
      .eq("id", data.id);
    if (error) throw new Error("Não foi possível salvar o código de rastreio.");
    return { ok: true };
  });
