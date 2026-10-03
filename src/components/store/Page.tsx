import type { ReactNode } from "react";
import { StoreLayout } from "./Layout";

/** Página de texto simples (institucional / políticas). */
export function TextPage({ title, children }: { title: string; children: ReactNode }) {
  return (
    <StoreLayout>
      <article className="mx-auto max-w-3xl px-4 py-12">
        <h1 className="text-[30px] font-bold text-navy">{title}</h1>
        <div className="mt-6 space-y-4 text-[15px] leading-relaxed text-navy/80 [&_h2]:pt-4 [&_h2]:text-[19px] [&_h2]:font-bold [&_h2]:text-navy">
          {children}
        </div>
      </article>
    </StoreLayout>
  );
}
