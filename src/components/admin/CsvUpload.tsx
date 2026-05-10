import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import Papa from "papaparse";
import { UploadCloud, CheckCircle2, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Row {
  id_empenho: string;
  data_despesa?: string | null;
  categoria?: string | null;
  favorecido?: string | null;
  valor?: number | null;
  fonte_tabela?: string | null;
}

interface Result {
  novos: number;
  atualizados: number;
  totalLinhas: number;
  valorTotal: number;
  primeirosNovos: Row[];
}

const fmtBRL = (n: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(n);

export function CsvUpload() {
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState<Result | null>(null);

  const onDrop = useCallback(async (files: File[]) => {
    const file = files[0];
    if (!file) return;
    setProcessing(true);
    setResult(null);

    Papa.parse<Record<string, string>>(file, {
      header: true,
      skipEmptyLines: true,
      complete: async ({ data }) => {
        try {
          const rows: Row[] = data
            .filter((r) => r.id_empenho && r.id_empenho.trim() !== "")
            .map((r) => ({
              id_empenho: r.id_empenho.trim(),
              data_despesa: r.data_despesa || null,
              categoria: r.categoria || null,
              favorecido: r.favorecido || null,
              valor: r.valor ? Number(String(r.valor).replace(",", ".")) : null,
              fonte_tabela: r.fonte_tabela || "csv_upload",
            }));

          if (rows.length === 0) {
            toast.error("Nenhuma linha válida (verifique a coluna id_empenho).");
            return;
          }

          const ids = rows.map((r) => r.id_empenho);
          const { data: existing } = await supabase
            .from("despesas_cfn")
            .select("id_empenho")
            .in("id_empenho", ids);
          const existingSet = new Set((existing ?? []).map((e) => e.id_empenho));

          const { error } = await supabase
            .from("despesas_cfn")
            .upsert(rows, { onConflict: "id_empenho" });
          if (error) throw error;

          const atualizados = rows.filter((r) => existingSet.has(r.id_empenho)).length;
          const novos = rows.length - atualizados;
          const novosRows = rows.filter((r) => !existingSet.has(r.id_empenho));
          const valorTotal = rows.reduce((sum, r) => sum + (Number(r.valor) || 0), 0);
          setResult({
            novos,
            atualizados,
            totalLinhas: rows.length,
            valorTotal,
            primeirosNovos: novosRows.slice(0, 5),
          });
          toast.success("CSV processado com sucesso");
        } catch (err: unknown) {
          const msg = err instanceof Error ? err.message : "Erro no upload";
          toast.error(msg);
        } finally {
          setProcessing(false);
        }
      },
      error: (err) => {
        toast.error(err.message);
        setProcessing(false);
      },
    });
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "text/csv": [".csv"] },
    multiple: false,
  });

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed p-10 text-center transition-colors ${
          isDragActive
            ? "border-primary bg-primary/5"
            : "border-border hover:border-primary/50 hover:bg-accent/30"
        }`}
      >
        <input {...getInputProps()} />
        {processing ? (
          <>
            <Loader2 className="mb-3 h-10 w-10 animate-spin text-primary" />
            <p className="text-sm font-medium">Processando arquivo…</p>
          </>
        ) : (
          <>
            <UploadCloud className="mb-3 h-10 w-10 text-primary" />
            <p className="font-medium">
              {isDragActive ? "Solte o arquivo aqui" : "Arraste um CSV ou clique para selecionar"}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Colunas esperadas: id_empenho, data_despesa, categoria, favorecido, valor, fonte_tabela
            </p>
          </>
        )}
      </div>

      {result && (
        <Alert className="border-primary/40 bg-primary/5 text-foreground">
          <CheckCircle2 className="h-5 w-5 text-primary" />
          <AlertTitle className="text-primary">Matemática concluída</AlertTitle>
          <AlertDescription>
            {result.novos} novos empenhos adicionados, {result.atualizados} empenhos atualizados.
          </AlertDescription>
        </Alert>
      )}

      {result && (
        <Card className="border-primary/10">
          <CardHeader>
            <CardTitle className="text-base">Resumo do último upload</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-xl border bg-card p-4">
                <p className="text-xs text-muted-foreground">Linhas processadas</p>
                <p className="mt-1 text-2xl font-bold">{result.totalLinhas}</p>
              </div>
              <div className="rounded-xl border bg-card p-4">
                <p className="text-xs text-muted-foreground">Valor total do upload</p>
                <p className="mt-1 text-2xl font-bold">{fmtBRL(result.valorTotal)}</p>
              </div>
              <div className="rounded-xl border bg-card p-4">
                <p className="text-xs text-muted-foreground">Novos / Atualizados</p>
                <p className="mt-1 text-2xl font-bold">
                  {result.novos} <span className="text-sm text-muted-foreground">/ {result.atualizados}</span>
                </p>
              </div>
            </div>

            <div>
              <p className="mb-2 text-sm font-medium">
                Primeiros 5 registros novos detectados
              </p>
              {result.primeirosNovos.length === 0 ? (
                <p className="text-xs text-muted-foreground">
                  Nenhum registro novo neste upload.
                </p>
              ) : (
                <div className="overflow-x-auto rounded-lg border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID Empenho</TableHead>
                        <TableHead>Data</TableHead>
                        <TableHead>Categoria</TableHead>
                        <TableHead>Favorecido</TableHead>
                        <TableHead className="text-right">Valor</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {result.primeirosNovos.map((r) => (
                        <TableRow key={r.id_empenho}>
                          <TableCell className="font-mono text-xs">{r.id_empenho}</TableCell>
                          <TableCell className="text-xs">{r.data_despesa ?? "—"}</TableCell>
                          <TableCell className="text-xs">{r.categoria ?? "—"}</TableCell>
                          <TableCell className="text-xs">{r.favorecido ?? "—"}</TableCell>
                          <TableCell className="text-right font-mono text-xs">
                            {fmtBRL(Number(r.valor ?? 0))}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
