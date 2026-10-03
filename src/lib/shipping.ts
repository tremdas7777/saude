/** Fretes iguais aos da AiDEX. Usado no servidor (preço) e no cliente (exibição). */
export const FRETES = [
  { id: "gratis", name: "Frete Grátis", eta: "7 a 10 dias úteis", price: 0 },
  { id: "padrao", name: "Frete Padrão", eta: "5 dias úteis", price: 20 },
  { id: "express", name: "Frete Express", eta: "1 a 2 dias úteis", price: 37.53 },
] as const;

export type FreteId = (typeof FRETES)[number]["id"];
export const getFrete = (id: FreteId) => FRETES.find((f) => f.id === id) ?? FRETES[0];

/** Valor mínimo em produtos para liberar o frete grátis (mesma regra da AiDEX). */
export const FREE_SHIPPING_MIN = 260;
export const isFreeShippingEligible = (subtotal: number) => subtotal >= FREE_SHIPPING_MIN;
