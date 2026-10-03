import { createFileRoute } from "@tanstack/react-router";
import { Clock, Mail, MessageCircle } from "lucide-react";
import { brand } from "@/lib/brand";
import { TextPage } from "@/components/store/Page";

export const Route = createFileRoute("/contato")({
  head: () => ({ meta: [{ title: "Contato | Movvi" }] }),
  component: () => (
    <TextPage title="Fale com a gente">
      <p>Estamos aqui para ajudar com dúvidas sobre produtos, pedidos, trocas e entregas.</p>
      <div className="grid gap-4 pt-2 sm:grid-cols-3">
        <a href={`https://wa.me/${brand.whatsappE164}`} className="rounded-2xl bg-teal p-6 text-white hover:bg-teal-dark">
          <MessageCircle className="h-7 w-7" />
          <p className="mt-3 font-bold">WhatsApp</p>
          <p className="text-[14px] text-white/85">{brand.whatsappDisplay}</p>
        </a>
        <a href={`mailto:${brand.email}`} className="rounded-2xl bg-white p-6 shadow-sm">
          <Mail className="h-7 w-7 text-teal" />
          <p className="mt-3 font-bold text-navy">E-mail</p>
          <p className="break-all text-[14px]">{brand.email}</p>
        </a>
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <Clock className="h-7 w-7 text-teal" />
          <p className="mt-3 font-bold text-navy">Horário</p>
          <p className="text-[14px]">{brand.hours}</p>
        </div>
      </div>
    </TextPage>
  ),
});
