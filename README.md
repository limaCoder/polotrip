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
- **Aysnc State In Client-Side:** React Query
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
- **Storage:** Cloudfare R2 and Supabase Storage
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
│   ├── web/         # Next.js frontend
│   └── server/      # Fastify backend
    └── mcp/         # MCP Server
├── packages/
│   ├── auth/        # Authentication package
│   ├── db/          # Database schema and ORM
│   ├── eslint-config/ # Shared ESLint configuration
│   ├── transactional/ # Email templates
│   └── ts-config/   # Shared TypeScript configuration
└── ...
```

## 🚀 Getting Started

### Prerequisites

- Node.js
- pnpm

### Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/your-username/polotrip.git
    ```
2.  Install dependencies:
    ```bash
    pnpm install
    ```

### Running the Development Servers

To start both the frontend and backend servers in parallel, run:

```bash
pnpm dev
```

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
