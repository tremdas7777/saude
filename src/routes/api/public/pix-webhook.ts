import { createFileRoute } from "@tanstack/react-router";

const API = "https://app.pixgateip.com/api";
const PAID = ["paid", "approved"];

/** Extrai o id da transação de vários formatos possíveis de corpo. */
function extractId(body: Record<string, unknown>): string | null {
  const data = body["data"] as Record<string, unknown> | undefined;
  const candidates = [body["transaction_id"], body["id"], data?.["id"]];
  const id = candidates.find((c) => typeof c === "string" && c.length > 0 && c.length <= 80);
  return typeof id === "string" ? id : null;
}

// Notificação da PixGate. O corpo NUNCA é confiável: o status real é sempre
// consultado de novo na API autenticada antes de marcar o pedido como pago.
export const Route = createFileRoute("/api/public/pix-webhook")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
        const id = body ? extractId(body) : null;
        if (!id) return Response.json({ ok: true });

        try {
          const res = await fetch(`${API}/stats/${encodeURIComponent(id)}`, {
            headers: { Apikey: process.env["PIXGATE_API_KEY"] ?? "", Accept: "application/json" },
          });
          const json = (await res.json().catch(() => null)) as { status?: unknown } | null;
          const status = String(json?.status ?? "").toLowerCase();

          if (res.ok && PAID.includes(status)) {
            const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
            const { error } = await supabaseAdmin
              .from("orders")
              .update({ status: "paid", paid_at: new Date().toISOString() })
              .eq("id", id)
              .neq("status", "paid");
            if (error) console.error("pix-webhook: falha ao marcar pedido pago:", error.message);
          }
        } catch (e) {
          console.error("pix-webhook", e);
        }

        return Response.json({ ok: true });
      },
    },
  },
});
