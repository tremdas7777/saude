import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { PackageSearch } from "lucide-react";
import { TextPage } from "@/components/store/Page";

export const Route = createFileRoute("/rastreio")({
  head: () => ({ meta: [{ title: "Rastrear pedido | Movvi" }] }),
  component: Tracking,
});

function Tracking() {
  const [code, setCode] = useState("");
  const clean = code.trim().toUpperCase().replace(/\s+/g, "");

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!clean) return;
    window.open(`https://rastreamento.correios.com.br/app/index.php?objetos=${encodeURIComponent(clean)}`, "_blank", "noopener");
  };

  return (
    <TextPage title="Rastrear pedido">
      <p>Digite o código de rastreio que enviamos para o seu e-mail quando o pedido foi despachado.</p>
      <form onSubmit={submit} className="flex flex-col gap-3 rounded-2xl bg-white p-6 shadow-sm sm:flex-row">
        <input
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Ex.: AA123456789BR"
          className="h-12 flex-1 rounded-lg border border-black/10 px-3 text-base uppercase outline-none focus:border-teal md:text-[14px]"
        />
        <button className="flex h-12 items-center justify-center gap-2 rounded-lg bg-teal px-6 font-bold text-white hover:bg-teal-dark">
          <PackageSearch className="h-5 w-5" /> Rastrear
        </button>
      </form>
      <p className="text-[13px] text-muted-foreground">
        Ainda não recebeu o código? Ele chega por e-mail assim que o pedido sai para entrega. Se tiver dúvidas, fale com
        a gente pela página de contato.
      </p>
    </TextPage>
  );
}
