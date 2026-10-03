import { createFileRoute } from "@tanstack/react-router";

// Notificação da PixGate. O corpo não é confiável; o status real é sempre
// consultado na API autenticada (getPixStatus) pela página do pedido.
export const Route = createFileRoute("/api/public/pix-webhook")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
        console.log("pix-webhook", JSON.stringify(body)?.slice(0, 300));
        return Response.json({ ok: true });
      },
    },
  },
});
