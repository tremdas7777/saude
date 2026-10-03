# Roadmap

## Loja Movvi — backend do checkout Pix (documento enviado)
- [x] Ativar o Lovable Cloud
- [x] Tabela public.orders (RLS sem policies, GRANT só para service_role)
- [x] Salvar pedido ao gerar o Pix (insert no banco, sem bloquear o Pix em caso de falha)
- [x] Marcar como pago com confirmação da PixGate (getPixStatus + webhook /api/public/pix-webhook)
- [x] Painel /admin (login por senha, cartões, filtros, busca, detalhes, rastreio, CSV)
- [x] Segredos PIXGATE_API_KEY e ADMIN_PASSWORD cadastrados pelo usuário
- [ ] Verificar build e testar fluxo com pedido de valor baixo (aguarda usuário)

## Página de oferta — Guia cuidadores (pausada)
- [ ] Direções visuais descartadas pelo usuário; tarefa pausada até nova orientação
