import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageCircle } from "lucide-react";

interface Comment {
  id: string;
  nome: string;
  crn: string;
  comentario: string;
  criado_em: string | null;
}

export function CommentList({ refreshKey }: { refreshKey: number }) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    supabase
      .from("comentarios_nutri")
      .select("id, nome, crn, comentario, criado_em")
      .eq("status_moderacao", "visivel")
      .order("criado_em", { ascending: false })
      .limit(50)
      .then(({ data }) => {
        setComments((data as Comment[]) ?? []);
        setLoading(false);
      });
  }, [refreshKey]);

  if (loading) return <p className="text-sm text-muted-foreground">Carregando comentários…</p>;
  if (comments.length === 0)
    return (
      <div className="rounded-xl border border-dashed p-8 text-center text-sm text-muted-foreground">
        <MessageCircle className="mx-auto mb-2 h-6 w-6" />
        Seja o primeiro a comentar.
      </div>
    );

  return (
    <div className="space-y-3">
      {comments.map((c) => (
        <Card key={c.id} className="transition-shadow hover:shadow-md">
          <CardContent className="pt-5">
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <span className="font-semibold">{c.nome}</span>
              <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20">
                {c.crn}
              </Badge>
              {c.criado_em && (
                <span className="text-xs text-muted-foreground">
                  {new Date(c.criado_em).toLocaleDateString("pt-BR")}
                </span>
              )}
            </div>
            <p className="text-sm leading-relaxed text-foreground/90">{c.comentario}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
