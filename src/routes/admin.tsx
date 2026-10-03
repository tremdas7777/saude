import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useState, type FormEvent } from "react";
import { Download, Loader2, Lock, Search } from "lucide-react";
import { adminGetOrders, adminLogin, adminSaveTracking, type AdminOrder, type AdminStats } from "@/lib/admin.functions";
import { brl } from "@/lib/catalog";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin | Movvi" }, { name: "robots", content: "noindex" }] }),
  component: AdminPage,
});

const SESSION_KEY = "movvi-admin-pass";

const PERIODS = [
  { id: "today", label: "Hoje" },
  { id: "7d", label: "7 dias" },
  { id: "30d", label: "30 dias" },
  { id: "90d", label: "90 dias" },
  { id: "all", label: "Tudo" },
] as const;

const STATUSES = [
  { id: "all", label: "Todos" },
  { id: "paid", label: "Pagos" },
  { id: "waiting_payment", label: "Aguardando" },
] as const;

function AdminPage() {
  const [password, setPassword] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const loginFn = useServerFn(adminLogin);

  useEffect(() => {
    try {
      const p = sessionStorage.getItem(SESSION_KEY);
      if (p) setPassword(p);
    } catch {
      // armazenamento indisponível
    }
  }, []);

  const login = useMutation({
    mutationFn: () => loginFn({ data: { password: input } }),
    onSuccess: (r) => {
      if (r.ok) {
        try {
          sessionStorage.setItem(SESSION_KEY, input);
        } catch {
          // armazenamento indisponível
        }
        setPassword(input);
        setError(null);
      } else {
        setError(r.configured ? "Senha incorreta." : "O painel ainda não tem senha configurada. Cadastre o segredo ADMIN_PASSWORD nas configurações do projeto.");
      }
    },
    onError: () => setError("Não foi possível verificar a senha agora."),
  });

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (input.length > 0) login.mutate();
  };

  if (!password) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f7f9fa] px-4">
        <form onSubmit={submit} className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-sm">
          <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-teal-soft">
            <Lock className="h-5 w-5 text-teal" />
          </span>
          <h1 className="mt-4 text-center text-[20px] font-bold text-navy">Painel administrativo</h1>
          <p className="mt-1 text-center text-[13px] text-muted-foreground">Acesso restrito à equipe Movvi.</p>
          <input
            type="password"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Senha do painel"
            autoFocus
            className="mt-6 h-12 w-full rounded-lg border border-black/10 bg-white px-3 text-base outline-none focus:border-teal focus:ring-1 focus:ring-teal"
          />
          {error && (
            <p role="alert" className="mt-3 text-[13px] text-red-600">
              {error}
            </p>
          )}
          <button
            type="submit"
            disabled={login.isPending || input.length === 0}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-teal py-3.5 text-[15px] font-bold text-white transition hover:bg-teal-dark disabled:opacity-60"
          >
            {login.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
            Entrar
          </button>
          <Link to="/" className="mt-4 block text-center text-[12px] text-muted-foreground underline">
            Voltar para a loja
          </Link>
        </form>
      </div>
    );
  }

  const logout = () => {
    try {
      sessionStorage.removeItem(SESSION_KEY);
    } catch {
      // armazenamento indisponível
    }
    setPassword(null);
  };

  return <Dashboard password={password} onLogout={logout} />;
}

