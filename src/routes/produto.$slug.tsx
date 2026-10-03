import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Check, ChevronDown, Lock, Minus, Plus, RefreshCw, ShieldCheck, Truck } from "lucide-react";
import { brand } from "@/lib/brand";
import { useCart } from "@/lib/cart";
import { brl, discountPct, getCategory, getProduct, installment, INSTALLMENTS, PRODUCTS } from "@/lib/catalog";
import { StoreLayout } from "@/components/store/Layout";
import { ProductCard } from "@/components/store/ProductCard";
import { ProductImage } from "@/components/store/ProductImage";

export const Route = createFileRoute("/produto/$slug")({
  loader: ({ params }) => {
    const product = getProduct(params.slug);
    if (!product) throw notFound();
    return { product };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.product.name} | Movvi` },
          { name: "description", content: `${loaderData.product.name}. ${loaderData.product.bullets.join(". ")}.` },
        ]
      : [],
  }),
  component: ProductPage,
});

const FAQ = [
  { q: "Tem garantia?", a: "Sim. Você pode solicitar troca ou devolução em até 7 dias após o recebimento, conforme o Código de Defesa do Consumidor." },
  { q: "Como acompanho meu pedido?", a: "Assim que o pedido for despachado, enviamos o código de rastreio por e-mail. Você também pode consultar na página Rastrear Pedido." },
  { q: "Quais as formas de pagamento?", a: "As formas de pagamento disponíveis aparecem na finalização da compra." },
  { q: "Posso cancelar meu pedido?", a: "Sim. Antes do envio, fale com nosso atendimento pelo WhatsApp ou e-mail e cancelamos para você." },
  { q: "Substitui o tratamento com um profissional?", a: "Não. Nossos produtos complementam a rotina de cuidados e não substituem avaliação médica ou fisioterapêutica. Em caso de dor persistente, procure um profissional." },
];

function ProductPage() {
  const { product: p } = Route.useLoaderData();
  const cart = useCart();
  const navigate = useNavigate();
  const [qty, setQty] = useState(1);
  const off = discountPct(p);
  const cat = getCategory(p.categories[0]);
  const related = PRODUCTS.filter((x) => x.slug !== p.slug && x.categories.some((c) => p.categories.includes(c))).slice(0, 4);

  const buyNow = () => {
    cart.add(p.slug, qty);
    cart.setOpen(false);
    navigate({ to: "/checkout" });
  };

  return (
    <StoreLayout>
      <div className="mx-auto max-w-7xl px-4 py-8">
        <nav className="text-[12px] text-muted-foreground">
          <Link to="/" className="hover:text-teal">Início</Link> /{" "}
          {cat && (
            <>
              <Link to="/produtos" search={{ categoria: cat.id }} className="hover:text-teal">{cat.short}</Link> /{" "}
            </>
          )}
          <span className="text-navy">{p.name}</span>
        </nav>

        <div className="mt-6 grid gap-10 md:grid-cols-2">
          <div className="overflow-hidden rounded-2xl border border-black/5 bg-white">
            <ProductImage product={p} />
          </div>

          <div>
            {off > 0 && (
              <span className="inline-block rounded-md bg-teal px-2 py-1 text-[11px] font-bold text-white">-{off}% OFF</span>
            )}
            <h1 className="mt-3 text-[26px] font-bold leading-tight text-navy md:text-[30px]">{p.name}</h1>
            <ul className="mt-4 space-y-1.5">
              {p.bullets.map((b) => (
                <li key={b} className="flex gap-2 text-[14px] text-navy/80">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-teal" /> {b}
                </li>
              ))}
            </ul>

            <div className="mt-6">
              {p.compareAt && <p className="text-[14px] text-muted-foreground line-through">{brl(p.compareAt)}</p>}
              <p className="text-[32px] font-extrabold text-teal-dark">{brl(p.price)}</p>
              <p className="text-[13px] text-muted-foreground">
                ou {INSTALLMENTS}x de {brl(installment(p.price))}
              </p>
            </div>

            <div className="mt-6 flex items-center gap-3">
              <span className="text-[13px] font-medium text-navy">Quantidade</span>
              <div className="flex items-center rounded-lg border border-black/10 bg-white">
                <button aria-label="Diminuir" className="p-2.5" onClick={() => setQty((q) => Math.max(1, q - 1))}>
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-8 text-center text-[15px] font-semibold">{qty}</span>
                <button aria-label="Aumentar" className="p-2.5" onClick={() => setQty((q) => Math.min(99, q + 1))}>
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>

            <button
              onClick={buyNow}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-teal py-4 text-[16px] font-bold uppercase text-white shadow-md hover:bg-teal-dark"
            >
              <Lock className="h-4 w-4" /> Comprar agora
            </button>
            <button
              onClick={() => cart.add(p.slug, qty)}
              className="mt-3 w-full rounded-xl border-2 border-teal py-3.5 text-[14px] font-bold uppercase text-teal-dark hover:bg-teal-soft"
            >
              Adicionar ao carrinho
            </button>

            <div className="mt-6 grid grid-cols-3 gap-2 text-center text-[11px] text-navy/80">
              <div className="flex flex-col items-center gap-1 rounded-lg bg-white p-3">
                <ShieldCheck className="h-5 w-5 text-teal" /> Compra segura
              </div>
              <div className="flex flex-col items-center gap-1 rounded-lg bg-white p-3">
                <Truck className="h-5 w-5 text-teal" /> Envio com rastreio
              </div>
              <div className="flex flex-col items-center gap-1 rounded-lg bg-white p-3">
                <RefreshCw className="h-5 w-5 text-teal" /> Troca em 7 dias
              </div>
            </div>
          </div>
        </div>

        <section className="mx-auto mt-16 max-w-3xl">
          <h2 className="text-center text-[24px] font-bold text-navy">Por que escolher este produto?</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {p.bullets.map((b, i) => (
              <div key={b} className="rounded-2xl bg-white p-5 text-center shadow-sm">
                <span className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-teal text-[16px] font-bold text-white">
                  {i + 1}
                </span>
                <p className="mt-3 text-[14px] text-navy/80">{b}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto mt-16 max-w-3xl rounded-2xl bg-navy p-8 text-center text-white">
          <ShieldCheck className="mx-auto h-10 w-10 text-teal" />
          <h2 className="mt-3 text-[24px] font-bold">Satisfação garantida ou seu dinheiro de volta</h2>
          <p className="mx-auto mt-2 max-w-xl text-[14px] text-white/80">
            Você tem 7 dias após o recebimento para testar. Se não ficar satisfeito, devolvemos o valor pago.
          </p>
        </section>

        <section className="mx-auto mt-16 max-w-3xl">
          <h2 className="text-center text-[24px] font-bold text-navy">Dúvidas frequentes</h2>
          <div className="mt-6 space-y-2">
            {FAQ.map((f) => (
              <details key={f.q} className="group rounded-xl bg-white p-5 shadow-sm">
                <summary className="flex cursor-pointer list-none items-center justify-between text-[15px] font-semibold text-navy">
                  {f.q}
                  <ChevronDown className="h-4 w-4 transition group-open:rotate-180" />
                </summary>
                <p className="mt-3 text-[14px] text-navy/75">{f.a}</p>
              </details>
            ))}
          </div>
          <p className="mt-6 text-center text-[14px] text-navy/80">
            Ficou com alguma dúvida?{" "}
            <a href={`https://wa.me/${brand.whatsappE164}`} className="font-semibold text-teal underline">
              Fale com a gente no WhatsApp
            </a>
          </p>
        </section>

        {related.length > 0 && (
          <section className="mt-16">
            <h2 className="text-[22px] font-bold text-navy">Você também pode gostar</h2>
            <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
              {related.map((r) => (
                <ProductCard key={r.slug} product={r} />
              ))}
            </div>
          </section>
        )}
      </div>
    </StoreLayout>
  );
}
