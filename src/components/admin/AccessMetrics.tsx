import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataSourceInfo } from "@/components/DataSourceInfo";
import { Activity, CalendarDays, CalendarRange } from "lucide-react";

export function AccessMetrics() {
  const [hoje, setHoje] = useState(0);
  const [semana, setSemana] = useState(0);
  const [ano, setAno] = useState(0);

  useEffect(() => {
    const now = new Date();
    const startToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
    const startWeek = new Date(now.getTime() - 7 * 86400000).toISOString();
    const startYear = new Date(now.getFullYear(), 0, 1).toISOString();

    Promise.all([
      supabase.from("log_acessos").select("id", { count: "exact", head: true }).gte("hora_acesso", startToday),
      supabase.from("log_acessos").select("id", { count: "exact", head: true }).gte("hora_acesso", startWeek),
      supabase.from("log_acessos").select("id", { count: "exact", head: true }).gte("hora_acesso", startYear),
    ]).then(([d, w, y]) => {
      setHoje(d.count ?? 0);
      setSemana(w.count ?? 0);
      setAno(y.count ?? 0);
    });
  }, []);

  const cards = [
    { label: "Acessos hoje", value: hoje, icon: Activity },
    { label: "Últimos 7 dias", value: semana, icon: CalendarDays },
    { label: "Acessos no ano", value: ano, icon: CalendarRange },
  ];

  return (
    <div>
      <div className="mb-3 flex items-center gap-2">
        <h2 className="text-lg font-semibold">Métricas de acesso</h2>
        <DataSourceInfo
          table="log_acessos"
          description="Cada visita à página inicial gera um registro nesta tabela."
          columns={["hora_acesso", "data_acesso"]}
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        {cards.map(({ label, value, icon: Icon }) => (
          <Card key={label} className="border-primary/20">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{label}</CardTitle>
              <Icon className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold tabular-nums text-primary">{value}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
