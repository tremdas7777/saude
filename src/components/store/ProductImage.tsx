import { Dumbbell, Footprints, Hand, HeartPulse, Lightbulb, PersonStanding } from "lucide-react";
import type { CategoryId, Product } from "@/lib/catalog";
import { cn } from "@/lib/utils";

const ICONS: Record<CategoryId, typeof Footprints> = {
  "pes-pernas": Footprints,
  "quadril-coluna": PersonStanding,
  "maos-bracos": Hand,
  cuidados: HeartPulse,
  exercicios: Dumbbell,
  "led-terapia": Lightbulb,
};

/** Foto do produto; enquanto não houver foto, mostra um quadro com o ícone da categoria. */
export function ProductImage({ product, className }: { product: Product; className?: string }) {
  if (product.image) {
    return (
      <img
        src={product.image}
        alt={product.name}
        loading="lazy"
        className={cn("aspect-square w-full bg-white object-contain", className)}
      />
    );
  }
  const Icon = ICONS[product.categories[0]];
  return (
    <div
      className={cn("flex aspect-square w-full flex-col items-center justify-center gap-2 bg-[#f2f5f6] p-6 text-center", className)}
      aria-label={product.name}
    >
      <Icon className="h-1/5 w-1/5 text-navy/20" strokeWidth={1} />
      <span className="text-[10px] font-medium uppercase tracking-wider text-navy/30">Imagem em breve</span>
    </div>
  );
}

export function CategoryIcon({ id, className }: { id: CategoryId; className?: string }) {
  const Icon = ICONS[id];
  return <Icon className={className} strokeWidth={1.5} />;
}
