import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation } from "@tanstack/react-query";
import { useEffect, useRef, useState, type FormEvent, type InputHTMLAttributes, type ReactNode } from "react";
import { Check, Loader2, Lock, ShieldCheck, Truck } from "lucide-react";
import { useCart } from "@/lib/cart";
import { brl } from "@/lib/catalog";
import { createPixCharge } from "@/lib/pix.functions";
import { savePixSession } from "@/lib/pix-session";
import { FREE_SHIPPING_MIN, FRETES, getFrete, isFreeShippingEligible, type FreteId } from "@/lib/shipping";
import { Logo } from "@/components/store/Layout";
import { PixLogo } from "@/components/store/PixLogo";
import { ProductImage } from "@/components/store/ProductImage";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/checkout")({
  head: () => ({ meta: [{ title: "Finalizar compra | Movvi" }, { name: "robots", content: "noindex" }] }),
  component: Checkout,
});

const digits = (v: string) => v.replace(/\D/g, "");
const maskCpf = (v: string) =>
  digits(v).slice(0, 11).replace(/(\d{3})(\d)/, "$1.$2").replace(/(\d{3})(\d)/, "$1.$2").replace(/(\d{3})(\d{1,2})$/, "$1-$2");
const maskPhone = (v: string) => digits(v).slice(0, 11).replace(/^(\d{2})(\d)/, "($1) $2").replace(/(\d{5})(\d{1,4})$/, "$1-$2");
const maskCep = (v: string) => digits(v).slice(0, 8).replace(/(\d{5})(\d)/, "$1-$2");
const emailOk = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

type Step = 1 | 2 | 3;

