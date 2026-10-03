import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, Check, ChevronLeft, ChevronRight, MessageCircle, RefreshCw, ShieldCheck, Truck, X, Zap } from "lucide-react";
import { brand } from "@/lib/brand";
import { CATEGORIES, PRODUCTS, type CategoryId } from "@/lib/catalog";
import { StoreLayout } from "@/components/store/Layout";
import { ProductCard } from "@/components/store/ProductCard";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  component: Home,
});

const featured = PRODUCTS.filter((p) => p.featured);
const highlights = [...featured, ...PRODUCTS.filter((p) => !p.featured && p.compareAt).slice(0, 8)];
const showcase = PRODUCTS.filter((p) => !p.featured).slice(0, 8);

const SLIDES: {
  desktop: string;
  mobile: string;
  eyebrow: string;
  title: string;
  text: string;
  cta: string;
  to: CategoryId | undefined;
}[] = [
  {
    desktop: "/img/hero-casal-desktop.jpg",
    mobile: "/img/hero-casal-mobile.jpg",
    eyebrow: "Bem-estar em movimento",
    title: "Sua saúde é a nossa prioridade.",
    text: "Produtos para cuidar dos pés, pernas, coluna e mãos no conforto da sua casa.",
    cta: "Conhecer produtos",
    to: undefined,
  },
  {
    desktop: "/img/hero-pernas-desktop.jpg",
    mobile: "/img/hero-pernas-mobile.jpg",
    eyebrow: "Pés e pernas",
    title: "Pernas leves no fim do dia.",
    text: "Massageadores de compressão, meias e palmilhas para quem passa o dia em pé.",
    cta: "Ver pés e pernas",
    to: "pes-pernas",
  },
  {
    desktop: "/img/hero-joelho-desktop.jpg",
    mobile: "/img/hero-joelho-mobile.jpg",
    eyebrow: "Articulações",
    title: "Cuide dos joelhos sem sair de casa.",
    text: "Calor, vibração e compressão em aparelhos sem fio e fáceis de usar.",
    cta: "Ver massageadores",
    to: "pes-pernas",
  },
];

const CATEGORY_IMG: Record<CategoryId, string> = {
  "pes-pernas": "/img/cat-pes-pernas.jpg",
  "quadril-coluna": "/img/cat-quadril-coluna.jpg",
  "maos-bracos": "/img/cat-maos-bracos.jpg",
  cuidados: "/img/cat-cuidados.jpg",
  exercicios: "/img/cat-exercicios.jpg",
  "led-terapia": "/img/cat-led-terapia.jpg",
};

