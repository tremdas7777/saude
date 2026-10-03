import { Link, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent, type ReactNode } from "react";
import { Lock, Menu, MessageCircle, Minus, Plus, RefreshCw, Search, ShieldCheck, ShoppingBag, Trash2 } from "lucide-react";
import { brand } from "@/lib/brand";
import { useCart } from "@/lib/cart";
import { brl } from "@/lib/catalog";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { ProductImage } from "./ProductImage";

const NAV = [
  { to: "/", label: "Início" },
  { to: "/produtos", label: "Produtos" },
  { to: "/rastreio", label: "Rastrear Pedido" },
  { to: "/contato", label: "Contato" },
] as const;

const ANNOUNCEMENTS = ["Sua vida ativa e com menos dores", "Compra 100% segura", "Troca garantida em até 7 dias"];

export function Logo({ light = false }: { light?: boolean }) {
  return (
    <span className="flex flex-col leading-none">
      <span className={`text-[28px] font-extrabold tracking-tight ${light ? "text-white" : "text-navy"}`}>
        mov<span className="text-teal">vi</span>
      </span>
      <span className={`text-[9px] font-medium uppercase tracking-[0.18em] ${light ? "text-white/70" : "text-navy/60"}`}>
        bem-estar em movimento
      </span>
    </span>
  );
}

function AnnouncementBar() {
  const items = [...ANNOUNCEMENTS, ...ANNOUNCEMENTS, ...ANNOUNCEMENTS, ...ANNOUNCEMENTS];
  return (
    <div className="overflow-hidden bg-teal py-2 text-[12px] font-semibold text-white">
      <div className="flex w-max animate-[movvi-marquee_40s_linear_infinite] gap-12 whitespace-nowrap">
        {items.map((t, i) => (
          <span key={i} className="flex items-center gap-2">
            <span aria-hidden>✦</span> {t}
          </span>
        ))}
      </div>
    </div>
  );
}

function Header() {
  const cart = useCart();
  const navigate = useNavigate();
  const [menu, setMenu] = useState(false);
  const [searching, setSearching] = useState(false);
  const [q, setQ] = useState("");

  const submit = (e: FormEvent) => {
    e.preventDefault();
    setSearching(false);
    navigate({ to: "/produtos", search: { q: q.trim() || undefined } });
  };

  return (
    <header className="sticky top-0 z-40 border-b border-black/5 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 md:h-20">
        <button className="md:hidden" aria-label="Abrir menu" onClick={() => setMenu(true)}>
          <Menu className="h-6 w-6 text-navy" />
        </button>
        <Link to="/" aria-label={brand.name}>
          <Logo />
        </Link>
        <nav className="ml-8 hidden gap-7 md:flex">
          {NAV.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              className="text-[14px] font-medium text-navy/80 hover:text-teal"
              activeProps={{ className: "text-teal" }}
              activeOptions={{ exact: n.to === "/" }}
            >
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-4">
          <button aria-label="Buscar" onClick={() => setSearching((v) => !v)}>
            <Search className="h-5 w-5 text-navy" />
          </button>
          <button aria-label="Abrir carrinho" className="relative" onClick={() => cart.setOpen(true)}>
            <ShoppingBag className="h-5 w-5 text-navy" />
            {cart.count > 0 && (
              <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-teal px-1 text-[10px] font-bold text-white">
                {cart.count}
              </span>
            )}
          </button>
        </div>
      </div>

      {searching && (
        <form onSubmit={submit} className="border-t border-black/5 bg-white px-4 py-3">
          <div className="mx-auto flex max-w-3xl items-center gap-2 rounded-lg border border-black/10 px-3">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input
              autoFocus
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="O que você procura? Ex.: joelho, coluna, pés..."
              className="h-11 flex-1 bg-transparent text-base outline-none md:text-sm"
            />
          </div>
        </form>
      )}

      <Sheet open={menu} onOpenChange={setMenu}>
        <SheetContent side="left" className="w-72">
          <SheetHeader>
            <SheetTitle>
              <Logo />
            </SheetTitle>
          </SheetHeader>
          <nav className="mt-6 flex flex-col gap-1 px-4">
            {NAV.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                onClick={() => setMenu(false)}
                className="rounded-md px-3 py-3 text-[15px] font-medium text-navy hover:bg-teal-soft"
              >
                {n.label}
              </Link>
            ))}
          </nav>
        </SheetContent>
      </Sheet>
    </header>
  );
}

