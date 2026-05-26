# Documentação Técnica Completa — Sistema CHAPADA (PDF)

Vou produzir um único PDF profissional, profundo e detalhado, cobrindo todo o sistema desenvolvido até agora, com auditoria real de segurança incluída.

## O que será entregue

Arquivo: `/mnt/documents/CHAPADA-Documentacao-Tecnica.pdf` (estimativa: 40–60 páginas, formato A4, capa, sumário e numeração).

## Estrutura do documento

1. **Capa & Sumário**
2. **Resumo Executivo** — nota geral, maturidade, pontos fortes/fracos, riscos.
3. **Visão Geral do Sistema**
   - Objetivo, problema resolvido, público-alvo (ONG Chapada / equipe de gestão de projetos do semiárido).
   - Arquitetura geral (diagrama ASCII).
   - Stack completa: TanStack Start v1, React 19, Vite 7, Tailwind v4, shadcn/ui, Supabase (Lovable Cloud), Cloudflare Workers, sonner, etc.
4. **Arquitetura & Organização do Código**
   - Árvore de pastas comentada (`src/routes`, `src/components`, `src/lib`, `src/contexts`, `src/integrations`).
   - Padrões: file-based routing, stores via `useSyncExternalStore`, contextos (Auth, Search), camada Supabase.
   - Avaliação de modularização e qualidade.
5. **Mapeamento Completo das Rotas/Telas** — uma seção por rota:
   - `/login`, `/registro`, `/esqueci-senha`, `/criar-senha`
   - `/` (dashboard), `/projetos`, `/atividades`, `/imagens`, `/indicadores`, `/tecnologias`, `/usuarios`
   - Para cada uma: objetivo, componentes, fluxo do usuário, permissões, dependências de stores, problemas e melhorias.
6. **Componentes & Hooks**
   - `AppLayout`, `AppSidebar`, `AuthLayout`, `ProfileModal`, `CollaboratorsSection`, UI shadcn.
   - Hooks: `useCurrentUser`, `useSeedOwnership`, `useAuth`, `useSearch`.
7. **Camada de Estado (Stores)**
   - `atividadesStore`, `imagensStore`, `tecnologiasStore`, `profileStore`, `notificationsStore`, `ownershipStore`, `usersDirectory`.
   - Análise: persistência em `localStorage`, ausência de sincronização com backend, riscos.
8. **Autenticação & Permissões**
   - Fluxo Supabase Auth (email/senha, domínio `@ongchapada.org.br`, código demo `123456`).
   - Sistema de ownership (owner, allowAll, collaborators) e `canEdit`/`denyToast`.
   - Trigger `handle_new_user` + tabela `profiles`.
9. **Banco de Dados (Supabase)**
   - Tabela `profiles` (schema, RLS policies, foreign keys).
   - Função `handle_new_user` (SECURITY DEFINER).
   - Secrets configurados.
   - Lacunas: ausência de tabelas para projetos/atividades/imagens/tecnologias/ownership/notificações — tudo em localStorage.
10. **Integrações & APIs**
    - Lovable Cloud, Lovable AI Gateway (chave disponível, não usada ainda).
    - Ausência de server functions (`createServerFn`) — oportunidade.
11. **Fluxos Críticos** (diagramas passo a passo)
    - Cadastro com código → criação de senha + nome/sobrenome.
    - Recuperação de senha.
    - Criação de registro com atribuição automática de owner.
    - Envio de mensagem entre usuários (notificação no sino).
12. **Auditoria Técnica**
    - Erros de arquitetura (dados em localStorage, sem multi-device).
    - Código duplicado, imports, rotas, estado.
    - Problemas de performance (re-render global de stores, falta de memoização).
    - Responsividade e UX.
13. **Auditoria Real de Segurança**
    - Execução de `supabase--linter` + `security--run_security_scan` + `db_health`.
    - Achados reais (severidade, descrição, recomendação).
    - Risco do modo "demonstração" (código `123456` hardcoded).
14. **UX/UI**
    - Identidade visual (paleta azul-claro definida), tipografia, consistência, acessibilidade (contraste, foco, ARIA), navegação.
15. **Performance**
    - SSR/CSR, code-splitting de rotas, hidratação, custo dos stores globais, queries.
16. **Riscos & Falhas Conhecidas**
17. **Roadmap de Melhorias Futuras** (prioritárias / recomendadas / longo prazo)
    - Migrar stores p/ Supabase + RLS.
    - Implementar `createServerFn` para mutações sensíveis.
    - Auth real para reset de senha (sem código demo).
    - Storage de imagens em Supabase Storage.
    - Integração com Lovable AI (resumo automático de atividades, OCR de relatórios, etc.).
    - Internacionalização, testes, CI, monitoramento.
18. **Relatório Final** — nota, maturidade (MVP / Beta / Produção), próximos passos.

## Como vou gerar (técnico)

1. **Coletar dados reais** em paralelo:
   - `supabase--linter`, `security--run_security_scan`, `supabase--db_health`, `supabase--read_query` (profiles).
   - Leitura dos arquivos-chave: todas as rotas em `src/routes/`, componentes principais, stores em `src/lib/`, contextos, `package.json`, `vite.config.ts`.
2. **Renderizar PDF** com Python + ReportLab (Platypus): capa, sumário automático, headings, parágrafos, tabelas, code blocks, callouts coloridos para riscos/recomendações, paleta visual do projeto (azul `#1A9FD4`).
3. **QA visual obrigatório**: converter cada página para JPG (`pdftoppm`) e revisar todas em busca de overflow, sobreposição, cortes, antes de entregar.
4. **Entregar** com `<presentation-artifact>` apontando para `CHAPADA-Documentacao-Tecnica.pdf`.

## Fora do escopo

- Nenhuma alteração de código no app.
- Sem mudanças no banco / sem novas migrações.
- Sem versão DOCX/Markdown (apenas PDF, conforme escolhido).
