import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EyeOff, Ban, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Comment {
  id: string;
  nome: string;
  crn: string;
  comentario: string;
  status_moderacao: string | null;
  criado_em: string | null;
}

export function Moderation() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from("comentarios_nutri")
      .select("id, nome, crn, comentario, status_moderacao, criado_em")
      .order("criado_em", { ascending: false });
    setComments((data as Comment[]) ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function ocultar(id: string) {
    const { error } = await supabase
      .from("comentarios_nutri")
      .update({ status_moderacao: "oculto" })
      .eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Comentário ocultado");
    load();
  }

  async function banir(crn: string) {
    if (!confirm(`Banir o CRN ${crn}? Todos os comentários dele serão ocultados e novos serão bloqueados.`))
      return;
    const { error: e1 } = await supabase
      .from("crns_banidos")
      .insert({ crn, motivo: "Banido pela moderação" });
    if (e1 && !e1.message.includes("duplicate")) return toast.error(e1.message);
    const { error: e2 } = await supabase
      .from("comentarios_nutri")
      .update({ status_moderacao: "oculto" })
      .eq("crn", crn);
    if (e2) return toast.error(e2.message);
    toast.success(`CRN ${crn} banido`);
    load();
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-muted-foreground">
          {comments.length} comentário(s)
        </h3>
        <Button size="sm" variant="ghost" onClick={load} disabled={loading}>
          <RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          Atualizar
        </Button>
      </div>
      <div className="overflow-x-auto rounded-xl border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Autor</TableHead>
              <TableHead>CRN</TableHead>
              <TableHead>Comentário</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {comments.map((c) => (
              <TableRow key={c.id}>
                <TableCell className="font-medium">{c.nome}</TableCell>
                <TableCell>
                  <Badge variant="outline">{c.crn}</Badge>
                </TableCell>
                <TableCell className="max-w-md text-sm">{c.comentario}</TableCell>
                <TableCell>
                  <Badge
                    variant={c.status_moderacao === "visivel" ? "default" : "secondary"}
                    className={c.status_moderacao === "visivel" ? "bg-primary" : ""}
                  >
                    {c.status_moderacao}
                  </Badge>
                </TableCell>
                <TableCell className="space-x-2 text-right">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => ocultar(c.id)}
                    disabled={c.status_moderacao === "oculto"}
                  >
                    <EyeOff className="mr-1 h-3 w-3" /> Ocultar
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => banir(c.crn)}>
                    <Ban className="mr-1 h-3 w-3" /> Banir CRN
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
