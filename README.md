<p align="center">
  <img src=".github/logo-white.svg" alt="Polotrip Logo" width="300">
</p>

<p align="center">
  <strong>An innovative SaaS that transforms travel memories into interactive digital albums.</strong>
</p>

<p align="center">
  <img src=".github/screenshot.png" alt="Polotrip Screenshot">
</p>

## 🌟 Overview

Polotrip is a digital platform designed to bring the intimate and engaging experience of physical travel albums into the digital world. It allows users to create, edit, and share interactive albums of their journeys, complete with photos, an interactive timeline and a map.

## ✨ Features

- A timeline-based photo gallery with EXIF-aware sorting;
- An interactive map displaying geolocated photos using Leaflet;
- Public sharing with a clean, mobile-friendly layout;
- AI integration using Vercel AI SDK with OpenAI models and MCP Server via MCP SDK to provide tool calling;
- User authentication via OAuth (Google), powered by BetterAuth;
- Payments handled through Stripe Checkout (pay-per-album model);
- Image upload pipeline using pre-signed URLs generated on the backend;
- Client-side compression and EXIF metadata preservation;
- Storage and delivery via Cloudflare R2 buckets with CDN integration;
- Built in a monorepo using PNPM Workspaces and Turborepo for scalable development

## 🛠️ Technologies Used

This project is a monorepo using pnpm workspaces and Turborepo.

### Frontend (`apps/web`)

- **Framework:** Next.js with App Router
- **Styling:** Tailwind CSS with Shadcn/ui
- **Animation:** motion/react
- **Async State (Client-Side):** React Query
- **Forms:** React Hook Form in client-side and server-actions in server-side
- **Authentication:** BetterAuth
- **Payments:** Stripe
- **AI:** Vercel SDK
- **Data Validation:** Zod

### Backend (`apps/server`)

- **Framework:** Fastify on Node.js
- **Language:** TypeScript
- **ORM:** Drizzle ORM
- **Database:** PostgreSQL (via Docker locally and Neon in prod)
- **Storage:** Cloudflare R2 and Supabase Storage
- **Authentication:** BetterAuth
- **Payments:** Stripe
- **AI:** Vercel SDK
- **Data Validation:** Zod
- **Email:** Resend
- **Deployment:** Railway

### MCP (`apps/mcp`)

- **ModelContextProtocol/sdk**: Tools

## 📂 Project Structure

The monorepo is organized as follows:

```
/
├── apps/
│   ├── web/           # Next.js frontend
│   ├── server/        # Fastify backend
│   └── mcp/           # MCP Server (chat with your photos via AI agents)
├── packages/
│   ├── auth/          # Authentication package (BetterAuth)
│   ├── db/            # Database schema and ORM (Drizzle)
│   ├── transactional/ # Email templates (React Email)
│   └── ts-config/     # Shared TypeScript configuration
└── ...
```

## 🚀 Self-Hosting / Getting Started

### Prerequisites

- Node.js LTS (see `.nvmrc`)
- pnpm
- Docker (for the local PostgreSQL database)

### 1. Clone and install

```bash
git clone https://github.com/marioaulima/polotrip.git
cd polotrip
pnpm install
```

### 2. Configure environment variables

Each workspace has its own `.env.example`. Copy them and fill in the values:

```bash
cp apps/web/.env.example apps/web/.env
cp apps/server/.env.example apps/server/.env
cp apps/mcp/.env.example apps/mcp/.env
cp packages/auth/.env.example packages/auth/.env
cp packages/db/.env.example packages/db/.env
```

External services you will need credentials for:

| Service | Used for | Required? |
| --- | --- | --- |
| Google OAuth ([console](https://console.cloud.google.com/apis/credentials)) | Sign in | Yes |
| Stripe (test mode works) | Album checkout | Yes for the payment flow |
| Cloudflare R2 | Photo storage | Yes for uploads |
| Supabase | Storage (legacy path) | Only if you use it |
| Resend | Transactional email | Optional |
| Unsplash | Cover image search | Optional |
| PostHog | Analytics | Optional |
| OpenAI | AI chat over your photos (MCP) | Only for the AI features |

Generate `BETTER_AUTH_SECRET` with `openssl rand -base64 32` — never reuse a value from docs or examples.

### 3. Start the database

```bash
docker compose up -d
pnpm run db:push
```

### 4. Run the apps

```bash
pnpm dev          # web + server + mcp in parallel
pnpm dev:web      # frontend only (http://localhost:3000)
pnpm dev:server   # backend only (http://localhost:3333)
pnpm dev:mcp      # MCP server only
```

## 🤝 Contributing

Issues and pull requests are welcome. If you plan a bigger change, open an issue first so we can discuss it.

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
