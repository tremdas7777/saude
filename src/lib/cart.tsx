import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { getProduct, type Product } from "@/lib/catalog";

const KEY = "movvi-cart";

export type CartLine = { product: Product; qty: number };

type Cart = {
  lines: CartLine[];
  count: number;
  subtotal: number;
  open: boolean;
  setOpen: (v: boolean) => void;
  add: (slug: string, qty?: number) => void;
  setQty: (slug: string, qty: number) => void;
  remove: (slug: string) => void;
  clear: () => void;
};

const CartContext = createContext<Cart | null>(null);

/** Carrinho salvo no navegador (localStorage), como `{ slug: quantidade }`. */
export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<Record<string, number>>({});
  const [loaded, setLoaded] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {
      // armazenamento indisponível
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(KEY, JSON.stringify(items));
    } catch {
      // armazenamento indisponível
    }
  }, [items, loaded]);

  const value = useMemo<Cart>(() => {
    const lines = Object.entries(items)
      .map(([slug, qty]) => ({ product: getProduct(slug), qty }))
      .filter((l): l is CartLine => !!l.product && l.qty > 0);
    return {
      lines,
      count: lines.reduce((s, l) => s + l.qty, 0),
      subtotal: lines.reduce((s, l) => s + l.qty * l.product.price, 0),
      open,
      setOpen,
      add: (slug, qty = 1) => {
        setItems((it) => ({ ...it, [slug]: (it[slug] ?? 0) + qty }));
        setOpen(true);
      },
      setQty: (slug, qty) => setItems((it) => ({ ...it, [slug]: Math.max(1, Math.min(99, qty)) })),
      remove: (slug) =>
        setItems((it) => {
          const { [slug]: _, ...rest } = it;
          return rest;
        }),
      clear: () => setItems({}),
    };
  }, [items, open]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const c = useContext(CartContext);
  if (!c) throw new Error("useCart fora do CartProvider");
  return c;
}