function Checkout() {
  const cart = useCart();
  const [step, setStep] = useState<Step>(1);
  const [id, setId] = useState({ name: "", email: "", cpf: "", phone: "" });
  const [addr, setAddr] = useState({ cep: "", rua: "", numero: "", bairro: "", complemento: "", cidade: "", uf: "" });
  const [cepLoading, setCepLoading] = useState(false);
  const navigate = useNavigate();
  const createFn = useServerFn(createPixCharge);

  // Frete grátis só a partir de FREE_SHIPPING_MIN em produtos (validado também no servidor).
  const freeEligible = isFreeShippingEligible(cart.subtotal);
  const [frete, setFrete] = useState<FreteId>("padrao");
  const wasEligible = useRef<boolean | null>(null);
  useEffect(() => {
    if (!freeEligible && frete === "gratis") setFrete("padrao");
    // Liberou o frete grátis (ou já entrou liberado): seleciona para o cliente.
    if (freeEligible && wasEligible.current !== true) setFrete("gratis");
    wasEligible.current = freeEligible;
  }, [freeEligible, frete]);
  const freteOpt = getFrete(frete);
  const total = cart.subtotal + freteOpt.price;

  const mutation = useMutation({
    mutationFn: () =>
      createFn({
        data: {
          ...id,
          endereco: `${addr.rua}, ${addr.numero}${addr.complemento ? ` - ${addr.complemento}` : ""} - ${addr.bairro}, ${addr.cidade}/${addr.uf}`,
          cep: addr.cep,
          frete,
          items: cart.lines.map((l) => ({ slug: l.product.slug, qty: l.qty })),
          origin: window.location.origin,
        },
      }),
    onSuccess: (c) => {
      savePixSession({
        id: c.id,
        qrcode: c.qrcode,
        amount: c.amount,
        createdAt: Date.now(),
        email: id.email,
        name: id.name,
        frete: { name: freteOpt.name, price: freteOpt.price },
        items: cart.lines.map((l) => ({ slug: l.product.slug, name: l.product.name, qty: l.qty, price: l.product.price })),
      });
      navigate({ to: "/pedido/$id", params: { id: c.id }, replace: true });
    },
  });

  useEffect(() => {
    const c = digits(addr.cep);
    if (c.length !== 8) return;
    let alive = true;
    setCepLoading(true);
    fetch(`https://viacep.com.br/ws/${c}/json/`)
      .then((r) => r.json())
      .then((j) => {
        if (!alive || j.erro) return;
        setAddr((a) => ({ ...a, rua: a.rua || j.logradouro, bairro: a.bairro || j.bairro, cidade: j.localidade, uf: j.uf }));
      })
      .catch(() => undefined)
      .finally(() => alive && setCepLoading(false));
    return () => {
      alive = false;
    };
  }, [addr.cep]);

  const idValid =
    id.name.trim().split(/\s+/).length >= 2 && emailOk(id.email) && digits(id.cpf).length === 11 && digits(id.phone).length >= 10;
  const addrValid = digits(addr.cep).length === 8 && !!addr.rua && !!addr.numero && !!addr.bairro && !!addr.cidade;

  if (cart.lines.length === 0) {
    return (
      <Shell>
        <div className="mx-auto max-w-md py-24 text-center">
          <p className="text-[16px] text-navy">Seu carrinho está vazio.</p>
          <Link to="/produtos" className="mt-5 inline-block rounded-lg bg-teal px-6 py-3 text-sm font-bold text-white">
            Voltar para a loja
          </Link>
        </div>
      </Shell>
    );
  }

  const submitId = (e: FormEvent) => {
    e.preventDefault();
    if (idValid) setStep(addrValid ? 3 : 2);
  };
  const submitAddr = (e: FormEvent) => {
    e.preventDefault();
    if (addrValid) setStep(3);
  };

  return (
    <Shell>
      <div className="mx-auto grid max-w-6xl gap-5 px-4 py-8 lg:grid-cols-[1fr_380px]">
        <div className="space-y-4">
          <Card active={step === 1} done={step > 1} n={1} title="Identificação" onEdit={() => setStep(1)}>
            {step === 1 ? (
              <form onSubmit={submitId} className="space-y-4">
                <Field label="Nome completo" autoComplete="name" value={id.name} onChange={(v) => setId({ ...id, name: v })} />
                <Field label="E-mail" type="email" autoComplete="email" value={id.email} onChange={(v) => setId({ ...id, email: v })} />
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="CPF" inputMode="numeric" value={id.cpf} onChange={(v) => setId({ ...id, cpf: maskCpf(v) })} />
                  <Field label="Celular / WhatsApp" inputMode="tel" value={id.phone} onChange={(v) => setId({ ...id, phone: maskPhone(v) })} />
                </div>
                <Button disabled={!idValid}>Ir para entrega</Button>
              </form>
            ) : (
              <Summary lines={[id.name, id.email, id.phone]} />
            )}
          </Card>

          <Card active={step === 2} done={step > 2} n={2} title="Entrega" onEdit={step > 2 ? () => setStep(2) : undefined}>
            {step === 2 ? (
              <form onSubmit={submitAddr} className="space-y-4">
                <div className="flex items-end gap-3">
                  <Field label="CEP" inputMode="numeric" value={addr.cep} onChange={(v) => setAddr({ ...addr, cep: maskCep(v) })} wrap="w-40" />
                  {cepLoading ? (
                    <Loader2 className="mb-3.5 h-4 w-4 animate-spin text-muted-foreground" />
                  ) : (
                    addr.cidade && <span className="pb-3.5 text-[13px] text-muted-foreground">{addr.cidade}/{addr.uf}</span>
                  )}
                </div>
                <Field label="Endereço" value={addr.rua} onChange={(v) => setAddr({ ...addr, rua: v })} />
                <div className="grid grid-cols-[110px_1fr] gap-3">
                  <Field label="Número" value={addr.numero} onChange={(v) => setAddr({ ...addr, numero: v })} />
                  <Field label="Bairro" value={addr.bairro} onChange={(v) => setAddr({ ...addr, bairro: v })} />
                </div>
                <Field label="Complemento (opcional)" value={addr.complemento} onChange={(v) => setAddr({ ...addr, complemento: v })} />
                <p className="pt-2 text-[15px] font-semibold text-navy">Escolha o frete</p>
                <FreeShippingProgress subtotal={cart.subtotal} />
                <div className="space-y-2">
                  {FRETES.map((f) => {
                    const locked = f.id === "gratis" && !freeEligible;
                    return (
                      <button
                        key={f.id}
                        type="button"
                        disabled={locked}
                        onClick={() => setFrete(f.id)}
                        className={cn(
                          "flex w-full items-center gap-3 rounded-lg border px-4 py-4 text-left",
                          frete === f.id ? "border-teal bg-teal-soft" : "border-black/10 bg-white",
                          locked && "cursor-not-allowed opacity-50",
                        )}
                      >
                        <span className={cn("flex h-4 w-4 items-center justify-center rounded-full border", frete === f.id ? "border-teal" : "border-black/30")}>
                          {frete === f.id && <span className="h-2 w-2 rounded-full bg-teal" />}
                        </span>
                        <span className="flex-1">
                          <span className="block text-[14px] font-medium text-navy">{f.name}</span>
                          <span className="text-[12px] text-muted-foreground">
                            {locked ? `Faltam ${brl(FREE_SHIPPING_MIN - cart.subtotal)} em produtos` : f.eta}
                          </span>
                        </span>
                        <span className="text-[14px] font-semibold text-navy">
                          {locked ? `Acima de ${brl(FREE_SHIPPING_MIN)}` : f.price ? brl(f.price) : "Grátis"}
                        </span>
                      </button>
                    );
                  })}
                </div>
                <Button disabled={!addrValid}>Ir para pagamento</Button>
              </form>
            ) : step > 2 ? (
              <Summary
                lines={[
                  `${addr.rua}, ${addr.numero}${addr.complemento ? ` - ${addr.complemento}` : ""}`,
                  `${addr.bairro}, ${addr.cidade}/${addr.uf} - ${addr.cep}`,
                  `${freteOpt.name} · ${freteOpt.price ? brl(freteOpt.price) : "Grátis"}`,
                ]}
              />
            ) : (
              <p className="text-[13px] text-muted-foreground">Preencha seus dados para continuar.</p>
            )}
          </Card>

          <Card active={step === 3} n={3} title="Pagamento">
            {step === 3 ? (
              <div className="rounded-xl border-2 border-teal bg-teal-soft/50 p-4">
                <p className="flex items-center gap-2 text-[15px] font-bold text-navy">
                  <PixLogo /> Pix
                </p>
                <ul className="mt-3 space-y-1 text-[13px] text-navy/75">
                  <li>• Aprovação na hora, pagando pelo app do seu banco</li>
                  <li>• O código Pix vale por 30 minutos</li>
                </ul>
                <p className="mt-4 text-[15px] text-navy">
                  Total no Pix: <b className="text-teal-dark">{brl(total)}</b>
                </p>
                {mutation.isError && (
                  <p role="alert" className="mt-3 text-[13px] text-red-600">
                    {mutation.error instanceof Error ? mutation.error.message : "Não foi possível gerar o Pix agora."}
                  </p>
                )}
                <button
                  type="button"
                  disabled={mutation.isPending}
                  onClick={() => mutation.mutate()}
                  className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-teal py-4 text-[15px] font-bold uppercase text-white transition hover:bg-teal-dark disabled:opacity-60"
                >
                  {mutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Lock className="h-4 w-4" />}
                  Finalizar compra
                </button>
              </div>
            ) : (
              <p className="text-[13px] text-muted-foreground">Preencha os dados de entrega para continuar.</p>
            )}
          </Card>
        </div>

        <aside className="h-fit rounded-2xl bg-white p-6 shadow-sm lg:sticky lg:top-6">
          <h2 className="text-[16px] font-bold text-navy">Resumo do pedido</h2>
          <ul className="mt-4 space-y-3">
            {cart.lines.map(({ product: p, qty }) => (
              <li key={p.slug} className="flex gap-3">
                <div className="relative">
                  <ProductImage product={p} className="h-14 w-14 rounded-lg border border-black/5 p-1" />
                  <span className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-navy text-[10px] font-bold text-white">
                    {qty}
                  </span>
                </div>
                <p className="flex-1 text-[13px] leading-snug text-navy">{p.name}</p>
                <span className="text-[13px] font-semibold text-navy">{brl(p.price * qty)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-5 space-y-2 border-t border-black/5 pt-4 text-[14px]">
            <div className="flex justify-between text-navy/80">
              <span>Subtotal</span>
              <span>{brl(cart.subtotal)}</span>
            </div>
            <div className="flex justify-between text-navy/80">
              <span>Frete</span>
              <span className="text-teal-dark">{step === 1 ? "Calculado na entrega" : freteOpt.price ? brl(freteOpt.price) : "Grátis"}</span>
            </div>
            <div className="flex justify-between pt-2 text-[17px] font-bold text-navy">
              <span>Total</span>
              <span>{brl(step === 1 ? cart.subtotal : total)}</span>
            </div>
          </div>
          <FreeShippingProgress subtotal={cart.subtotal} className="mt-4" />
          <p className="mt-5 flex items-center justify-center gap-1.5 text-[12px] text-muted-foreground">
            <ShieldCheck className="h-4 w-4 text-teal" /> Ambiente seguro e criptografado
          </p>
        </aside>
      </div>
    </Shell>
  );
}

function Shell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[#f7f9fa]">
      <header className="border-b border-black/5 bg-white">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <Link to="/" aria-label="Movvi">
            <Logo />
          </Link>
          <span className="flex items-center gap-1.5 text-[12px] font-medium text-navy/70">
            <Lock className="h-4 w-4 text-teal" /> Compra 100% segura
          </span>
        </div>
      </header>
      {children}
    </div>
  );
}

function Card({
  n,
  title,
  active,
  done,
  onEdit,
  children,
}: {
  n: number;
  title: string;
  active: boolean;
  done?: boolean;
  onEdit?: (() => void) | undefined;
  children: ReactNode;
}) {
  return (
    <section className={cn("rounded-2xl bg-white p-5 shadow-sm md:p-6", !active && !done && "opacity-60")}>
      <div className="mb-4 flex items-center gap-3">
        <span
          className={cn(
            "flex h-7 w-7 items-center justify-center rounded-full text-[13px] font-bold",
            done ? "bg-teal text-white" : active ? "bg-navy text-white" : "bg-black/10 text-navy",
          )}
        >
          {done ? <Check className="h-4 w-4" /> : n}
        </span>
        <h2 className="flex-1 text-[17px] font-bold text-navy">{title}</h2>
        {done && onEdit && (
          <button onClick={onEdit} className="text-[13px] font-medium text-teal underline">
            Editar
          </button>
        )}
      </div>
      {children}
    </section>
  );
}

function Summary({ lines }: { lines: string[] }) {
  return (
    <div className="space-y-0.5 text-[14px] text-navy/80">
      {lines.map((l) => (
        <p key={l}>{l}</p>
      ))}
    </div>
  );
}

function Field({
  label,
  onChange,
  wrap,
  ...rest
}: { label: string; onChange: (v: string) => void; wrap?: string } & Omit<InputHTMLAttributes<HTMLInputElement>, "onChange">) {
  return (
    <label className={cn("block", wrap)}>
      <span className="mb-1.5 block text-[13px] font-medium text-navy">{label}</span>
      <input
        {...rest}
        onChange={(e) => onChange(e.target.value)}
        className="h-12 w-full rounded-lg border border-black/10 bg-white px-3 text-base outline-none focus:border-teal focus:ring-1 focus:ring-teal md:text-[14px]"
      />
    </label>
  );
}

function Button({ disabled, children }: { disabled?: boolean; children: ReactNode }) {
  return (
    <button
      type="submit"
      disabled={disabled}
      className="w-full rounded-xl bg-teal py-4 text-[15px] font-bold uppercase text-white transition hover:bg-teal-dark disabled:opacity-50"
    >
      {children}
    </button>
  );
}

function FreeShippingProgress({ subtotal, className }: { subtotal: number; className?: string }) {
  const eligible = isFreeShippingEligible(subtotal);
  const pct = Math.min(100, Math.round((subtotal / FREE_SHIPPING_MIN) * 100));
  return (
    <div className={cn("rounded-lg border px-4 py-3 text-[13px]", eligible ? "border-teal bg-teal-soft" : "border-amber-300 bg-amber-50", className)}>
      <p className="flex items-center gap-2 text-navy">
        <Truck className={cn("h-4 w-4 shrink-0", eligible ? "text-teal" : "text-amber-600")} />
        {eligible ? (
          <span>
            Parabéns! Você ganhou <b className="text-teal-dark">FRETE GRÁTIS</b>
          </span>
        ) : (
          <span>
            Faltam <b>{brl(FREE_SHIPPING_MIN - subtotal)}</b> para você ganhar <b>FRETE GRÁTIS</b>
          </span>
        )}
      </p>
      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-black/10">
        <div className={cn("h-full rounded-full transition-all", eligible ? "bg-teal" : "bg-amber-500")} style={{ width: `${pct}%` }} />
      </div>
      {!eligible && (
        <Link to="/produtos" className="mt-2 inline-block text-[12px] font-semibold text-teal-dark underline">
          Adicionar mais produtos
        </Link>
      )}
    </div>
  );
}

