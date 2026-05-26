-- ============================================================
-- MIGRATION: ADICIONAR COLUNAS DE INDICADORES E ANEXOS EM ATIVIDADES
-- ============================================================

ALTER TABLE public.atividades ADD COLUMN IF NOT EXISTS indicadores jsonb;
ALTER TABLE public.atividades ADD COLUMN IF NOT EXISTS anexos jsonb;

ALTER TABLE public.notificacoes ADD COLUMN IF NOT EXISTS tipo text;
ALTER TABLE public.notificacoes ADD COLUMN IF NOT EXISTS remetente text;