function Home() {
  return (
    <StoreLayout>
      <HeroCarousel />
      <TrustBar />
      <Highlights />
      <Categories />
      <section className="mx-auto max-w-7xl px-4 pt-16 md:pt-20">
        <SectionTitle title="Conheça nossos produtos" subtitle="Seleção Movvi para o seu dia a dia" />
        <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-5">
          {showcase.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
        <div className="mt-8 text-center">
          <Link
            to="/produtos"
            className="inline-flex items-center gap-2 rounded-full border-2 border-navy px-8 py-3 text-[14px] font-bold text-navy transition hover:bg-navy hover:text-white"
          >
            Ver todos os produtos <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
      <WhyUs />
      <InfoBanners />
    </StoreLayout>
  );
}

function SectionTitle({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="text-center">
      <h2 className="text-[24px] font-bold tracking-tight text-navy md:text-[32px]">{title}</h2>
      {subtitle && <p className="mt-1 text-[14px] text-navy/60 md:text-[15px]">{subtitle}</p>}
    </div>
  );
}

function HeroCarousel() {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const n = SLIDES.length;
  const go = (d: number) => setI((v) => (v + d + n) % n);

  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => setI((v) => (v + 1) % n), 6000);
    return () => clearInterval(t);
  }, [paused, n]);

  // Arrastar com o dedo no celular.
  const touchX = useRef<number | null>(null);

  return (
    <section
      className="relative overflow-hidden bg-white"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={(e) => (touchX.current = e.touches[0]?.clientX ?? null)}
      onTouchEnd={(e) => {
        const start = touchX.current;
        const end = e.changedTouches[0]?.clientX;
        if (start != null && end != null && Math.abs(end - start) > 40) go(end < start ? 1 : -1);
        touchX.current = null;
      }}
      aria-roledescription="carrossel"
    >
      <div className="flex transition-transform duration-700 ease-out" style={{ transform: `translateX(-${i * 100}%)` }}>
        {SLIDES.map((s, idx) => (
          <div key={s.desktop} className="w-full shrink-0" aria-hidden={idx !== i}>
            {/* Celular: foto em cima, texto embaixo */}
            <div className="md:hidden">
              <img
                src={s.mobile}
                alt=""
                className="aspect-[4/4.2] w-full object-cover"
                loading={idx === 0 ? "eager" : "lazy"}
                fetchPriority={idx === 0 ? "high" : "auto"}
              />
              <div className="bg-navy px-5 pb-10 pt-7 text-white">
                <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-teal">{s.eyebrow}</p>
                <h2 className="mt-2 text-[28px] font-extrabold leading-[1.1] tracking-tight">{s.title}</h2>
                <p className="mt-3 text-[15px] leading-relaxed text-white/80">{s.text}</p>
                <SlideCta to={s.to} label={s.cta} tabIndex={idx === i ? 0 : -1} />
              </div>
            </div>
            {/* Computador: foto inteira com texto à esquerda */}
            <div className="relative hidden h-[560px] md:block lg:h-[620px]">
              <img
                src={s.desktop}
                alt=""
                className="absolute inset-0 h-full w-full object-cover object-right"
                loading={idx === 0 ? "eager" : "lazy"}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-white via-white/85 via-40% to-transparent to-65%" />
              <div className="relative mx-auto flex h-full max-w-7xl items-center px-6">
                <div className="max-w-lg">
                  <p className="text-[12px] font-bold uppercase tracking-[0.22em] text-teal-dark">{s.eyebrow}</p>
                  <h2 className="mt-3 text-[52px] font-extrabold leading-[1.02] tracking-tight text-navy lg:text-[60px]">
                    {s.title}
                  </h2>
                  <p className="mt-4 text-[17px] leading-relaxed text-navy/70">{s.text}</p>
                  <SlideCta to={s.to} label={s.cta} tabIndex={idx === i ? 0 : -1} dark />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button
        aria-label="Banner anterior"
        onClick={() => go(-1)}
        className="absolute left-4 top-1/2 hidden -translate-y-1/2 rounded-full bg-white/80 p-2.5 shadow-md backdrop-blur hover:bg-white md:block"
      >
        <ChevronLeft className="h-5 w-5 text-navy" />
      </button>
      <button
        aria-label="Próximo banner"
        onClick={() => go(1)}
        className="absolute right-4 top-1/2 hidden -translate-y-1/2 rounded-full bg-white/80 p-2.5 shadow-md backdrop-blur hover:bg-white md:block"
      >
        <ChevronRight className="h-5 w-5 text-navy" />
      </button>
      <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 md:bottom-6">
        {SLIDES.map((s, idx) => (
          <button
            key={s.desktop}
            aria-label={`Ir para o banner ${idx + 1}`}
            onClick={() => setI(idx)}
            className={cn("h-2 rounded-full transition-all", idx === i ? "w-7 bg-teal" : "w-2 bg-white/60 md:bg-navy/25")}
          />
        ))}
      </div>
    </section>
  );
}

function SlideCta({ to, label, tabIndex, dark }: { to: CategoryId | undefined; label: string; tabIndex: number; dark?: boolean }) {
  return (
    <Link
      to="/produtos"
      search={to ? { categoria: to } : {}}
      tabIndex={tabIndex}
      className={cn(
        "mt-6 inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-[15px] font-bold shadow-lg transition",
        dark ? "bg-navy text-white hover:bg-teal-dark" : "bg-teal text-white hover:bg-teal-dark",
      )}
    >
      {label} <ArrowRight className="h-4 w-4" />
    </Link>
  );
}

function TrustBar() {
  const items = [
    { Icon: Truck, t: "Envio para todo o Brasil", s: "Com código de rastreio" },
    { Icon: Zap, t: "Pix com aprovação na hora", s: "Pedido confirmado na hora" },
    { Icon: RefreshCw, t: "Troca em até 7 dias", s: "Direito garantido por lei" },
    { Icon: MessageCircle, t: "Atendimento no WhatsApp", s: brand.hours },
  ];
  return (
    <section className="border-b border-black/5 bg-white">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-x-4 gap-y-5 px-4 py-6 md:grid-cols-4 md:py-7">
        {items.map(({ Icon, t, s }) => (
          <div key={t} className="flex items-center gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-teal-soft">
              <Icon className="h-5 w-5 text-teal-dark" />
            </span>
            <div className="min-w-0">
              <p className="text-[13px] font-semibold leading-tight text-navy">{t}</p>
              <p className="text-[11px] leading-tight text-navy/55">{s}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Highlights() {
  const ref = useRef<HTMLDivElement>(null);
  const scroll = (dir: 1 | -1) => ref.current?.scrollBy({ left: dir * ref.current.clientWidth * 0.8, behavior: "smooth" });
  return (
    <section className="mx-auto max-w-7xl px-4 pt-12 md:pt-16">
      <div className="flex items-end justify-between">
        <h2 className="text-[22px] font-bold tracking-tight text-navy md:text-[30px]">Destaques da Semana</h2>
        <div className="flex gap-2">
          <button aria-label="Anterior" onClick={() => scroll(-1)} className="rounded-full border border-black/10 bg-white p-2 hover:border-teal">
            <ChevronLeft className="h-5 w-5 text-navy" />
          </button>
          <button aria-label="Próximo" onClick={() => scroll(1)} className="rounded-full border border-black/10 bg-white p-2 hover:border-teal">
            <ChevronRight className="h-5 w-5 text-navy" />
          </button>
        </div>
      </div>
      <div ref={ref} className="-mx-4 mt-6 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2 [scrollbar-width:none] md:gap-5">
        {highlights.map((p) => (
          <div key={p.slug} className="w-[47%] shrink-0 snap-start sm:w-[31%] lg:w-[23%]">
            <ProductCard product={p} />
          </div>
        ))}
      </div>
    </section>
  );
}

function Categories() {
  return (
    <section className="mx-auto max-w-7xl px-4 pt-16 md:pt-20">
      <SectionTitle title="Compre por categoria" subtitle="Encontre o cuidado certo para cada parte do corpo" />
      <div className="-mx-4 mt-8 flex snap-x gap-3 overflow-x-auto px-4 pb-2 [scrollbar-width:none] md:mx-0 md:grid md:grid-cols-6 md:gap-4 md:overflow-visible md:px-0">
        {CATEGORIES.map((c) => (
          <Link
            key={c.id}
            to="/produtos"
            search={{ categoria: c.id }}
            className="group relative w-[40%] shrink-0 snap-start overflow-hidden rounded-2xl sm:w-[28%] md:w-auto"
          >
            <img
              src={CATEGORY_IMG[c.id]}
              alt={c.name}
              loading="lazy"
              className="aspect-[3/4] w-full object-cover transition duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-navy/85 via-navy/10 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-3 md:p-4">
              <p className="text-[14px] font-bold leading-tight text-white md:text-[15px]">{c.short}</p>
              <p className="mt-1 flex items-center gap-1 text-[11px] font-medium text-white/80">
                Ver produtos <ArrowRight className="h-3 w-3" />
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

function WhyUs() {
  const rows = ["Qualidade", "Custo-benefício", "Atendimento", "Garantia"];
  return (
    <section className="mt-16 bg-navy md:mt-24">
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-14 md:grid-cols-2 md:py-20">
        <div className="text-white">
          <p className="text-[12px] font-bold uppercase tracking-[0.2em] text-teal">Por que a Movvi</p>
          <h2 className="mt-2 text-[28px] font-bold leading-tight tracking-tight md:text-[38px]">
            Por que comprar com a gente?
          </h2>
          <p className="mt-4 max-w-md text-[15px] leading-relaxed text-white/75">
            Selecionamos produtos práticos para o dia a dia, com atendimento de verdade antes e depois da compra.
          </p>
        </div>
        <div className="overflow-hidden rounded-2xl bg-white shadow-2xl">
          <table className="w-full text-[14px] md:text-[15px]">
            <thead>
              <tr className="border-b border-black/5">
                <th className="px-5 py-4" />
                <th className="bg-teal-soft px-5 py-4 font-extrabold text-teal-dark">Movvi</th>
                <th className="px-5 py-4 font-semibold text-navy/45">Outros</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r} className="border-t border-black/5">
                  <td className="px-5 py-4 font-medium text-navy">{r}</td>
                  <td className="bg-teal-soft px-5 py-4 text-center">
                    <Check className="mx-auto h-5 w-5 text-teal-dark" strokeWidth={3} />
                  </td>
                  <td className="px-5 py-4 text-center">
                    <X className="mx-auto h-5 w-5 text-navy/25" />
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
      img: "/img/info-compra.jpg",
      Icon: ShieldCheck,
      title: "Compra protegida",
      text: "Ambiente seguro e troca garantida em até 7 dias após o recebimento.",
      to: "/politicas/$tipo" as const,
      params: { tipo: "trocas" },
      cta: "Política de trocas",
    },
    {
      img: "/img/info-redes.jpg",
      Icon: MessageCircle,
      title: "Fale com a Movvi",
      text: "Tire dúvidas sobre produtos e pedidos com o nosso atendimento.",
      to: "/contato" as const,
      params: undefined,
      cta: "Falar com a gente",
    },
    {
      img: "/img/info-rastreio.jpg",
      Icon: Truck,
      title: "Pedido + código de rastreio",
      text: "Acompanhe cada etapa da entrega com o código enviado por e-mail.",
      to: "/rastreio" as const,
      params: undefined,
      cta: "Rastrear pedido",
    },
  ];
  return (
    <section className="mx-auto grid max-w-7xl gap-4 px-4 pt-16 md:grid-cols-3 md:gap-5 md:pt-20">
      {items.map(({ img, Icon, title, text, to, params, cta }) => (
        <Link
          key={title}
          to={to}
          params={params as never}
          className="group relative block overflow-hidden rounded-2xl"
        >
          <img src={img} alt="" loading="lazy" className="aspect-[4/3] w-full object-cover transition duration-500 group-hover:scale-105" />
          <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/50 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-6 text-white">
            <Icon className="h-7 w-7 text-teal" />
            <h3 className="mt-2 text-[20px] font-bold">{title}</h3>
            <p className="mt-1 text-[13px] text-white/80">{text}</p>
            <span className="mt-3 inline-flex items-center gap-1 text-[13px] font-semibold text-teal">
              {cta} <ArrowRight className="h-3.5 w-3.5" />
            </span>
          </div>
        </Link>
      ))}
    </section>
  );
}