function CartDrawer() {
  const cart = useCart();
  return (
    <Sheet open={cart.open} onOpenChange={cart.setOpen}>
      <SheetContent className="flex w-full flex-col p-0 sm:max-w-md">
        <SheetHeader className="border-b border-black/5 p-5">
          <SheetTitle className="text-navy">Seu carrinho ({cart.count})</SheetTitle>
        </SheetHeader>
        {cart.lines.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 p-6 text-center">
            <ShoppingBag className="h-10 w-10 text-teal" />
            <p className="text-sm text-muted-foreground">Seu carrinho está vazio.</p>
            <Link
              to="/produtos"
              onClick={() => cart.setOpen(false)}
              className="rounded-lg bg-teal px-6 py-3 text-sm font-bold text-white"
            >
              Ver produtos
            </Link>
          </div>
        ) : (
          <>
            <ul className="flex-1 divide-y divide-black/5 overflow-y-auto px-5">
              {cart.lines.map(({ product: p, qty }) => (
                <li key={p.slug} className="flex gap-3 py-4">
                  <ProductImage product={p} className="h-20 w-20 shrink-0 rounded-lg border border-black/5 p-2" />
                  <div className="flex flex-1 flex-col">
                    <p className="text-[13px] font-medium leading-snug text-navy">{p.name}</p>
                    <p className="mt-1 text-[14px] font-bold text-teal-dark">{brl(p.price)}</p>
                    <div className="mt-auto flex items-center justify-between pt-2">
                      <div className="flex items-center rounded-md border border-black/10">
                        <button aria-label="Diminuir" className="p-1.5" onClick={() => cart.setQty(p.slug, qty - 1)}>
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="w-7 text-center text-[13px]">{qty}</span>
                        <button aria-label="Aumentar" className="p-1.5" onClick={() => cart.setQty(p.slug, qty + 1)}>
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <button aria-label="Remover" onClick={() => cart.remove(p.slug)}>
                        <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <div className="border-t border-black/5 p-5">
              <div className="flex justify-between text-[15px] font-bold text-navy">
                <span>Subtotal</span>
                <span>{brl(cart.subtotal)}</span>
              </div>
              <Link
                to="/checkout"
                onClick={() => cart.setOpen(false)}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-teal py-3.5 text-[15px] font-bold uppercase text-white hover:bg-teal-dark"
              >
                <Lock className="h-4 w-4" /> Finalizar compra
              </Link>
              <button
                onClick={() => cart.setOpen(false)}
                className="mt-2 w-full py-2 text-[13px] text-muted-foreground underline"
              >
                Continuar comprando
              </button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}

function Footer() {
  return (
    <footer className="mt-20">
      <div className="mx-auto grid max-w-5xl grid-cols-3 gap-4 px-4 pb-10 text-center">
        {[
          { Icon: ShieldCheck, t: "Loja confiável", s: "Compra 100% segura" },
          { Icon: Lock, t: "Dados protegidos", s: "Ambiente criptografado" },
          { Icon: RefreshCw, t: "Troca garantida", s: "Em até 7 dias" },
        ].map(({ Icon, t, s }) => (
          <div key={t} className="flex flex-col items-center gap-1.5">
            <Icon className="h-6 w-6 text-teal" />
            <p className="text-[13px] font-semibold text-navy">{t}</p>
            <p className="text-[11px] text-muted-foreground">{s}</p>
          </div>
        ))}
      </div>
      <svg viewBox="0 0 1440 60" preserveAspectRatio="none" className="block h-8 w-full text-teal" aria-hidden>
        <path d="M0 30 C 240 60 480 0 720 30 S 1200 60 1440 30 V60 H0 Z" fill="currentColor" />
      </svg>
      <div className="bg-teal text-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 md:grid-cols-4">
          <div>
            <Logo light />
            <p className="mt-4 text-[13px] text-white/80">{brand.tagline}.</p>
          </div>
          <div>
            <h3 className="text-[16px] font-bold">Precisa de ajuda?</h3>
            <ul className="mt-4 space-y-2 text-[13px] text-white/85">
              <li>Atendimento: {brand.hours}</li>
              <li>
                <a href={`https://wa.me/${brand.whatsappE164}`} className="inline-flex items-center gap-1.5 hover:underline">
                  <MessageCircle className="h-4 w-4" /> WhatsApp: {brand.whatsappDisplay}
                </a>
              </li>
              <li>E-mail: {brand.email}</li>
            </ul>
          </div>
          <div>
            <h3 className="text-[16px] font-bold">Institucional</h3>
            <ul className="mt-4 space-y-2 text-[13px] text-white/85">
              <li><Link to="/sobre" className="hover:underline">Sobre nós</Link></li>
              <li><Link to="/rastreio" className="hover:underline">Rastrear pedido</Link></li>
              <li><Link to="/politicas/$tipo" params={{ tipo: "trocas" }} className="hover:underline">Trocas e devoluções</Link></li>
              <li><Link to="/politicas/$tipo" params={{ tipo: "envio" }} className="hover:underline">Política de envio</Link></li>
              <li><Link to="/politicas/$tipo" params={{ tipo: "privacidade" }} className="hover:underline">Política de privacidade</Link></li>
              <li><Link to="/politicas/$tipo" params={{ tipo: "termos" }} className="hover:underline">Termos de uso</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-[16px] font-bold">Dados fiscais</h3>
            <ul className="mt-4 space-y-2 text-[13px] text-white/85">
              <li><b>Razão social:</b> {brand.legalName}</li>
              <li><b>CNPJ:</b> {brand.cnpj}</li>
              <li><b>Endereço:</b> {brand.address}</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/15 py-5 text-center text-[12px] text-white/70">
          © {new Date().getFullYear()} {brand.name}. Todos os direitos reservados. Os produtos não substituem
          avaliação médica ou fisioterapêutica.
        </div>
      </div>
    </footer>
  );
}

export function StoreLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-[#f7f9fa]">
      <AnnouncementBar />
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <CartDrawer />
    </div>
  );
}

