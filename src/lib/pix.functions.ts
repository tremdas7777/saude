import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { z } from "zod";
import { getProduct } from "@/lib/catalog";
import { FREE_SHIPPING_MIN, getFrete, isFreeShippingEligible } from "@/lib/shipping";

const API = "https://app.pixgateip.com/api";

function apiKey(): string {
  const key = process.env["PIXGATE_API_KEY"];
  if (!key) throw new Error("Pagamento indisponível no momento.");
  return key;
}

function isValidCpf(raw: string): boolean {
  const c = raw.replace(/\D/g, "");
  if (c.length !== 11 || /^(\d)\1+$/.test(c)) return false;
  for (const t of [9, 10]) {
    let sum = 0;
    for (let i = 0; i < t; i++) sum += Number(c[i]) * (t + 1 - i);
    const d = ((sum * 10) % 11) % 10;
    if (d !== Number(c[t])) return false;
  }
  return true;
}

const orderSchema = z.object({
  name: z.string().trim().min(3).max(120),
  email: z.string().trim().email().max(160),
  phone: z.string().transform((v) => v.replace(/\D/g, "")).pipe(z.string().min(10).max(11)),
  cpf: z
    .string()
    .transform((v) => v.replace(/\D/g, ""))
    .refine(isValidCpf, "CPF inválido"),
  endereco: z.string().trim().min(5).max(300),
  cep: z.string().transform((v) => v.replace(/\D/g, "")).pipe(z.string().length(8)),
  frete: z.enum(["gratis", "padrao", "express"]),
  items: z
    .array(z.object({ slug: z.string().max(80), qty: z.number().int().min(1).max(99) }))
    .min(1)
    .max(50),
  origin: z.string().url(),
});

export type PixCharge = { id: string; qrcode: string; amount: number };

export const createPixCharge = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => orderSchema.parse(d))
  .handler(async ({ data }): Promise<PixCharge> => {
    // Preço sempre calculado no servidor a partir do catálogo — nunca confiar no cliente.
    const lines = data.items.map((i) => {
      const product = getProduct(i.slug);
      if (!product) throw new Error("Produto indisponível. Atualize o carrinho e tente novamente.");
      return { product, qty: i.qty };
    });
    const subtotal = lines.reduce((s, l) => s + l.product.price * l.qty, 0);
    if (data.frete === "gratis" && !isFreeShippingEligible(subtotal)) {
      throw new Error(`Frete grátis disponível apenas para compras acima de R$ ${FREE_SHIPPING_MIN}.`);
    }
    const frete = getFrete(data.frete);
    const amount = Math.round((subtotal + frete.price) * 100);

    const res = await fetch(`${API}/v1/cashin`, {
      method: "POST",
      headers: { Apikey: apiKey(), "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        nome: data.name,
        cpf: data.cpf,
        // PixGate recebe o valor em reais (decimal); internamente seguimos em centavos.
        valor: Number((amount / 100).toFixed(2)),
        descricao: "Pedido Movvi",
        postback: `${new URL(data.origin).origin}/api/public/pix-webhook`,
      }),
    });
    const json = (await res.json().catch(() => null)) as { id?: unknown; pix?: unknown } | null;
    if (!res.ok || !json?.id || !json.pix) {
      console.error("PixGate error", res.status, JSON.stringify(json)?.slice(0, 500));
      throw new Error("Não foi possível gerar o Pix. Confira seus dados e tente novamente.");
    }
    const id = String(json.id);

    // Salva o pedido no banco (service role, servidor). Se o insert falhar,
    // registra o erro mas não impede o cliente de receber o Pix.
    const h = getRequest()?.headers;
    try {
      const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
      const { error } = await supabaseAdmin.from("orders").insert({
        id,
        status: "waiting_payment",
        amount_cents: amount,
        customer: { name: data.name, email: data.email, phone: data.phone, cpf: data.cpf },
        endereco: data.endereco,
        cep: data.cep,
        frete: { id: frete.id, name: frete.name, price: frete.price },
        items: lines.map((l) => ({ slug: l.product.slug, name: l.product.name, qty: l.qty, price: l.product.price })),
        ip: h?.get("cf-connecting-ip") ?? null,
        ua: h?.get("user-agent") ?? null,
      });
      if (error) console.error("Falha ao salvar pedido no banco:", error.message);
    } catch (e) {
      console.error("Falha ao salvar pedido no banco:", e);
    }

    return { id, qrcode: String(json.pix), amount };
  });

const PAID_STATUSES = ["paid", "approved"];

/** Status do Pix consultado direto na PixGate (fonte confiável). */
export const getPixStatus = createServerFn({ method: "GET" })
  .inputValidator((d: unknown) => z.object({ id: z.string().regex(/^[\w-]{1,64}$/) }).parse(d))
  .handler(async ({ data }): Promise<{ status: string }> => {
    const res = await fetch(`${API}/stats/${encodeURIComponent(data.id)}`, {
      headers: { Apikey: apiKey(), Accept: "application/json" },
    });
    const json = (await res.json().catch(() => null)) as { status?: unknown } | null;
    const status = String(json?.status ?? "pending").toLowerCase();

    // Pagamento confirmado pela PixGate: marca o pedido como pago (uma única vez).
    if (PAID_STATUSES.includes(status)) {
      try {
        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const { error } = await supabaseAdmin
          .from("orders")
          .update({ status: "paid", paid_at: new Date().toISOString() })
          .eq("id", data.id)
          .neq("status", "paid");
        if (error) console.error("Falha ao marcar pedido como pago:", error.message);
      } catch (e) {
        console.error("Falha ao marcar pedido como pago:", e);
      }
    }

    return { status };
  });
