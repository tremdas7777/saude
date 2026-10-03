/** Dados do Pix guardados no navegador entre /checkout, /pedido e /obrigado. */
export type PixSession = {
  id: string;
  qrcode: string;
  amount: number; // centavos
  createdAt: number;
  email: string;
  name: string;
  frete: { name: string; price: number };
  items: { slug: string; name: string; qty: number; price: number }[];
};

const key = (id: string) => `movvi-pix:${id}`;

export function savePixSession(s: PixSession) {
  try {
    sessionStorage.setItem(key(s.id), JSON.stringify(s));
  } catch {
    // armazenamento indisponível
  }
}

export function loadPixSession(id: string): PixSession | null {
  try {
    const raw = sessionStorage.getItem(key(id));
    return raw ? (JSON.parse(raw) as PixSession) : null;
  } catch {
    return null;
  }
}
