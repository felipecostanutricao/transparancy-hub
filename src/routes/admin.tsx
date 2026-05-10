import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataSourceInfo } from "@/components/DataSourceInfo";
import { AccessMetrics } from "@/components/admin/AccessMetrics";
import { CsvUpload } from "@/components/admin/CsvUpload";
import { Moderation } from "@/components/admin/Moderation";
import { LogOut, Shield, ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Painel Admin — CFN" }] }),
  component: AdminPage,
});

function AdminPage() {
  const { user, isAdmin, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/login" });
  }, [loading, user, navigate]);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p className="text-sm text-muted-foreground">Carregando…</p>
      </main>
    );
  }

  if (!user) return null;

  if (!isAdmin) {
    return (
      <main className="flex min-h-screen items-center justify-center px-4">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" /> Acesso restrito
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <p>
              Sua conta <strong>{user.email}</strong> não tem permissão de administrador.
            </p>
            <p className="text-muted-foreground">
              Peça ao administrador do projeto para executar no SQL Editor:
            </p>
            <pre className="overflow-x-auto rounded-md bg-muted p-3 text-xs">
{`INSERT INTO public.user_roles (user_id, role)
VALUES ('${user.id}', 'admin');`}
            </pre>
            <div className="flex gap-2">
              <Button variant="outline" asChild>
                <Link to="/">
                  <ArrowLeft className="mr-1 h-4 w-4" /> Voltar
                </Link>
              </Button>
              <Button variant="ghost" onClick={() => supabase.auth.signOut()}>
                <LogOut className="mr-1 h-4 w-4" /> Sair
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-accent/20 to-background pb-16">
      <header className="border-b bg-card/70 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
              <Shield className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Painel Admin CFN</h1>
              <p className="text-xs text-muted-foreground">{user.email}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link to="/">Portal público</Link>
            </Button>
            <Button variant="ghost" size="sm" onClick={() => supabase.auth.signOut()}>
              <LogOut className="mr-1 h-4 w-4" /> Sair
            </Button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl space-y-8 px-4 py-8">
        <AccessMetrics />

        <Tabs defaultValue="upload" className="w-full">
          <TabsList>
            <TabsTrigger value="upload">Upload CSV</TabsTrigger>
            <TabsTrigger value="moderacao">Moderação</TabsTrigger>
          </TabsList>
          <TabsContent value="upload" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  Importar despesas (Upsert)
                  <DataSourceInfo
                    table="despesas_cfn"
                    description="Cada linha do CSV é inserida ou atualizada com base na chave id_empenho."
                    columns={["id_empenho", "data_despesa", "categoria", "favorecido", "valor"]}
                  />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CsvUpload />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="moderacao" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  Moderação de comentários
                  <DataSourceInfo
                    table="comentarios_nutri"
                    description="Lista de todos os comentários enviados. Banir um CRN insere o registro em crns_banidos e oculta seus comentários."
                    columns={["nome", "crn", "comentario", "status_moderacao"]}
                  />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Moderation />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
