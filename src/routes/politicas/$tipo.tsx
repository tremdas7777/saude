import { createFileRoute, notFound } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { brand } from "@/lib/brand";
import { TextPage } from "@/components/store/Page";

const POLICIES: Record<string, { title: string; body: ReactNode }> = {
  trocas: {
    title: "Trocas e devoluções",
    body: (
      <>
        <p>
          Você pode desistir da compra em até <b>7 dias corridos</b> após o recebimento, conforme o art. 49 do Código de
          Defesa do Consumidor. O produto deve ser devolvido com todos os acessórios e, se possível, na embalagem original.
        </p>
        <h2>Como solicitar</h2>
        <p>
          Entre em contato pelo e-mail {brand.email} ou WhatsApp {brand.whatsappDisplay} informando o número do pedido.
          Enviamos as instruções de postagem.
        </p>
        <h2>Reembolso</h2>
        <p>
          Após recebermos e conferirmos o produto, o reembolso é feito na mesma forma de pagamento usada na compra.
        </p>
        <h2>Produto com defeito</h2>
        <p>
          Se o produto apresentar defeito, fale com a gente. Fazemos a troca ou o reembolso dentro do prazo de garantia
          legal.
        </p>
      </>
    ),
  },
  envio: {
    title: "Política de envio",
    body: (
      <>
        <p>Enviamos para todo o Brasil. O prazo e o valor do frete aparecem na finalização da compra.</p>
        <h2>Rastreamento</h2>
        <p>Assim que o pedido é despachado, você recebe o código de rastreio por e-mail.</p>
        <h2>Endereço</h2>
        <p>
          Confira o endereço antes de concluir a compra. Se precisar corrigir, fale com a gente antes do envio.
        </p>
      </>
    ),
  },
  privacidade: {
    title: "Política de privacidade",
    body: (
      <>
        <p>
          Usamos seus dados (nome, contato, CPF e endereço) apenas para processar e entregar seu pedido, emitir nota fiscal
          e prestar atendimento, de acordo com a Lei Geral de Proteção de Dados (LGPD).
        </p>
        <h2>Compartilhamento</h2>
        <p>
          Compartilhamos os dados somente com parceiros necessários para a compra, como meios de pagamento e
          transportadoras. Não vendemos seus dados.
        </p>
        <h2>Seus direitos</h2>
        <p>
          Você pode pedir acesso, correção ou exclusão dos seus dados pelo e-mail {brand.email}.
        </p>
      </>
    ),
  },
  termos: {
    title: "Termos de uso",
    body: (
      <>
        <p>
          Ao usar este site, você concorda com estes termos. As informações dos produtos são exibidas da forma mais
          precisa possível; imagens podem variar levemente em relação ao produto recebido.
        </p>
        <p>
          Os produtos vendidos não substituem diagnóstico, tratamento ou acompanhamento de profissionais de saúde.
        </p>
        <p>
          {brand.legalName} · CNPJ {brand.cnpj}
        </p>
      </>
    ),
  },
};

export const Route = createFileRoute("/politicas/$tipo")({
  loader: ({ params }) => {
    if (!POLICIES[params.tipo]) throw notFound();
  },
  head: ({ params }) => ({ meta: [{ title: `${POLICIES[params.tipo]?.title ?? "Políticas"} | Movvi` }] }),
  component: Policy,
});

function Policy() {
  const { tipo } = Route.useParams();
  const p = POLICIES[tipo];
  if (!p) return null;
  return <TextPage title={p.title}>{p.body}</TextPage>;
}
