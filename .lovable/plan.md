## Visão geral

Reconstruir o app de transparência do CFN em duas rotas, conectado ao Supabase já existente (`oybwcprzohbijocjsdir`). Visual moderno (paleta Emerald/Health já existente), tooltips de origem dos dados ao lado de cada gráfico/tabela.

## Rota 1 — `/` Dashboard pública + Comunidade

- **Header** com título "Portal de Transparência CFN" + subtítulo.
- **Cards de resumo** (Total gasto, nº de empenhos, maior categoria) — fonte: `despesas_cfn`.
- **Gráfico de barras** (gastos por categoria) e **gráfico de pizza** (distribuição) usando `recharts`. Cada um com ícone `HelpCircle` + tooltip: *"Dados lidos da tabela `despesas_cfn` (colunas categoria, valor, data_despesa)."*
- **Tabela de despesas recentes** com tooltip de origem.
- **Seção Comentários da Comunidade**:
  - Lista cards com `nome` + badge `CRN` + `comentario` + data, lendo `comentarios_nutri` filtrado por `status_moderacao = 'visivel'`.
  - **Formulário**: Nome, E-mail, CRN, Comentário, Checkbox obrigatório de responsabilidade. Botão desabilitado até o checkbox marcar. Validação Zod. Antes de inserir, verifica se o CRN está em `crns_banidos` (ver migração) — se sim, mostra erro.
  - Insert em `comentarios_nutri` com `termo_aceite = true`, `status_moderacao = 'visivel'`.
- **Log de acesso**: na montagem da rota `/`, faz insert em `log_acessos`.

## Rota 2 — `/admin` Painel restrito

- **Auth obrigatória** via Supabase Auth (email/senha). Tela de login se não autenticado. Apenas usuários com role `admin` (tabela `user_roles` + função `has_role`) acessam.
- **Cards de métricas de acesso** (Hoje / 7 dias / Ano) — `log_acessos` agregado.
- **Upload CSV (Drag & Drop)**:
  - Parse com `papaparse`.
  - Para cada linha: `supabase.from('despesas_cfn').upsert(row, { onConflict: 'id_empenho' })`.
  - Conta inserts vs updates (consulta prévia dos `id_empenho` existentes) → alerta verde "Matemática concluída: X novos, Y atualizados".
- **Aba de Moderação**:
  - Tabela com todos os `comentarios_nutri`.
  - Botão **Ocultar**: update `status_moderacao = 'oculto'`.
  - Botão **Banir CRN**: insere CRN em `crns_banidos` + oculta todos os comentários daquele CRN.

## Migrações Supabase necessárias

1. **`despesas_cfn`**: adicionar PK em `id_empenho` (atualmente NOT NULL mas sem PK confirmada) + RLS policy de SELECT pública e INSERT/UPDATE só para admin.
2. **`comentarios_nutri`**: RLS — SELECT público apenas para `status_moderacao='visivel'`; INSERT público com `termo_aceite=true`; UPDATE apenas admin.
3. **`log_acessos`**: RLS — INSERT público; SELECT apenas admin.
4. **Nova tabela `crns_banidos`** (`crn text PK`, `banido_em timestamptz`, `motivo text`) com RLS — SELECT público (para o form checar), INSERT/DELETE apenas admin.
5. **Enum `app_role`** + tabela `user_roles` + função `has_role(uuid, app_role)` (security definer) — padrão recomendado.
6. **Trigger** em `comentarios_nutri` no INSERT que rejeita se o CRN está banido.

## Tooltips de origem

Componente reutilizável `<DataSourceInfo table="despesas_cfn" description="..." />` usando `Popover`/`Tooltip` do shadcn com ícone `HelpCircle` ao lado do título de cada bloco visual.

## Stack/arquivo

- Cliente Supabase já em `@/integrations/supabase/client`.
- Novas rotas: `src/routes/index.tsx` (reescrita), `src/routes/admin.tsx`, `src/routes/login.tsx`.
- Componentes: `src/components/DataSourceInfo.tsx`, `src/components/CommentForm.tsx`, `src/components/CommentList.tsx`, `src/components/admin/CsvUpload.tsx`, `src/components/admin/Moderation.tsx`, `src/components/admin/AccessMetrics.tsx`.
- Deps novas: `papaparse`, `react-dropzone`, `zod` (já presente provavelmente).

## Detalhes técnicos

- **Auth admin**: usuário precisa criar conta via `/login` (signup email/senha) e depois ser promovido manualmente via SQL (instrução fornecida ao usuário). Sem signup público de admin no UI.
- **CSV esperado**: colunas `id_empenho, data_despesa, categoria, favorecido, valor, fonte_tabela`.
- **BottomNav atual**: ajustar para incluir link discreto para `/admin` apenas se autenticado como admin.

## Confirmações solicitadas

1. OK aprovar a migração que **adiciona PK em `id_empenho`** em `despesas_cfn` e **RLS** nas tabelas listadas?
2. OK criar a tabela `crns_banidos` e o sistema de roles (`user_roles` + `has_role`)?
3. Auth admin via email/senha (você cria conta e me diz o email para eu te dar o SQL de promoção a admin) — confirma?
