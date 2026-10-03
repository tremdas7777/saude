import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Check, Mail, PackageCheck, Truck } from "lucide-react";
import { brl } from "@/lib/catalog";
import { loadPixSession, type PixSession } from "@/lib/pix-session";
import { StoreLayout } from "@/components/store/Layout";

export const Route = createFileRoute("/obrigado/$id")({
  head: () => ({ meta: [{ title: "Pedido confirmado | Movvi" }, { name: "robots", content: "noindex" }] }),
  component: Page,
});

function Page() {
  const { id } = Route.useParams();
  const [session, setSession] = useState<PixSession | null>(null);
  useEffect(() => setSession(loadPixSession(id)), [id]);

  return (
    <StoreLayout>
      <div className="mx-auto max-w-lg px-4 py-12 text-center">
        <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-teal text-white">
          <Check className="h-9 w-9" />
        </span>
        <h1 className="mt-5 text-[28px] font-bold text-navy">Pedido confirmado!</h1>
        <p className="mt-2 text-[14px] text-muted-foreground">
          Obrigado pela compra{session ? `, ${session.name.split(" ")[0]}` : ""}! Seu pagamento foi aprovado.
          {session && (
            <>
              {" "}
              Os detalhes foram enviados para <b className="text-navy">{session.email}</b>.
            </>
          )}
        </p>

        {session && (
          <div className="mt-8 rounded-2xl bg-white p-6 text-left shadow-sm">
            <h2 className="text-[15px] font-bold text-navy">Resumo da compra</h2>
            <ul className="mt-4 space-y-2 text-[14px]">
              {session.items.map((i) => (
                <li key={i.slug} className="flex justify-between gap-3 text-navy/80">
                  <span>
                    {i.qty}× {i.name}
                  </span>
                  <span className="shrink-0">{brl(i.price * i.qty)}</span>
                </li>
              ))}
              <li className="flex justify-between text-navy/80">
                <span>{session.frete.name}</span>
                <span>{session.frete.price ? brl(session.frete.price) : "Grátis"}</span>
              </li>
              <li className="flex justify-between border-t border-black/5 pt-3 text-[16px] font-bold text-navy">
                <span>Total pago</span>
                <span>{brl(session.amount / 100)}</span>
              </li>
            </ul>
          </div>
        )}

        <div className="mt-8 rounded-2xl bg-teal-soft p-6 text-left">
          <h2 className="text-[15px] font-bold text-navy">Próximos passos</h2>
          <ol className="mt-4 space-y-3 text-[14px] text-navy">
            {[
              { Icon: Mail, t: "Você recebe a confirmação no seu e-mail." },
              { Icon: PackageCheck, t: "Separamos e embalamos seu pedido." },
              { Icon: Truck, t: "Quando for despachado, enviamos o código de rastreio." },
            ].map(({ Icon, t }) => (
              <li key={t} className="flex items-center gap-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-teal text-white">
                  <Icon className="h-4 w-4" />
                </span>
                {t}
              </li>
            ))}
          </ol>
        </div>

        <Link to="/" className="mt-8 inline-block rounded-xl bg-teal px-8 py-3.5 font-bold text-white hover:bg-teal-dark">
          Voltar para a loja
        </Link>
        <p className="mt-2 text-[12px] text-muted-foreground">Pedido nº {id}</p>
      </div>
    </StoreLayout>
  );
}
