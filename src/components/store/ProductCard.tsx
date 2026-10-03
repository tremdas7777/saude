import { Link } from "@tanstack/react-router";
import { brl, discountPct, installment, INSTALLMENTS, type Product } from "@/lib/catalog";
import { ProductImage } from "./ProductImage";

export function ProductCard({ product }: { product: Product }) {
  const off = discountPct(product);
  return (
    <Link
      to="/produto/$slug"
      params={{ slug: product.slug }}
      className="group flex flex-col overflow-hidden rounded-xl border border-black/5 bg-white transition hover:shadow-lg"
    >
      <div className="relative overflow-hidden">
        <ProductImage product={product} className="transition duration-300 group-hover:scale-[1.03]" />
        {off > 0 && (
          <span className="absolute right-3 top-3 rounded-md bg-teal px-2 py-1 text-[11px] font-bold text-white">
            -{off}% OFF
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-4">
        <h3 className="line-clamp-2 min-h-[2.5rem] text-[14px] font-semibold leading-snug text-navy">{product.name}</h3>
        <div className="mt-auto pt-3">
          {product.compareAt && (
            <p className="text-[12px] text-muted-foreground line-through">{brl(product.compareAt)}</p>
          )}
          <p className="text-[18px] font-bold text-teal-dark">{brl(product.price)}</p>
          <p className="text-[11px] text-muted-foreground">
            {INSTALLMENTS}x de {brl(installment(product.price))}
          </p>
        </div>
      </div>
    </Link>
  );
}
