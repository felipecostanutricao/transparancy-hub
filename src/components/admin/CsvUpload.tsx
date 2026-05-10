import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import Papa from "papaparse";
import { UploadCloud, CheckCircle2, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

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
}

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
          setResult({ novos, atualizados });
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
    </div>
  );
}
