import { createFileRoute, Link } from "@tanstack/react-router";
import { useRef } from "react";
import { ArrowRight, Check, ChevronLeft, ChevronRight, Instagram, PackageSearch, ShieldCheck, X } from "lucide-react";
import { CATEGORIES, PRODUCTS } from "@/lib/catalog";
import { StoreLayout } from "@/components/store/Layout";
import { ProductCard } from "@/components/store/ProductCard";
import { CategoryIcon } from "@/components/store/ProductImage";

export const Route = createFileRoute("/")({
  component: Home,
});

const featured = PRODUCTS.filter((p) => p.featured);
const highlights = [...featured, ...PRODUCTS.filter((p) => !p.featured && p.compareAt).slice(0, 8)];
const showcase = PRODUCTS.filter((p) => !p.featured).slice(0, 8);

function Home() {
  return (
    <StoreLayout>
      <Hero />
      <Highlights />
      <Categories />
      <section className="mx-auto max-w-7xl px-4 pt-16">
        <div className="text-center">
          <h2 className="text-[26px] font-bold text-navy md:text-[30px]">Conheça nossos produtos</h2>
          <p className="mt-1 text-[14px] text-muted-foreground">Somos a Movvi</p>
        </div>
        <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
          {showcase.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
        <div className="mt-8 text-center">
          <Link to="/produtos" className="inline-flex items-center gap-2 rounded-lg bg-navy px-8 py-3 text-[14px] font-bold uppercase text-white hover:opacity-90">
            Ver todos os produtos <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
      <WhyUs />
      <InfoBanners />
    </StoreLayout>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-teal-soft via-white to-teal-soft">
      <div className="pointer-events-none absolute -right-20 -top-20 h-80 w-80 rounded-full bg-teal/15 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -left-10 h-72 w-72 rounded-full bg-navy/10 blur-3xl" />
      <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-4 py-14 md:grid-cols-2 md:py-20">
        <div>
          <p className="text-[12px] font-bold uppercase tracking-[0.2em] text-teal-dark">Bem-estar em movimento</p>
          <h1 className="mt-3 text-[38px] font-extrabold leading-[1.05] tracking-tight text-navy md:text-[56px]">
            Sua <span className="text-teal">saúde</span> é a nossa <span className="text-teal">prioridade</span>.
          </h1>
          <p className="mt-4 max-w-md text-[16px] leading-relaxed text-navy/70">
            Produtos para cuidar dos pés, pernas, coluna e mãos no conforto da sua casa, para você seguir ativo e com
            mais disposição.
          </p>
          <Link
            to="/produtos"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-navy px-8 py-4 text-[15px] font-bold text-white shadow-lg hover:opacity-90"
          >
            Conhecer produtos <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {CATEGORIES.map((c, i) => (
            <Link
              key={c.id}
              to="/produtos"
              search={{ categoria: c.id }}
              className={`flex aspect-square flex-col items-center justify-center gap-2 rounded-2xl p-3 text-center shadow-sm transition hover:-translate-y-1 ${
                i % 2 === 0 ? "bg-teal text-white" : "bg-white text-navy"
              }`}
            >
              <CategoryIcon id={c.id} className="h-9 w-9" />
              <span className="text-[12px] font-semibold leading-tight">{c.short}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function Highlights() {
  const ref = useRef<HTMLDivElement>(null);
  const scroll = (dir: 1 | -1) => ref.current?.scrollBy({ left: dir * ref.current.clientWidth * 0.8, behavior: "smooth" });
  return (
    <section className="mx-auto max-w-7xl px-4 pt-14">
      <div className="flex items-end justify-between">
        <h2 className="text-[24px] font-bold text-navy md:text-[28px]">Destaques da Semana</h2>
        <div className="hidden gap-2 md:flex">
          <button aria-label="Anterior" onClick={() => scroll(-1)} className="rounded-full border border-black/10 bg-white p-2 hover:bg-teal-soft">
            <ChevronLeft className="h-5 w-5 text-navy" />
          </button>
          <button aria-label="Próximo" onClick={() => scroll(1)} className="rounded-full border border-black/10 bg-white p-2 hover:bg-teal-soft">
            <ChevronRight className="h-5 w-5 text-navy" />
          </button>
        </div>
      </div>
      <div ref={ref} className="mt-6 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 [scrollbar-width:none]">
        {highlights.map((p) => (
          <div key={p.slug} className="w-[46%] shrink-0 snap-start sm:w-[31%] lg:w-[23.5%]">
            <ProductCard product={p} />
          </div>
        ))}
      </div>
      <div className="mt-4 text-center">
        <Link to="/produtos" className="inline-block rounded-lg bg-teal px-10 py-3 text-[14px] font-bold uppercase text-white hover:bg-teal-dark">
          Ver tudo
        </Link>
      </div>
    </section>
  );
}

function Categories() {
  return (
    <section className="mx-auto max-w-7xl px-4 pt-16">
      <div className="grid grid-cols-3 gap-6 md:grid-cols-6">
        {CATEGORIES.map((c) => (
          <Link key={c.id} to="/produtos" search={{ categoria: c.id }} className="group flex flex-col items-center gap-3 text-center">
            <span className="flex h-20 w-20 items-center justify-center rounded-full bg-teal text-white transition group-hover:scale-105 md:h-24 md:w-24">
              <CategoryIcon id={c.id} className="h-10 w-10" />
            </span>
            <span className="text-[13px] font-semibold leading-tight text-navy">{c.name}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}

function WhyUs() {
  const rows = ["Qualidade", "Custo-benefício", "Atendimento", "Garantia"];
  return (
    <section className="mt-20 bg-teal">
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-14 md:grid-cols-2">
        <div className="text-white">
          <h2 className="text-[28px] font-bold md:text-[34px]">Por que comprar com a gente?</h2>
          <p className="mt-3 max-w-md text-[15px] text-white/85">
            Selecionamos produtos práticos para o dia a dia, com atendimento de verdade antes e depois da compra.
          </p>
        </div>
        <div className="overflow-hidden rounded-2xl bg-white shadow-xl">
          <table className="w-full text-[14px]">
            <thead>
              <tr className="bg-navy text-white">
                <th className="px-5 py-3 text-left font-semibold" />
                <th className="px-5 py-3 font-semibold">Movvi</th>
                <th className="px-5 py-3 font-semibold text-white/70">Outros</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r} className="border-t border-black/5">
                  <td className="px-5 py-3 font-medium text-navy">{r}</td>
                  <td className="px-5 py-3 text-center">
                    <Check className="mx-auto h-5 w-5 text-teal" />
                  </td>
                  <td className="px-5 py-3 text-center">
                    <X className="mx-auto h-5 w-5 text-red-400" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

function InfoBanners() {
  const items = [
    {
      Icon: ShieldCheck,
      title: "Compra protegida",
      text: "Ambiente seguro, dados criptografados e troca garantida em até 7 dias.",
      to: "/politicas/$tipo" as const,
      params: { tipo: "trocas" },
      cta: "Ver política de trocas",
    },
    {
      Icon: Instagram,
      title: "Siga a Movvi",
      text: "Dicas de exercícios, cuidados e novidades nas nossas redes sociais.",
      to: "/contato" as const,
      params: undefined,
      cta: "Falar com a gente",
    },
    {
      Icon: PackageSearch,
      title: "Pedido + código de rastreio",
      text: "Acompanhe cada etapa da entrega com o código enviado por e-mail.",
      to: "/rastreio" as const,
      params: undefined,
      cta: "Rastrear pedido",
    },
  ];
  return (
    <section className="mx-auto grid max-w-7xl gap-4 px-4 pt-16 md:grid-cols-3">
      {items.map(({ Icon, title, text, to, params, cta }) => (
        <div key={title} className="flex flex-col rounded-2xl bg-gradient-to-br from-navy to-teal-dark p-7 text-white">
          <Icon className="h-9 w-9" />
          <h3 className="mt-4 text-[20px] font-bold">{title}</h3>
          <p className="mt-2 flex-1 text-[14px] text-white/80">{text}</p>
          <Link to={to} params={params as never} className="mt-5 text-[13px] font-semibold underline underline-offset-4">
            {cta}
          </Link>
        </div>
      ))}
    </section>
  );
}
