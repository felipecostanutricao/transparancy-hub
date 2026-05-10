import { useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Send } from "lucide-react";

const schema = z.object({
  nome: z.string().trim().min(2, "Nome obrigatório").max(100),
  email: z.string().trim().email("E-mail inválido").max(255),
  crn: z.string().trim().min(2, "CRN obrigatório").max(20),
  comentario: z.string().trim().min(5, "Comentário muito curto").max(1000),
});

interface Props {
  onPosted: () => void;
}

export function CommentForm({ onPosted }: Props) {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [crn, setCrn] = useState("");
  const [comentario, setComentario] = useState("");
  const [aceite, setAceite] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = schema.safeParse({ nome, email, crn, comentario });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }
    setLoading(true);
    try {
      const { data: banido } = await supabase
        .from("crns_banidos")
        .select("crn")
        .eq("crn", crn.trim())
        .maybeSingle();
      if (banido) {
        toast.error("Este CRN está impedido de publicar comentários.");
        return;
      }
      const { error } = await supabase.from("comentarios_nutri").insert({
        nome: parsed.data.nome,
        email: parsed.data.email,
        crn: parsed.data.crn,
        comentario: parsed.data.comentario,
        termo_aceite: true,
        status_moderacao: "visivel",
      });
      if (error) throw error;
      toast.success("Comentário publicado!");
      setNome("");
      setEmail("");
      setCrn("");
      setComentario("");
      setAceite(false);
      onPosted();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Erro ao publicar";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="border-primary/20 shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg">Deixe seu comentário</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="nome">Nome</Label>
              <Input id="nome" value={nome} onChange={(e) => setNome(e.target.value)} maxLength={100} />
            </div>
            <div>
              <Label htmlFor="email">E-mail</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} maxLength={255} />
            </div>
          </div>
          <div>
            <Label htmlFor="crn">CRN</Label>
            <Input id="crn" value={crn} onChange={(e) => setCrn(e.target.value)} placeholder="Ex.: CRN-3 12345" maxLength={20} />
          </div>
          <div>
            <Label htmlFor="comentario">Comentário</Label>
            <Textarea id="comentario" value={comentario} onChange={(e) => setComentario(e.target.value)} rows={4} maxLength={1000} />
          </div>
          <label className="flex items-start gap-3 rounded-lg border bg-muted/40 p-3 text-sm">
            <Checkbox
              checked={aceite}
              onCheckedChange={(v) => setAceite(v === true)}
              className="mt-0.5"
            />
            <span>
              Me responsabilizo pelos dados fornecidos e confirmo que meu CRN está ativo.
            </span>
          </label>
          <Button type="submit" disabled={!aceite || loading} className="w-full sm:w-auto">
            <Send className="mr-2 h-4 w-4" />
            {loading ? "Publicando…" : "Publicar comentário"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
