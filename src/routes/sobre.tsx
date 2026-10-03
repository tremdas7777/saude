import { createFileRoute } from "@tanstack/react-router";
import { brand } from "@/lib/brand";
import { TextPage } from "@/components/store/Page";

export const Route = createFileRoute("/sobre")({
  head: () => ({ meta: [{ title: "Sobre nós | Movvi" }] }),
  component: () => (
    <TextPage title="Somos a Movvi">
      <p>
        A {brand.name} nasceu para facilitar o cuidado com o corpo no dia a dia. Reunimos produtos práticos para pés,
        pernas, coluna e mãos, além de itens que ajudam quem cuida de alguém em casa.
      </p>
      <p>
        Nosso compromisso é oferecer produtos de qualidade, com preço justo e um atendimento próximo, antes e depois da
        compra.
      </p>
      <h2>Nosso atendimento</h2>
      <p>
        {brand.hours}. WhatsApp {brand.whatsappDisplay} ou e-mail {brand.email}.
      </p>
      <p className="text-[13px] text-muted-foreground">
        Nossos produtos não substituem avaliação médica ou fisioterapêutica. Em caso de dor persistente, procure um
        profissional de saúde.
      </p>
    </TextPage>
  ),
});
