import { HelpCircle } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface Props {
  table: string;
  description: string;
  columns?: string[];
}

export function DataSourceInfo({ table, description, columns }: Props) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          aria-label="Origem dos dados"
          className="inline-flex h-7 w-7 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-accent hover:text-primary"
        >
          <HelpCircle className="h-4 w-4" />
        </button>
      </PopoverTrigger>
      <PopoverContent side="top" className="w-72 text-sm">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-primary">
          Origem dos dados
        </p>
        <p className="mb-2">{description}</p>
        <div className="rounded-md bg-muted px-2 py-1 font-mono text-xs">
          tabela: <span className="font-semibold">{table}</span>
        </div>
        {columns && columns.length > 0 && (
          <p className="mt-2 text-xs text-muted-foreground">
            Colunas: {columns.join(", ")}
          </p>
        )}
        <a
          href="https://transparencia.cfn.org.br/"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-block text-xs font-medium text-primary underline underline-offset-2 hover:text-primary/80"
        >
          Ir para o Portal da Transparência do CFN
        </a>
      </PopoverContent>
    </Popover>
  );
}
