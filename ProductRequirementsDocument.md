# Polotrip - Product Requirements Document (PRD) Atualizado

## 1. Visão Geral

**Objetivo:**  
O Polotrip é um SaaS inovador que transforma memórias de viagem em álbuns digitais interativos. Inspirado nos álbuns físicos de viagens, o Polotrip permite que os usuários criem, editem e compartilhem álbuns com fotos de suas jornadas, reunindo amigos e família por meio de um link único e uma experiência imersiva que inclui timeline e mapa interativo.

**Problema que Resolve:**

- Fotos dispersas em storages tradicionais (ex.: Drive, Dropbox) se perdem no volume de arquivos.
- Dificuldade em recriar a experiência íntima e acolhedora de um álbum físico de viagens.
- Necessidade de uma plataforma que ofereça uma experiência rica em narrativa visual, com recursos diferenciados (scroll infinito, timeline, mapa).

**Público-alvo:**  
Usuários que desejam preservar e compartilhar memórias de viagem de forma íntima, pessoal e interativa, valorizando a experiência emocional e narrativa de um álbum de família.

---

## 2. Objetivos e Metas

- **Objetivo Principal:**  
  Permitir a criação e compartilhamento de álbuns digitais de viagem configurados para até 100 fotos por álbum (com opção de adicionar fotos extras mediante cobrança). Oferecer uma experiência completa, com dashboard dinâmico, upload otimizado, edição interativa e visualização pública rica em recursos.

- **Metas de Negócio:**
  - Validar o modelo "pay-per-album": R$19,99 para 100 fotos e R$9,99 a cada 100 fotos adicionais.
  - Fornecer uma experiência diferenciada com scroll infinito, timeline interativa, mapa (Leaflet) integrado.
  - Manter os custos operacionais sob controle por meio de técnicas otimizadas de processamento em lote, compressão com CompressorJS e upload via Signed URLs para o Supabase Storage.

---

## 3. Requisitos Funcionais

### 3.1. Cadastro e Autenticação

- **Método de Autenticação:**
  - Utilização da biblioteca **BetterAuth** para login e cadastro, incluindo suporte a login social (Google/Apple).

### 3.2. Dashboard com Scroll Infinito

- **Exibição dos Álbuns:**
  - Listagem dos álbuns criados com scroll infinito.
  - Implementação de fetch client-side com **React Query** para carregar dados dinamicamente com scroll infinito.
  - Botão "Criar Novo Álbum" destacado.

### 3.3. Criação de Álbum com Server Actions

- **Tela de Criação:**
  - Campos obrigatórios: Título, Descrição e Capa.
  - Fluxo de criação utilizando **Server Actions** e o hook **useActionState** do React 19 para gerenciar estados de formulário (loading, erro, validação).
  - Custo definido de R$19,99 para 100 fotos.

### 3.4. Pagamento

- **Integração de Pagamento:**
  - Uso do Stripe para cartões de crédito/débito (a integração com Pix será implementada posteriormente via AbacatePay).
  - A lógica de pagamento reside no backend, garantindo segurança, com criação de sessões através do Stripe e tratamento de webhooks.

### 3.5. Upload e Processamento de Fotos

**Estratégia de Upload com Compressão, Preservação de Metadados e Supabase:**

