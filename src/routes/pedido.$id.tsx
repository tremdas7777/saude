import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Check, Copy, Loader2, Lock } from "lucide-react";
import { useCart } from "@/lib/cart";
import { brl } from "@/lib/catalog";
import { getPixStatus } from "@/lib/pix.functions";
import { loadPixSession, type PixSession } from "@/lib/pix-session";
import { Logo } from "@/components/store/Layout";
import { PixLogo } from "@/components/store/PixLogo";

export const Route = createFileRoute("/pedido/$id")({
  head: () => ({ meta: [{ title: "Pagamento via Pix | Movvi" }, { name: "robots", content: "noindex" }] }),
  component: Page,
});

const EXPIRES_MS = 30 * 60 * 1000;
const PAID = ["paid", "approved"];
const REFUSED = ["failed", "refused", "canceled", "cancelled", "expired"];

function Page() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const cart = useCart();
  const statusFn = useServerFn(getPixStatus);
  const [session, setSession] = useState<PixSession | null>(null);

  useEffect(() => setSession(loadPixSession(id)), [id]);

  const { data } = useQuery({
    queryKey: ["pix-status", id],
    queryFn: () => statusFn({ data: { id } }),
    refetchInterval: (q) => (PAID.includes(q.state.data?.status ?? "") ? false : 5000),
  });
  const status = data?.status ?? "pending";
  const paid = PAID.includes(status);
  const refused = REFUSED.includes(status);

  useEffect(() => {
    if (!paid) return;
    cart.clear();
    navigate({ to: "/obrigado/$id", params: { id }, replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paid]);

  return (
    <div className="min-h-screen bg-[#f7f9fa]">
      <header className="border-b border-black/5 bg-white">
        <div className="mx-auto flex h-16 max-w-3xl items-center justify-between px-4">
          <Logo />
          <span className="flex items-center gap-1.5 text-[12px] font-medium text-navy/70">
            <Lock className="h-4 w-4 text-teal" /> Pagamento seguro
          </span>
        </div>
      </header>
      <main className="mx-auto max-w-lg px-4 py-10 text-center">
        {paid ? (
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-teal" />
        ) : refused ? (
          <>
            <h1 className="text-[24px] font-bold text-navy">Pagamento não aprovado</h1>
            <p className="mt-2 text-[14px] text-muted-foreground">O Pix expirou ou foi cancelado. Você pode gerar um novo.</p>
            <Link to="/checkout" className="mt-6 inline-block rounded-xl bg-teal px-8 py-3.5 font-bold text-white">
              Tentar novamente
            </Link>
          </>
        ) : (
          <Waiting session={session} />
        )}
      </main>
    </div>
  );
}

function Waiting({ session }: { session: PixSession | null }) {
  const [copied, setCopied] = useState(false);
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    setNow(Date.now());
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  const remaining = session && now !== null ? Math.max(0, EXPIRES_MS - (now - session.createdAt)) : EXPIRES_MS;
  const mmss = `${String(Math.floor(remaining / 60000)).padStart(2, "0")}:${String(Math.floor((remaining % 60000) / 1000)).padStart(2, "0")}`;

  const copy = async () => {
    if (!session) return;
    await navigator.clipboard.writeText(session.qrcode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <>
      <PixLogo className="mx-auto h-12 w-12" />
      <h1 className="mt-4 text-[26px] font-bold text-navy">Quase lá...</h1>
      <p className="mt-2 text-[14px] text-muted-foreground">
        Pague via Pix em até <b className="text-navy">{mmss}</b> para confirmar seu pedido.
      </p>
      <span className="mt-4 inline-flex items-center gap-2 rounded-full bg-amber-100 px-4 py-1.5 text-[13px] font-semibold text-amber-800">
        <Loader2 className="h-3.5 w-3.5 animate-spin" /> Aguardando pagamento
      </span>

      {session ? (
        <div className="mt-6 rounded-2xl bg-white p-5 text-left shadow-sm">
          <p className="text-center text-[15px] text-navy">
            Total: <b className="text-[18px] text-teal-dark">{brl(session.amount / 100)}</b>
          </p>
          <p className="mt-4 text-[13px] font-medium text-navy">Pix copia e cola</p>
          <div className="mt-1 break-all rounded-lg bg-[#f1f4f5] p-3 text-[12px] text-navy/70">{session.qrcode}</div>
          <button
            onClick={copy}
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-teal py-3.5 text-[15px] font-bold text-white hover:bg-teal-dark"
          >
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            {copied ? "Código copiado!" : "Copiar código Pix"}
          </button>
          <ol className="mt-6 space-y-3 text-[14px] text-navy">
            {[
              "Toque em Copiar código Pix",
              "Abra o app do seu banco e entre na área Pix",
              "Escolha Pix Copia e Cola e cole o código",
              "Confirme o pagamento. Esta página atualiza sozinha",
            ].map((t, i) => (
              <li key={t} className="flex items-center gap-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-teal text-[13px] font-bold text-white">
                  {i + 1}
                </span>
                {t}
              </li>
            ))}
          </ol>
        </div>
      ) : (
        <div className="mt-6 rounded-2xl bg-white p-6 text-[14px] text-muted-foreground shadow-sm">
          Estamos acompanhando seu pagamento. Assim que for confirmado, esta página atualiza sozinha.
        </div>
      )}
    </>
  );
}
