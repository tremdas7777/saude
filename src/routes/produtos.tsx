import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { z } from "zod";
import { CATEGORIES, PRODUCTS, getCategory, type CategoryId } from "@/lib/catalog";
import { StoreLayout } from "@/components/store/Layout";
import { ProductCard } from "@/components/store/ProductCard";
import { cn } from "@/lib/utils";

const searchSchema = z.object({
  categoria: z.enum(CATEGORIES.map((c) => c.id) as [CategoryId, ...CategoryId[]]).optional(),
  q: z.string().max(80).optional(),
});

export const Route = createFileRoute("/produtos")({
  validateSearch: searchSchema,
  head: () => ({ meta: [{ title: "Produtos | Movvi" }] }),
  component: Products,
});

const SORTS = {
  relevancia: "Mais relevantes",
  menor: "Menor preço",
  maior: "Maior preço",
  desconto: "Maior desconto",
} as const;

const norm = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

function Products() {
  const { categoria, q } = Route.useSearch();
  const [sort, setSort] = useState<keyof typeof SORTS>("relevancia");
  const cat = categoria ? getCategory(categoria) : undefined;

  const list = useMemo(() => {
    let l = PRODUCTS.filter((p) => !categoria || p.categories.includes(categoria));
    if (q) {
      const terms = norm(q).split(/\s+/).filter(Boolean);
      l = l.filter((p) => {
        const hay = norm(`${p.name} ${p.bullets.join(" ")}`);
        return terms.every((t) => hay.includes(t));
      });
    }
    const off = (p: (typeof l)[number]) => (p.compareAt ? 1 - p.price / p.compareAt : 0);
    if (sort === "menor") l = [...l].sort((a, b) => a.price - b.price);
    if (sort === "maior") l = [...l].sort((a, b) => b.price - a.price);
    if (sort === "desconto") l = [...l].sort((a, b) => off(b) - off(a));
    return l;
  }, [categoria, q, sort]);

  return (
    <StoreLayout>
      <div className="mx-auto max-w-7xl px-4 py-10">
        <h1 className="text-[28px] font-bold text-navy">
          {q ? `Resultados para “${q}”` : (cat?.name ?? "Todos os produtos")}
        </h1>
        <p className="mt-1 text-[14px] text-muted-foreground">{list.length} produtos</p>

        <div className="mt-6 flex gap-2 overflow-x-auto pb-2 [scrollbar-width:none]">
          <Chip active={!categoria} to={undefined}>
            Todos
          </Chip>
          {CATEGORIES.map((c) => (
            <Chip key={c.id} active={categoria === c.id} to={c.id}>
              {c.short}
            </Chip>
          ))}
        </div>

        <div className="mt-4 flex justify-end">
          <label className="flex items-center gap-2 text-[13px] text-navy">
            Ordenar por
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as keyof typeof SORTS)}
              className="rounded-md border border-black/10 bg-white px-2 py-1.5 text-base md:text-[13px]"
            >
              {Object.entries(SORTS).map(([k, v]) => (
                <option key={k} value={k}>
                  {v}
                </option>
              ))}
            </select>
          </label>
        </div>

        {list.length === 0 ? (
          <div className="mt-16 text-center text-muted-foreground">
            Nenhum produto encontrado.{" "}
            <Link to="/produtos" className="text-teal underline">
              Ver todos
            </Link>
          </div>
        ) : (
          <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {list.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        )}
      </div>
    </StoreLayout>
  );
}

function Chip({ active, to, children }: { active: boolean; to: CategoryId | undefined; children: React.ReactNode }) {
  return (
    <Link
      to="/produtos"
      search={to ? { categoria: to } : {}}
      className={cn(
        "shrink-0 rounded-full border px-4 py-2 text-[13px] font-medium transition",
        active ? "border-teal bg-teal text-white" : "border-black/10 bg-white text-navy hover:border-teal",
      )}
    >
      {children}
    </Link>
  );
}
