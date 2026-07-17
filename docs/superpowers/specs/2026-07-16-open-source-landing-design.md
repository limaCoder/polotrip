# Open Source Positioning on Landing Page — Design

**Date:** 2026-07-16
**Status:** Approved (dual-track: hosted flow stays intact, open-source track added)

## Goal

Reflect Polotrip's new open-source + self-hostable status on the public landing page without removing the existing hosted/paid flow. The page gains a second track aimed at developers: star the repo, self-host it, use the MCP server.

## Scope

Four touchpoints, all bilingual (en/pt via next-intl messages in `apps/web/src/messages/`):

### 1. Hero badge

Adapt the existing animated badge in `apps/web/src/app/[locale]/(public)/(home)/(sections)/Hero/index.tsx` (the plane + dashed line pill) to carry the text "Now open source" and link to `https://github.com/limaCoder/polotrip` (new tab, `rel="noopener noreferrer"`). Keep the plane animation. Text comes from a new i18n key `Home.Hero.open_source_badge`.

### 2. Dedicated section: `OpenSource`

New section between `HowItWorks` and `Faq` in `apps/web/src/app/[locale]/(public)/(home)/page.tsx`.

Structure follows house pattern:

```
(sections)/OpenSource/
├── index.tsx        # server component, getTranslations("Home.OpenSource")
├── data.tsx         # feature bullets (icon + titleKey + descriptionKey)
├── types.ts         # OpenSourceFeatureData type
└── code-snippet.tsx # terminal-styled block (sub-component, kebab-case)
```

Layout: two columns on `lg+`, stacked on mobile.

- **Left column:** heading ("Own your memories"), supporting copy (MIT licensed, photos + AI layer stay on your infrastructure, MCP server lets any AI agent chat with your albums), and 3 feature bullets from `data.tsx`:
  1. Self-host everything (icon: `Server`)
  2. Chat with your photos via MCP (icon: `Bot`)
  3. MIT licensed, fork-friendly (icon: `GitFork`)
- **Right column:** terminal-styled card showing the real quickstart:
  ```
  git clone https://github.com/limaCoder/polotrip.git
  cd polotrip && pnpm install
  docker compose up -d && pnpm run db:push
  pnpm dev
  ```
  Static styled block, no syntax-highlight dependency. Monospace, dark card, traffic-light dots header.
- **CTAs (below left column copy):** primary "Star on GitHub" → repo URL; secondary "Self-hosting guide" → `https://github.com/limaCoder/polotrip#-self-hosting--getting-started`.

Section uses `MotionSection` with the same reveal animation props as `Benefits`. i18n namespace `Home.OpenSource`.

### 3. Header + Footer GitHub link

- Header (`apps/web/src/components/Header/`): GitHub icon link (lucide `Github`), `aria-label="Polotrip on GitHub"`, opens in new tab. Placed with existing nav/actions; visible on public pages at minimum.
- Footer (`apps/web/src/components/Footer/`): same link, text or icon per existing footer style.

### 4. FAQ entries

Two new questions appended in `Faq/data.tsx` + messages:

1. "Is Polotrip open source?" — Yes, MIT licensed, link to repo.
2. "Can I run Polotrip on my own infrastructure?" — Yes, full self-hosting guide in the README; photos and the AI layer stay on your servers.

Answers may contain a link; follow whatever pattern existing FAQ answers use for rich content (check `data.tsx` — it is `.tsx`, so JSX answers are supported).

## Non-goals

- No removal or de-emphasis of the paid/hosted flow (CTA section, pricing copy untouched).
- No new pages/routes; everything on the existing home page.
- No analytics events (can be added later).

## i18n

All new strings added to both `en.json` and `pt.json` under `Home.Hero`, `Home.OpenSource`, `Home.Faq`. UI text in English for `en`, Portuguese for `pt` (site is bilingual; the "always English" repo rule applies to code, not to `pt.json` content).

## Error handling / edge cases

- External links: `target="_blank"` + `rel="noopener noreferrer"`.
- Code snippet block: horizontal scroll on small screens (`overflow-x-auto`), never breaks layout.

## Testing

- Visual check via dev server (`pnpm dev:web`) on mobile + desktop widths, light/dark theme.
- Lint/type check must pass (ultracite hook runs on edit).