function Dashboard({ password, onLogout }: { password: string; onLogout: () => void }) {
  const queryClient = useQueryClient();
  const [period, setPeriod] = useState<(typeof PERIODS)[number]["id"]>("30d");
  const [status, setStatus] = useState<(typeof STATUSES)[number]["id"]>("all");
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<AdminOrder | null>(null);

  // Busca com pequeno atraso para não consultar a cada tecla.
  useEffect(() => {
    const t = setTimeout(() => setSearch(searchInput), 350);
    return () => clearTimeout(t);
  }, [searchInput]);

  const ordersFn = useServerFn(adminGetOrders);
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["admin-orders", password, period, status, search],
    queryFn: () => ordersFn({ data: { password, period, status, search } }),
    retry: false,
  });

  const orders = data?.orders ?? [];
  const stats = data?.stats;

  return (
    <div className="min-h-screen bg-[#f7f9fa]">
      <header className="border-b border-black/5 bg-white">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <p className="text-[17px] font-bold text-navy">
            Painel <span className="text-teal">Movvi</span>
          </p>
          <div className="flex items-center gap-3">
            <button onClick={exportCsv(orders)} disabled={orders.length === 0} className="flex items-center gap-1.5 rounded-lg border border-black/10 bg-white px-3 py-2 text-[13px] font-semibold text-navy transition hover:border-teal disabled:opacity-50">
              <Download className="h-4 w-4 text-teal" /> Exportar CSV
            </button>
            <button onClick={onLogout} className="text-[13px] font-medium text-muted-foreground underline">
              Sair
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl space-y-5 px-4 py-8">
        {/* Cartões */}
        <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
          <StatCard label="Total de pedidos" value={stats ? String(stats.total) : "—"} />
          <StatCard label="Pagos" value={stats ? String(stats.paid) : "—"} accent />
          <StatCard label="Aguardando" value={stats ? String(stats.waiting) : "—"} />
          <StatCard label="Faturamento" value={stats ? brl(stats.revenueCents / 100) : "—"} accent />
          <StatCard label="Ticket médio" value={stats ? brl(stats.avgCents / 100) : "—"} />
        </div>

        {/* Filtros e busca */}
        <div className="flex flex-col gap-3 rounded-2xl bg-white p-4 shadow-sm md:flex-row md:items-center">
          <div className="flex flex-wrap gap-1.5">
            {PERIODS.map((p) => (
              <button
                key={p.id}
                onClick={() => setPeriod(p.id)}
                className={cn(
                  "rounded-full px-3.5 py-1.5 text-[13px] font-semibold transition",
                  period === p.id ? "bg-teal text-white" : "bg-black/5 text-navy/70 hover:bg-black/10",
                )}
              >
                {p.label}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-1.5 md:ml-auto">
            {STATUSES.map((s) => (
              <button
                key={s.id}
                onClick={() => setStatus(s.id)}
                className={cn(
                  "rounded-full px-3.5 py-1.5 text-[13px] font-semibold transition",
                  status === s.id ? "bg-navy text-white" : "bg-black/5 text-navy/70 hover:bg-black/10",
                )}
              >
                {s.label}
              </button>
            ))}
          </div>
          <label className="relative md:w-72">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Nome, e-mail, CPF, telefone ou nº"
              className="h-11 w-full rounded-lg border border-black/10 bg-white pl-9 pr-3 text-[14px] outline-none focus:border-teal focus:ring-1 focus:ring-teal"
            />
          </label>
        </div>

        {/* Tabela */}
        <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
          {isLoading ? (
            <p className="flex items-center justify-center gap-2 py-14 text-[14px] text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" /> Carregando pedidos...
            </p>
          ) : isError ? (
            <p role="alert" className="py-14 text-center text-[14px] text-red-600">
              {error instanceof Error ? error.message : "Não foi possível carregar os pedidos."}
            </p>
          ) : orders.length === 0 ? (
            <p className="py-14 text-center text-[14px] text-muted-foreground">Nenhum pedido encontrado com esses filtros.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-[13px]">
                <thead>
                  <tr className="border-b border-black/5 text-[12px] uppercase tracking-wide text-muted-foreground">
                    <th className="px-4 py-3 font-semibold">Data</th>
                    <th className="px-4 py-3 font-semibold">Status</th>
                    <th className="px-4 py-3 font-semibold">Cliente</th>
                    <th className="px-4 py-3 font-semibold">Telefone</th>
                    <th className="px-4 py-3 font-semibold">Itens</th>
                    <th className="px-4 py-3 font-semibold">Frete</th>
                    <th className="px-4 py-3 text-right font-semibold">Valor</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((o) => (
                    <tr
                      key={o.id}
                      onClick={() => setSelected(o)}
                      className="cursor-pointer border-b border-black/5 text-navy/85 transition last:border-0 hover:bg-teal-soft/40"
                    >
                      <td className="whitespace-nowrap px-4 py-3">{fmtDate(o.createdAt)}</td>
                      <td className="px-4 py-3">
                        <StatusBadge status={o.status} />
                      </td>
                      <td className="max-w-48 truncate px-4 py-3 font-medium text-navy">{o.customer.name ?? "—"}</td>
                      <td className="whitespace-nowrap px-4 py-3">{maskPhone(o.customer.phone)}</td>
                      <td className="max-w-56 truncate px-4 py-3">{summarizeItems(o)}</td>
                      <td className="whitespace-nowrap px-4 py-3">{o.frete.name ?? "—"}</td>
                      <td className="whitespace-nowrap px-4 py-3 text-right font-semibold text-navy">{brl(o.amountCents / 100)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      <OrderDialog
        order={selected}
        password={password}
        onClose={() => setSelected(null)}
        onSaved={() => queryClient.invalidateQueries({ queryKey: ["admin-orders"] })}
      />
    </div>
  );
}

function StatCard({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className={cn("rounded-2xl bg-white p-4 shadow-sm", accent && "border border-teal/20")}>
      <p className="text-[12px] font-medium text-muted-foreground">{label}</p>
      <p className={cn("mt-1 text-[20px] font-bold text-navy", accent && "text-teal-dark")}>{value}</p>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    paid: "bg-teal-soft text-teal-dark",
    waiting_payment: "bg-amber-100 text-amber-800",
    canceled: "bg-red-100 text-red-700",
  };
  const label: Record<string, string> = {
    paid: "Pago",
    waiting_payment: "Aguardando",
    canceled: "Cancelado",
  };
  return (
    <span className={cn("inline-block whitespace-nowrap rounded-full px-2.5 py-1 text-[11px] font-bold", map[status] ?? "bg-black/5 text-navy/70")}>
      {label[status] ?? status}
    </span>
  );
}

function OrderDialog({
  order,
  password,
  onClose,
  onSaved,
}: {
  order: AdminOrder | null;
  password: string;
  onClose: () => void;
  onSaved: () => void;
}) {
  const saveFn = useServerFn(adminSaveTracking);
  const [tracking, setTracking] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setTracking(order?.trackingCode ?? "");
    setSaved(false);
  }, [order]);

  const save = useMutation({
    mutationFn: () => saveFn({ data: { password, id: order!.id, tracking_code: tracking } }),
    onSuccess: () => {
      setSaved(true);
      onSaved();
    },
  });

  const wa = order?.customer.phone ? `https://wa.me/55${order.customer.phone.replace(/\D/g, "")}` : null;

  return (
    <Dialog open={!!order} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg">
        {order && (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-3 text-[17px] text-navy">
                Pedido <span className="font-mono text-[13px] font-medium text-muted-foreground">{order.id}</span>
                <StatusBadge status={order.status} />
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4 text-[14px]">
              <section>
                <h3 className="mb-1 text-[12px] font-bold uppercase tracking-wide text-muted-foreground">Cliente</h3>
                <p className="font-medium text-navy">{order.customer.name ?? "—"}</p>
                <p className="text-navy/75">{order.customer.email ?? "—"}</p>
                <p className="text-navy/75">
                  {maskPhone(order.customer.phone)}
                  {wa && (
                    <>
                      {" · "}
                      <a href={wa} target="_blank" rel="noreferrer" className="font-medium text-teal underline">
                        Falar no WhatsApp
                      </a>
                    </>
                  )}
                </p>
                <p className="text-navy/75">CPF: {maskCpf(order.customer.cpf)}</p>
              </section>

              <section>
                <h3 className="mb-1 text-[12px] font-bold uppercase tracking-wide text-muted-foreground">Entrega</h3>
                <p className="text-navy/85">{order.endereco}</p>
                <p className="text-navy/75">CEP {maskCep(order.cep)}</p>
                <p className="text-navy/75">
                  {order.frete.name ?? "—"} {order.frete.price ? `· ${brl(order.frete.price)}` : "· Grátis"}
                </p>
              </section>

              <section>
                <h3 className="mb-1 text-[12px] font-bold uppercase tracking-wide text-muted-foreground">Itens</h3>
                <ul className="space-y-1">
                  {order.items.map((i) => (
                    <li key={i.slug} className="flex justify-between gap-3 text-navy/85">
                      <span>
                        {i.qty}× {i.name}
                      </span>
                      <span className="shrink-0">{brl(i.price * i.qty)}</span>
                    </li>
                  ))}
                </ul>
                <p className="mt-2 flex justify-between border-t border-black/5 pt-2 font-bold text-navy">
                  <span>Total</span>
                  <span>{brl(order.amountCents / 100)}</span>
                </p>
              </section>

              <section>
                <h3 className="mb-1 text-[12px] font-bold uppercase tracking-wide text-muted-foreground">Datas</h3>
                <p className="text-navy/75">Pedido: {fmtDate(order.createdAt)}</p>
                <p className="text-navy/75">Pago: {order.paidAt ? fmtDate(order.paidAt) : "—"}</p>
              </section>

              <section>
                <h3 className="mb-1 text-[12px] font-bold uppercase tracking-wide text-muted-foreground">Código de rastreio</h3>
                <div className="flex gap-2">
                  <input
                    value={tracking}
                    onChange={(e) => setTracking(e.target.value)}
                    placeholder="Ex.: BR123456789"
                    className="h-11 w-full rounded-lg border border-black/10 bg-white px-3 text-[14px] outline-none focus:border-teal focus:ring-1 focus:ring-teal"
                  />
                  <button
                    onClick={() => save.mutate()}
                    disabled={save.isPending}
                    className="shrink-0 rounded-lg bg-teal px-4 text-[13px] font-bold text-white transition hover:bg-teal-dark disabled:opacity-60"
                  >
                    {save.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Salvar"}
                  </button>
                </div>
                {saved && <p className="mt-1.5 text-[12px] font-medium text-teal-dark">Rastreio salvo.</p>}
                {save.isError && (
                  <p role="alert" className="mt-1.5 text-[12px] text-red-600">
                    {save.error instanceof Error ? save.error.message : "Não foi possível salvar."}
                  </p>
                )}
              </section>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

function exportCsv(orders: AdminOrder[]) {
  return () => {
    const esc = (v: string) => `"${v.replace(/"/g, '""')}"`;
    const header = ["Data", "Status", "Cliente", "E-mail", "Telefone", "CPF", "Endereço", "CEP", "Itens", "Frete", "Valor (R$)", "Pago em", "Rastreio"];
    const rows = orders.map((o) =>
      [
        fmtDate(o.createdAt),
        o.status,
        o.customer.name ?? "",
        o.customer.email ?? "",
        o.customer.phone ?? "",
        o.customer.cpf ?? "",
        o.endereco,
        o.cep,
        o.items.map((i) => `${i.qty}x ${i.name}`).join(" | "),
        o.frete.name ?? "",
        (o.amountCents / 100).toFixed(2).replace(".", ","),
        o.paidAt ? fmtDate(o.paidAt) : "",
        o.trackingCode ?? "",
      ]
        .map(esc)
        .join(";"),
    );
    // BOM para o Excel abrir acentos corretamente; separador ";" padrão BR.
    const csv = "\uFEFF" + [header.map(esc).join(";"), ...rows].join("\r\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `pedidos-movvi-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };
}

function summarizeItems(o: AdminOrder): string {
  const first = o.items[0];
  if (!first) return "—";
  const extra = o.items.length - 1;
  return `${first.qty}x ${first.name}${extra > 0 ? ` +${extra}` : ""}`;
}

function fmtDate(iso: string): string {
  return new Date(iso).toLocaleString("pt-BR", { day: "2-digit", month: "2-digit", year: "2-digit", hour: "2-digit", minute: "2-digit" });
}

function maskPhone(v?: string): string {
  const d = (v ?? "").replace(/\D/g, "");
  if (d.length < 10) return v ?? "—";
  return d.replace(/^(\d{2})(\d{4,5})(\d{4})$/, "($1) $2-$3");
}

function maskCpf(v?: string): string {
  const d = (v ?? "").replace(/\D/g, "");
  if (d.length !== 11) return v ?? "—";
  return d.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
}

function maskCep(v?: string): string {
  const d = (v ?? "").replace(/\D/g, "");
  if (d.length !== 8) return v ?? "—";
  return d.replace(/(\d{5})(\d{1})/, "$1-$2");
}
