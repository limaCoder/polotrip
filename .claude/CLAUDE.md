# Instruções de Memória - Claude Code

Este documento contém as instruções de memória para o Claude Code baseadas nas regras do projeto.

## Estrutura do Projeto

Este é um monorepo com a seguinte estrutura:

- **`apps/web/`** - Aplicação frontend (React com React Router)
- **`apps/server/`** - Servidor backend (Fastify)
- **`packages/api/`** - Lógica e tipos de API compartilhados
- **`packages/auth/`** - Lógica e utilitários de autenticação
- **`packages/db/`** - Schema e utilitários do banco de dados

## Scripts Disponíveis

- `pnpm run dev` - Inicia todos os apps em modo de desenvolvimento
- `pnpm run dev:web` - Inicia apenas o app web
- `pnpm run dev:server` - Inicia apenas o servidor

## Comandos de Banco de Dados

Todas as operações de banco de dados devem ser executadas do workspace do servidor:

- `pnpm run db:push` - Aplica mudanças de schema ao banco de dados
- `pnpm run db:studio` - Abre o database studio
- `pnpm run db:generate` - Gera arquivos Drizzle
- `pnpm run db:migrate` - Executa migrações do banco de dados

Arquivos de schema do banco de dados estão localizados em `apps/server/src/db/schema/`

## Regras de Qualidade de Código

- **Evitar comentários desnecessários**: Adicionar comentários apenas para TODOs, lógica de negócio complexa ou comportamento de código não óbvio
- **Código auto-documentado**: Escrever nomes de variáveis e funções claros e descritivos ao invés de depender de comentários
- **Remover comentários óbvios**: Não comentar o que o código já mostra claramente
- **Foco na legibilidade**: O código deve ser legível sem comentários extensivos

## Organização de Dados Mock

- **Sempre criar dados mock no diretório `src/data/`**: Nunca colocar dados mock diretamente em componentes ou hooks
- **Organizar por feature**: Criar subdiretórios para cada feature (ex: `src/data/dashboard/`, `src/data/auth/`)
- **Usar nomes de arquivos descritivos**: Nomear arquivos baseado no tipo de dado (ex: `bookings.ts`, `users.ts`)
- **Exportar de index.ts**: Sempre criar um arquivo `index.ts` em cada subdiretório de dados para imports limpos
- **Importar tipos dos módulos originais**: Não duplicar definições de tipos em arquivos de dados
- **Exemplo de estrutura**:
  ```
  src/data/
  ├── dashboard/
  │   ├── bookings.ts
  │   └── index.ts
  └── auth/
      ├── users.ts
      └── index.ts
  ```

## Organização de Componentes Frontend

- **Componentes com definição de tipos**: Criar pasta com nome do componente em PascalCase
  - `index.tsx`: Contém apenas a UI do componente
  - `types.ts`: Concentra todos os tipos do componente
- **Componentes apenas UI (sem tipos próprios)**: Manter como arquivo kebab-case sem pasta
- **Sub-componentes dentro de pastas**: Sempre usar kebab-case (ex: `tool-display.tsx`, `albums-grid.tsx`)
- **PascalCase apenas para pastas**: Usar PascalCase somente quando o componente precisar de `types.ts` ou outros arquivos além do `index.tsx`
- **Componentes grandes com condicionais**: Separar em sub-componentes dedicados com early returns para renderizações condicionais

## Pontos Importantes

- Este é um monorepo Turborepo usando pnpm workspaces
- Cada app tem seu próprio `package.json` e dependências
- Executar comandos da raiz para executar em todos os workspaces
- Executar comandos específicos de workspace com `pnpm run command-name`
- Turborepo gerencia cache de build e execução paralela

## Linting e Formatação

- **Ultracite automático**: O hook configurado em `.claude/settings.json` executa `pnpm dlx ultracite fix` automaticamente após cada edição de arquivo
- **Corrigir erros imediatamente**: Se houver erros de lint ou de tipagem, corrigi-los imediatamente após a detecção
- **Verificar antes de finalizar**: Sempre verificar que não há erros de lint antes de considerar a tarefa concluída

## Internacionalização (i18n)

- **Sempre usar inglês para todo conteúdo de texto** incluindo:
  - Labels e textos de botões na UI
  - Mensagens de erro e notificações
  - Placeholders e mensagens de validação de formulários
  - Comentários e documentação
  - Console logs e mensagens de debug
  - Notificações toast e alertas
- Usar nomes de variáveis e funções descritivos em inglês
- Manter termos técnicos em inglês (ex: "Sign In", "Sign Up", "Dashboard", "Loading...")
- Evitar texto hardcoded em múltiplos idiomas - usar inglês consistentemente
