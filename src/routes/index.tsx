import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
  Legend,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DataSourceInfo } from "@/components/DataSourceInfo";
import { CommentForm } from "@/components/CommentForm";
import { CommentList } from "@/components/CommentList";
import { Leaf, TrendingUp, Receipt, PieChart as PieIcon, Lock } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AuditaCFN" },
      { name: "description", content: "Por Nutricionistas e Para Nutricionistas." },
      { property: "og:title", content: "AuditaCFN" },
      { property: "og:description", content: "Despesas, comentários da comunidade e dados abertos do CFN." },
    ],
  }),
  component: HomePage,
});

interface Despesa {
  id_empenho: string;
  categoria: string | null;
  favorecido: string | null;
  valor: number | null;
  data_despesa: string | null;
  fonte_tabela: string | null;
}

const COLORS = ["#10b981", "#34d399", "#6ee7b7", "#059669", "#047857", "#065f46"];

const fmt = (n: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(n);

function HomePage() {
  const [despesas, setDespesas] = useState<Despesa[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    // log access
    supabase.from("log_acessos").insert({}).then(() => {});

    supabase
      .from("despesas_cfn")
      .select("id_empenho, categoria, favorecido, valor, data_despesa, fonte_tabela")
      .order("data_despesa", { ascending: false })
      .limit(500)
      .then(({ data }) => {
        setDespesas((data as Despesa[]) ?? []);
        setLoading(false);
      });
  }, []);

  const { porCategoria, total, maiorCat } = useMemo(() => {
    const map = new Map<string, number>();
    let t = 0;
    for (const d of despesas) {
      const v = Number(d.valor ?? 0);
      const c = d.categoria || "Sem categoria";
      map.set(c, (map.get(c) ?? 0) + v);
      t += v;
    }
    const arr = Array.from(map.entries())
      .map(([categoria, valor]) => ({ categoria, valor }))
      .sort((a, b) => b.valor - a.valor);
    return { porCategoria: arr, total: t, maiorCat: arr[0] };
  }, [despesas]);

  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-accent/20 to-background pb-24">
      {/* Header */}
      <header className="border-b bg-card/70 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-md">
              <Leaf className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight sm:text-2xl">
                Portal de Transparência CFN
              </h1>
              <p className="text-xs text-muted-foreground">
                Conselho Federal de Nutricionistas — dados abertos
              </p>
            </div>
          </div>
          <Button variant="ghost" size="sm" asChild>
            <Link to="/admin">
              <Lock className="mr-1 h-4 w-4" /> Admin
            </Link>
          </Button>
        </div>
      </header>

      <div className="mx-auto max-w-6xl space-y-8 px-4 py-8">
        {/* Cards resumo */}
        <section className="grid gap-4 sm:grid-cols-3">
          <SummaryCard
            label="Total empenhado"
            value={fmt(total)}
            icon={TrendingUp}
          />
          <SummaryCard
            label="Empenhos registrados"
            value={String(despesas.length)}
            icon={Receipt}
          />
          <SummaryCard
            label="Maior categoria"
            value={maiorCat?.categoria ?? "—"}
            sub={maiorCat ? fmt(maiorCat.valor) : ""}
            icon={PieIcon}
          />
        </section>

        {/* Gráfico de barras */}
        <Card className="border-primary/10 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Gastos por categoria
              <DataSourceInfo
                table="despesas_cfn"
                description="Soma do campo valor agrupado por categoria."
                columns={["categoria", "valor"]}
              />
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[340px]">
            {loading ? (
              <p className="text-sm text-muted-foreground">Carregando…</p>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={porCategoria.slice(0, 8)} margin={{ left: 10, right: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                  <XAxis dataKey="categoria" tick={{ fontSize: 11 }} interval={0} angle={-15} textAnchor="end" height={70} />
                  <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `R$${(v / 1000).toFixed(0)}k`} />
                  <Tooltip
                    formatter={(v: number) => fmt(v)}
                    contentStyle={{ borderRadius: 12, border: "1px solid hsl(var(--border))" }}
                  />
                  <Bar dataKey="valor" fill="#10b981" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Pizza + Tabela */}
        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="border-primary/10 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Distribuição de gastos
                <DataSourceInfo
                  table="despesas_cfn"
                  description="Participação percentual de cada categoria sobre o total."
                  columns={["categoria", "valor"]}
                />
              </CardTitle>
            </CardHeader>
            <CardContent className="h-[300px]">
              {loading ? (
                <p className="text-sm text-muted-foreground">Carregando…</p>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={porCategoria.slice(0, 6)}
                      dataKey="valor"
                      nameKey="categoria"
                      cx="50%"
                      cy="50%"
                      outerRadius={90}
                      label={(e) => `${((e.percent ?? 0) * 100).toFixed(0)}%`}
                    >
                      {porCategoria.slice(0, 6).map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(v: number) => fmt(v)} />
                    <Legend wrapperStyle={{ fontSize: 12 }} />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>

          <Card className="border-primary/10 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Despesas recentes
                <DataSourceInfo
                  table="despesas_cfn"
                  description="Últimas despesas registradas, ordenadas por data."
                  columns={["data_despesa", "categoria", "favorecido", "valor"]}
                />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Data</TableHead>
                      <TableHead>Categoria</TableHead>
                      <TableHead>Favorecido</TableHead>
                      <TableHead className="text-right">Valor</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {despesas.slice(0, 8).map((d) => (
                      <TableRow key={d.id_empenho}>
                        <TableCell className="text-xs text-muted-foreground">
                          {d.data_despesa
                            ? new Date(d.data_despesa).toLocaleDateString("pt-BR")
                            : "—"}
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="bg-primary/10 text-primary">
                            {d.categoria ?? "—"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm">{d.favorecido ?? "—"}</TableCell>
                        <TableCell className="text-right font-mono text-sm">
                          {fmt(Number(d.valor ?? 0))}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Comentários */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold">Comentários da comunidade</h2>
            <DataSourceInfo
              table="comentarios_nutri"
              description="Comentários enviados por nutricionistas. Apenas registros visíveis aparecem aqui."
              columns={["nome", "crn", "comentario", "status_moderacao"]}
            />
          </div>

          <CommentForm onPosted={() => setRefreshKey((k) => k + 1)} />
          <CommentList refreshKey={refreshKey} />
        </section>
      </div>
    </main>
  );
}

function SummaryCard({
  label,
  value,
  sub,
  icon: Icon,
}: {
  label: string;
  value: string;
  sub?: string;
  icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <Card className="border-primary/10 shadow-sm transition-shadow hover:shadow-md">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{label}</CardTitle>
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Icon className="h-4 w-4" />
        </div>
      </CardHeader>
      <CardContent>
        <p className="truncate text-2xl font-bold text-foreground">{value}</p>
        {sub && <p className="mt-1 text-xs text-muted-foreground">{sub}</p>}
      </CardContent>
    </Card>
  );
}
