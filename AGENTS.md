<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## Backend da loja (Movvi)
- A tabela `orders` é service-role-only: RLS habilitado sem nenhuma policy e GRANT apenas para service_role — pedidos nunca são expostos ao navegador.
- Marcar pedido como pago exige confirmação na API da PixGate (GET /api/stats/{id}); nunca confiar no status do corpo do webhook.
- Funções do painel /admin conferem a senha (segredo ADMIN_PASSWORD) no servidor, em tempo constante, antes de qualquer leitura.
- Inserções de pedido usam `await import("@/integrations/supabase/client.server")` dentro do handler, nunca import no topo de *.functions.ts.