- **No Frontend:**

  - **Extração de Metadados:**
    - Utilizar [exif-js](https://github.com/exif-js/exif-js) para ler os metadados (EXIF) do arquivo original.
  - **Compressão:**
    - Aplicar [CompressorJS](https://github.com/fengyuanchen/compressorjs) para comprimir a imagem (mantendo qualidade em ~60%).
  - **Reinserção dos Metadados:**
    - Usar [piexifjs](https://github.com/hMatoba/piexifjs) para reinserir os metadados extraídos na imagem comprimida.
  - **Upload via Signed URLs:**
    - O frontend solicita Signed URLs ao backend para cada imagem.
    - Realiza o upload direto para o **Supabase Storage** utilizando controle de concorrência (com `Promise.all()` e/ou biblioteca como [p-limit](https://www.npmjs.com/package/p-limit)).
  - **Feedback Visual:**
    - Exibição de mensagens de progresso e status para cada imagem processada.

- **No Backend (Fastify):**

  - **Rota HTTP (/albums/upload-urls):**
    - Valida a requisição e verifica autenticação
    - Chama a função de negócio para gerar URLs assinadas
    - Trata erros HTTP específicos (404, 403, etc.)
  - **Função de Negócio (getUploadUrls):**
    - Valida se o álbum existe e pertence ao usuário
    - Interage com Supabase para gerar URLs assinadas
    - Gera nomes únicos para arquivos usando CUID2
  - **Rota HTTP (/albums/photos/save):**
    - Recebe os metadados das fotos já enviadas
    - Chama a função de negócio para salvar no banco
  - **Função de Negócio (saveUploadedPhotos):**
    - Verifica limites de fotos por álbum
    - Registra no banco via Drizzle ORM
    - Atualiza contadores e status do álbum

Este fluxo segue a arquitetura em camadas, mantendo responsabilidades bem definidas e permitindo reuso de código.

### 3.6. Tela de Edição/Organização do Álbum

- **Funções de Edição:**
  - Exibição das fotos em ordem cronológica com base nos metadados.
  - Permitir que o usuário exclua fotos (ícone de lixeira) e insira manualmente a localização nas fotos que não possuam EXIF com GPS.
  - Para gerenciamento de estado nesta tela, utilizar **Zustand**; para formulários e validações, usar **React Hook Form**.

### 3.7. Visualização Pública do Álbum

- **Tela Pública:**
  - Exibir o Título e a Descrição do álbum em destaque.
  - **Mapa (Leaflet):** Exibir marcadores representando os locais das fotos da viagem.
  - **Timeline:** Barra interativa que se preenche conforme o usuário rola a página, agrupando fotos por data/dia.
  - **Galeria:** Grid estilo Masonry (semelhante ao Pinterest) exibindo as imagens.
  
  - URL de compartilhamento no formato: `seudominio.com/album/[id]`.

---

## 4. Requisitos Não Funcionais

- **Desempenho e Escalabilidade:**

  - Otimização por compressão e redimensionamento das imagens; processamento assíncrono em lote com controle de concorrência; uso de Signed URLs.
  - Distribuição das imagens via CDN para maior rapidez no carregamento.
  - Arquitetura modular e desacoplada, possibilitando a introdução de filas (ex.: RabbitMQ) e funções serverless para processamentos pesados quando necessário.

- **Segurança:**

  - Operações sensíveis (pagamento, geração de URLs) realizadas exclusivamente no backend.
  - Gerenciamento seguro de variáveis sensíveis por meio de arquivos .env.

- **Usabilidade:**
  - Interfaces intuitivas, responsivas e consistentes com Next.js, Tailwind CSS e Shadcn/ui.
  - Feedback visual claro para ações do usuário (upload, processamento, pagamento e edição).

---

## 5. Stack Tecnológico e Estrutura Monorepo

O projeto será estruturado em um **Monorepo** utilizando **PNPM Workspaces** e **Turborepo** da Vercel, permitindo que o frontend e backend compartilhem packages e sejam executados em conjunto.

Estrutura do Monorepo
polotrip/
├── apps/
│ ├── web/ # Frontend - Next.js
│ └── server/ # Backend - Fastify
├── packages/
│ ├── ts-config/ # Configuração global de TypeScript
│ ├── eslint-config/ # Configurações globais de ESLint
│ ├── auth/ # Autenticação com BetterAuth
│ ├── db/ # Integração com o Drizzle (ORM)
│ └── transactional/ # Frontend para emails utilizando React Email
├── package.json # Gerenciado por PNPM Workspaces
└── turbo.json # Configuração do Turborepo

### Tecnologias no Monorepo

**Frontend (apps/web):**

- Next.js (com App Router, Server Actions e o hook useActionState do React 19)
- Tailwind CSS + Shadcn/ui
- Fetch direto em RSC (React Server Components) para requisições no lado server-side no Next
- **ky** como biblioteca para tornar o uso do fetch mais elegante
- React Query para gerenciamento de estados assíncronos (requisições ao servidor, mais conhecido também como HTTP state) no client-side (como uso de scroll infinito)
- i18n e next-intl para suporte PT/EN
- BetterAuth para autenticação
- Stripe para pagamentos (futuro: AbacatePay para Pix)
- React Hook Form para manipulação de formulários no client-side quando necessário,
  em cenários em que as server actions não são suportáveis
- Zod para validação de dados

**Backend (apps/server):**

- Node.js (TypeScript) com Fastify
- Drizzle (ORM para Postgres)
- Zod para validação de dados
- Resend para integração de envio de emails
- Docker para containerização
- Supabase para Storage e Banco de Dados (Postgres)

**Arquitetura do Backend:**

O backend segue uma **Arquitetura em Camadas com Separação de Responsabilidades**, composta por:

- **Camada de HTTP (src/http/routes/)**:

  - Responsável por receber e validar requisições HTTP
  - Gerenciar autenticação e autorização
  - Formatar respostas e códigos de status HTTP
  - Utiliza Zod para validação de inputs
  - Não contém regras de negócio ou acesso direto ao banco de dados

- **Camada de Negócio (src/app/functions/)**:
  - Contém a lógica de negócio isolada da interface HTTP
  - Responsável pelo acesso ao banco de dados via Drizzle ORM (Desgin Pattern Repository)
  - Implementa regras e validações de domínio
  - Retorna dados estruturados e erros tipados
  - Pode ser reutilizada por diferentes endpoints ou serviços

Esta arquitetura traz benefícios como:

- Maior testabilidade (testes unitários isolados da camada HTTP)
- Reutilização de código entre diferentes endpoints
- Responsabilidade única para cada componente
- Facilidade na manutenção e evolução do código

**Packages (pasta packages):**

- `ts-config`: Configurações globais do TypeScript
- `eslint-config`: Configurações globais do ESLint
- `auth`: Autenticação usando BetterAuth
- `db`: Integração com o banco via Drizzle
- `transactional`: Frontend para emails (React Email)

---

## 6. Roadmap e Futuras Melhorias

- **MVP Inicial:**
  - Funcionalidades principais: criação de álbum (100 fotos por R$19,99), upload otimizado com compressão e preservação de metadados, dashboard com scroll infinito, visualização pública com mapa, timeline e widget do Spotify.
- **Iterações Futuras:**
  - Implementar integração de Pix via AbacatePay.
  - Funcionalidades avançadas de curadoria de fotos com IA.
  - Expansão de processamento para álbuns com grande volume de imagens (melhor uso de filas e funções serverless).

---

## 7. Critérios de Aceitação

- **Autenticação:**
  - Cadastro e login devem funcionar sem problemas utilizando BetterAuth.
- **Criação e Pagamento:**
  - O fluxo de criação do álbum (100 fotos a R$19,99) deve ser concluído com sucesso, utilizando Server Actions e useActionState.
  - A integração com Stripe deve funcionar de forma segura; a implementação do Pix via AbacatePay será realizada após o MVP.
- **Upload e Processamento:**
  - Imagens devem ser processadas utilizando CompressorJS para compressão, extração e reinserção de EXIF (com exif-js e piexifjs), e enviadas via Signed URLs para o Supabase Storage.
  - O processo de upload deve ser escalonado em lotes com controle de concorrência e feedback visual adequado.
- **Edição e Visualização:**
  - A tela de edição deve permitir exclusão e inserção manual de localizações, utilizando Zustand e React Hook Form.
  - A tela pública deve exibir o álbum corretamente, integrando mapa (Leaflet), timeline interativa, grid estilo Masonry e widget do Spotify.
- **Desempenho:**
  - A arquitetura monorepo deve permitir que frontend e backend compartilhem packages e rodem de forma integrada.

---

## 8. Notas Adicionais

- **Integrações e Segurança:**

  - Siga as melhores práticas de segurança e conformidade para integrações com Stripe, BetterAuth, Supabase e Spotify.
  - O backend deve garantir a segurança das operações sensíveis (pagamento, geração de Signed URLs).

- **Ambiente de Desenvolvimento:**
  - Configure as variáveis de ambiente conforme o arquivo `.env.example`.
