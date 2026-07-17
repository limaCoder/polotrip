# Open Source Landing Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Surface Polotrip's open-source + self-hostable status on the landing page (hero badge, dedicated section, header/footer GitHub links, FAQ entries) without touching the paid/hosted flow.

**Architecture:** All changes live in `apps/web`. New `OpenSource` home section follows the house section pattern (PascalCase folder, `index.tsx` server component + `data.tsx` + `types.ts`, i18n via next-intl `Home.OpenSource` namespace). Strings added to both `en.json` and `pt.json`. A shared constant holds the repo URL.

**Tech Stack:** Next.js 15 App Router, next-intl, Tailwind, lucide-react, motion (via `MotionSection`/`MotionDiv` wrappers in `@/lib/motion/motion-components`).

## Global Constraints

- Repo URL everywhere: `https://github.com/limaCoder/polotrip` (import from constant, never hardcode twice).
- Self-hosting guide URL: `https://github.com/limaCoder/polotrip#-self-hosting--getting-started`.
- External links: `target="_blank"` + `rel="noopener noreferrer"`.
- UI copy in English in `en.json`, Portuguese in `pt.json`. Code identifiers/comments in English.
- No new dependencies. No changes to Cta/pricing copy.
- The web app has no unit-test framework; each task verifies via `pnpm --filter @polotrip/web exec tsc --noEmit` (must pass with no NEW errors — run once before starting to capture baseline) and visual check happens in the final task.
- The ultracite hook auto-formats on every edit; if it reports lint errors, fix before committing.

---

### Task 1: Repo URL constant + all i18n strings

**Files:**
- Create: `apps/web/src/constants/githubRepo.ts`
- Modify: `apps/web/src/messages/en.json`
- Modify: `apps/web/src/messages/pt.json`

**Interfaces:**
- Produces: `GITHUB_REPO_URL: string`, `GITHUB_SELF_HOSTING_URL: string` (named exports); i18n namespaces `Home.Hero.open_source_badge`, `Home.OpenSource.*`, `Home.Faq.questions.q7_*`/`q8_*`, `Header.github_aria`, `Footer.github`.

- [ ] **Step 1: Create the constant file**

```ts
// apps/web/src/constants/githubRepo.ts
export const GITHUB_REPO_URL = "https://github.com/limaCoder/polotrip";
export const GITHUB_SELF_HOSTING_URL =
  "https://github.com/limaCoder/polotrip#-self-hosting--getting-started";
```

- [ ] **Step 2: Add English strings**

In `apps/web/src/messages/en.json`:

Inside `Home.Hero`, add:

```json
"open_source_badge": "Now open source",
"open_source_badge_aria": "Polotrip is now open source — view the repository on GitHub"
```

Inside `Home` (sibling of `Hero`, `Benefits`, etc.), add a new `OpenSource` object:

```json
"OpenSource": {
  "title": "Own your memories",
  "description": "Polotrip is open source under the MIT license. Run it on your own infrastructure — your photos, and the AI layer on top of them, never leave your servers.",
  "features": {
    "self_host_title": "Self-host everything",
    "self_host_description": "Frontend, API, database, and storage run on infrastructure you control.",
    "mcp_title": "Chat with your photos via MCP",
    "mcp_description": "A built-in MCP server lets any AI agent answer questions about your albums.",
    "mit_title": "MIT licensed, fork-friendly",
    "mit_description": "Use it, change it, ship it. Contributions are welcome."
  },
  "star_button": "Star on GitHub",
  "star_button_aria": "Star the Polotrip repository on GitHub",
  "guide_button": "Self-hosting guide",
  "guide_button_aria": "Read the self-hosting guide in the Polotrip README",
  "terminal_title": "quickstart"
}
```

Inside `Home.Faq.questions`, add:

```json
"q7_question": "Is Polotrip open source?",
"q7_answer": "Yes! Polotrip is fully open source under the MIT license. The complete code — frontend, backend, and the MCP server — is on GitHub at github.com/limaCoder/polotrip.",
"q8_question": "Can I run Polotrip on my own infrastructure?",
"q8_answer": "Yes. The README has a full self-hosting guide: clone the repo, copy the .env examples, start the database with Docker, and run it. Your photos and the AI layer stay on your servers."
```

Inside `Header`, add:

```json
"github": "GitHub",
"github_aria": "Polotrip on GitHub"
```

Inside `Footer`, add:

```json
"github": "GitHub"
```

- [ ] **Step 3: Add Portuguese strings**

In `apps/web/src/messages/pt.json`, same keys:

`Home.Hero`:

```json
"open_source_badge": "Agora open source",
"open_source_badge_aria": "O Polotrip agora é open source — veja o repositório no GitHub"
```

`Home.OpenSource`:

```json
"OpenSource": {
  "title": "Suas memórias são suas",
  "description": "O Polotrip é open source sob a licença MIT. Rode na sua própria infraestrutura — suas fotos, e a camada de IA sobre elas, nunca saem dos seus servidores.",
  "features": {
    "self_host_title": "Self-host de tudo",
    "self_host_description": "Frontend, API, banco de dados e storage rodam em infraestrutura que você controla.",
    "mcp_title": "Converse com suas fotos via MCP",
    "mcp_description": "Um servidor MCP integrado permite que qualquer agente de IA responda perguntas sobre seus álbuns.",
    "mit_title": "Licença MIT, fork à vontade",
    "mit_description": "Use, modifique, publique. Contribuições são bem-vindas."
  },
  "star_button": "Star no GitHub",
  "star_button_aria": "Dê uma estrela no repositório do Polotrip no GitHub",
  "guide_button": "Guia de self-hosting",
  "guide_button_aria": "Leia o guia de self-hosting no README do Polotrip",
  "terminal_title": "quickstart"
}
```

`Home.Faq.questions`:

```json
"q7_question": "O Polotrip é open source?",
"q7_answer": "Sim! O Polotrip é totalmente open source sob a licença MIT. O código completo — frontend, backend e o servidor MCP — está no GitHub em github.com/limaCoder/polotrip.",
"q8_question": "Posso rodar o Polotrip na minha própria infraestrutura?",
"q8_answer": "Sim. O README tem um guia completo de self-hosting: clone o repositório, copie os arquivos .env de exemplo, suba o banco com Docker e rode. Suas fotos e a camada de IA ficam nos seus servidores."
```

`Header`:

```json
"github": "GitHub",
"github_aria": "Polotrip no GitHub"
```

`Footer`:

```json
"github": "GitHub"
```

- [ ] **Step 4: Verify JSON validity and typecheck**

Run: `python3 -c "import json; json.load(open('apps/web/src/messages/en.json')); json.load(open('apps/web/src/messages/pt.json')); print('ok')"`
Expected: `ok`

Run: `pnpm --filter @polotrip/web exec tsc --noEmit`
Expected: no new errors vs. baseline.

- [ ] **Step 5: Commit**

```bash
git add apps/web/src/constants/githubRepo.ts apps/web/src/messages/en.json apps/web/src/messages/pt.json
git commit -m "feat(web): add open-source i18n strings and GitHub repo constant"
```

---

### Task 2: Hero badge → "Now open source" link

**Files:**
- Modify: `apps/web/src/app/[locale]/(public)/(home)/(sections)/Hero/index.tsx`

**Interfaces:**
- Consumes: `GITHUB_REPO_URL` from `@/constants/githubRepo`; i18n keys `Home.Hero.open_source_badge`, `Home.Hero.open_source_badge_aria` (Task 1).

- [ ] **Step 1: Wrap the existing animated badge in an anchor and add the text**

In `Hero/index.tsx`, the current badge is the `MotionDiv` at the top of the container (pill with pulsing dot + dashed line + plane). Change it to render inside an `<a>` and append the badge text after the second dot. Replace the whole badge `MotionDiv` block with:

```tsx
<MotionDiv
  animate={{ opacity: 1, y: 0 }}
  initial={{ opacity: 0, y: -20 }}
  transition={{ duration: 0.8, ease: "easeOut" }}
>
  <a
    aria-label={t("open_source_badge_aria")}
    className="mb-8 flex items-center justify-center gap-3 rounded-full border border-primary/20 bg-background/60 px-4 py-2 shadow-sm backdrop-blur-md transition-colors hover:border-primary/40"
    href={GITHUB_REPO_URL}
    rel="noopener noreferrer"
    target="_blank"
  >
    <span className="relative flex h-2 w-2">
      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
      <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
    </span>

    <div className="relative flex w-16 items-center">
      <div className="w-full border-primary/30 border-t-[1.5px] border-dashed" />
      <MotionDiv
        animate={{ x: ["-150%", "300%"] }}
        className="absolute flex items-center justify-center text-primary"
        transition={{
          duration: 2.5,
          repeat: Number.POSITIVE_INFINITY,
          ease: "linear",
        }}
      >
        <Plane
          className="h-4 w-4 rotate-45 fill-primary/20 text-primary drop-shadow-[0_0_8px_rgba(var(--primary),0.5)]"
          strokeWidth={1.5}
        />
      </MotionDiv>
    </div>

    <span className="relative flex h-2 w-2">
      <span className="relative inline-flex h-2 w-2 rounded-full bg-primary/30" />
    </span>

    <span className="font-body_one text-foreground/80 text-sm">
      {t("open_source_badge")}
    </span>
  </a>
</MotionDiv>
```

Add the import at the top:

```tsx
import { GITHUB_REPO_URL } from "@/constants/githubRepo";
```

Note: the `mb-8` moves from the `MotionDiv` to the `<a>`; keep everything else in the file untouched.

- [ ] **Step 2: Typecheck**

Run: `pnpm --filter @polotrip/web exec tsc --noEmit`
Expected: no new errors.

- [ ] **Step 3: Commit**

```bash
git add "apps/web/src/app/[locale]/(public)/(home)/(sections)/Hero/index.tsx"
git commit -m "feat(web): make hero badge an open-source GitHub link"
```

---

### Task 3: OpenSource home section

**Files:**
- Create: `apps/web/src/app/[locale]/(public)/(home)/(sections)/OpenSource/types.ts`
- Create: `apps/web/src/app/[locale]/(public)/(home)/(sections)/OpenSource/data.tsx`
- Create: `apps/web/src/app/[locale]/(public)/(home)/(sections)/OpenSource/code-snippet.tsx`
- Create: `apps/web/src/app/[locale]/(public)/(home)/(sections)/OpenSource/index.tsx`
- Modify: `apps/web/src/app/[locale]/(public)/(home)/page.tsx`

**Interfaces:**
- Consumes: `GITHUB_REPO_URL`, `GITHUB_SELF_HOSTING_URL` (Task 1); i18n namespace `Home.OpenSource` (Task 1); `MotionSection` from `@/lib/motion/motion-components`.
- Produces: `OpenSource` async server component (named export from `index.tsx`).

- [ ] **Step 1: Create `types.ts`**

```ts
import type { ReactNode } from "react";

type OpenSourceFeatureData = {
  id: number;
  titleKey: "self_host_title" | "mcp_title" | "mit_title";
  descriptionKey: "self_host_description" | "mcp_description" | "mit_description";
  icon: ReactNode;
};

export type { OpenSourceFeatureData };
```

- [ ] **Step 2: Create `data.tsx`**

```tsx
import { Bot, GitFork, Server } from "lucide-react";
import type { OpenSourceFeatureData } from "./types";

export const openSourceFeaturesData: OpenSourceFeatureData[] = [
  {
    id: 1,
    titleKey: "self_host_title",
    descriptionKey: "self_host_description",
    icon: <Server />,
  },
  {
    id: 2,
    titleKey: "mcp_title",
    descriptionKey: "mcp_description",
    icon: <Bot />,
  },
  {
    id: 3,
    titleKey: "mit_title",
    descriptionKey: "mit_description",
    icon: <GitFork />,
  },
];
```

- [ ] **Step 3: Create `code-snippet.tsx`**

```tsx
type CodeSnippetProps = {
  title: string;
};

const quickstartLines = [
  "git clone https://github.com/limaCoder/polotrip.git",
  "cd polotrip && pnpm install",
  "docker compose up -d && pnpm run db:push",
  "pnpm dev",
];

export function CodeSnippet({ title }: CodeSnippetProps) {
  return (
    <div className="w-full overflow-hidden rounded-xl border border-foreground/10 bg-zinc-950 shadow-xl">
      <div className="flex items-center gap-2 border-zinc-800 border-b px-4 py-3">
        <span className="h-3 w-3 rounded-full bg-red-500/80" />
        <span className="h-3 w-3 rounded-full bg-yellow-500/80" />
        <span className="h-3 w-3 rounded-full bg-green-500/80" />
        <span className="ml-2 font-mono text-xs text-zinc-500">{title}</span>
      </div>
      <pre className="overflow-x-auto p-4 font-mono text-sm text-zinc-100 leading-7">
        {quickstartLines.map((line) => (
          <code className="block" key={line}>
            <span className="mr-2 select-none text-zinc-600">$</span>
            {line}
          </code>
        ))}
      </pre>
    </div>
  );
}
```

- [ ] **Step 4: Create `index.tsx`**

```tsx
import { Github } from "lucide-react";
import { getTranslations } from "next-intl/server";
import {
  GITHUB_REPO_URL,
  GITHUB_SELF_HOSTING_URL,
} from "@/constants/githubRepo";
import { MotionSection } from "@/lib/motion/motion-components";
import { CodeSnippet } from "./code-snippet";
import { openSourceFeaturesData } from "./data";

export async function OpenSource() {
  const t = await getTranslations("Home.OpenSource");

  return (
    <MotionSection
      className="bg-background py-8 lg:py-16"
      id="open-source"
      initial={{ opacity: 0, y: 35 }}
      transition={{ duration: 0.7 }}
      whileInView={{ opacity: 1, y: 0 }}
    >
      <div className="container mx-auto px-4 lg:px-9">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="flex flex-col">
            <h2 className="font-title_one text-foreground">{t("title")}</h2>
            <p className="mt-4 font-body_one text-muted-foreground">
              {t("description")}
            </p>

            <ul className="mt-8 flex flex-col gap-6">
              {openSourceFeaturesData.map((feature) => (
                <li className="flex items-start gap-4" key={feature.id}>
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    {feature.icon}
                  </span>
                  <div>
                    <h3 className="font-body_one font-bold text-foreground">
                      {t(`features.${feature.titleKey}`)}
                    </h3>
                    <p className="mt-1 font-body_two text-muted-foreground">
                      {t(`features.${feature.descriptionKey}`)}
                    </p>
                  </div>
                </li>
              ))}
            </ul>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <a
                aria-label={t("star_button_aria")}
                className="button-shadow flex h-12 items-center justify-center gap-2 rounded-full bg-gradient-primary px-8 font-bold text-white transition-transform hover:-translate-y-1"
                href={GITHUB_REPO_URL}
                rel="noopener noreferrer"
                target="_blank"
              >
                <Github className="h-5 w-5" />
                {t("star_button")}
              </a>
              <a
                aria-label={t("guide_button_aria")}
                className="flex h-12 items-center justify-center rounded-full border border-foreground/10 bg-background/50 px-8 font-bold text-foreground transition-all hover:-translate-y-1 hover:border-foreground/20"
                href={GITHUB_SELF_HOSTING_URL}
                rel="noopener noreferrer"
                target="_blank"
              >
                {t("guide_button")}
              </a>
            </div>
          </div>

          <CodeSnippet title={t("terminal_title")} />
        </div>
      </div>
    </MotionSection>
  );
}
```

Note: `lucide-react`'s `Github` icon is deprecated upstream but already the pattern-consistent choice here; if the ultracite hook flags it, keep it (suppression comment only if lint blocks).

- [ ] **Step 5: Wire into `page.tsx`**

In `apps/web/src/app/[locale]/(public)/(home)/page.tsx`, add the import and render between `HowItWorks` and `Faq`:

```tsx
import { OpenSource } from "./(sections)/OpenSource";
```

```tsx
<HowItWorks />
<OpenSource />
<Faq />
```

- [ ] **Step 6: Typecheck**

Run: `pnpm --filter @polotrip/web exec tsc --noEmit`
Expected: no new errors.

- [ ] **Step 7: Commit**

```bash
git add "apps/web/src/app/[locale]/(public)/(home)/(sections)/OpenSource" "apps/web/src/app/[locale]/(public)/(home)/page.tsx"
git commit -m "feat(web): add open-source home section with quickstart snippet"
```

---

### Task 4: FAQ — two new questions

**Files:**
- Modify: `apps/web/src/app/[locale]/(public)/(home)/(sections)/Faq/types.ts`
- Modify: `apps/web/src/app/[locale]/(public)/(home)/(sections)/Faq/data.tsx`

**Interfaces:**
- Consumes: i18n keys `Home.Faq.questions.q7_*`, `q8_*` (Task 1).

- [ ] **Step 1: Extend the question-number union in `types.ts`**

Replace:

```ts
const questionNumbers = [1, 2, 3, 4, 5, 6] as const;
```

with:

```ts
const questionNumbers = [1, 2, 3, 4, 5, 6, 7, 8] as const;
```

- [ ] **Step 2: Append entries in `data.tsx`**

Append to the `faqData` array:

```ts
{
  questionKey: "q7_question",
  answerKey: "q7_answer",
},
{
  questionKey: "q8_question",
  answerKey: "q8_answer",
},
```

- [ ] **Step 3: Typecheck**

Run: `pnpm --filter @polotrip/web exec tsc --noEmit`
Expected: no new errors. (If `Faq/index.tsx` maps keys through a typed `t()` call, the new message keys from Task 1 satisfy it.)

- [ ] **Step 4: Commit**

```bash
git add "apps/web/src/app/[locale]/(public)/(home)/(sections)/Faq"
git commit -m "feat(web): add open-source and self-hosting FAQ entries"
```

---

### Task 5: GitHub link in Header (desktop + mobile)

**Files:**
- Modify: `apps/web/src/components/Header/components/Desktop/index.tsx`
- Modify: `apps/web/src/components/Header/components/Mobile/index.tsx`

**Interfaces:**
- Consumes: `GITHUB_REPO_URL` (Task 1); i18n key `Header.github_aria` (Task 1).

- [ ] **Step 1: Desktop header**

In `Desktop/index.tsx`, add imports:

```tsx
import { Github } from "lucide-react";
import { GITHUB_REPO_URL } from "@/constants/githubRepo";
```

Inside the right-side actions container (`<div className="flex items-center gap-4">`), add as the FIRST child (before `<HomeContent …/>`):

```tsx
<a
  aria-label={t("github_aria")}
  className={cn(
    "transition-opacity hover:opacity-70",
    isHome ? "text-white drop-shadow-lg" : "text-foreground"
  )}
  href={GITHUB_REPO_URL}
  rel="noopener noreferrer"
  target="_blank"
>
  <Github className="h-5 w-5" />
</a>
```

Add the `cn` import if not present:

```tsx
import { cn } from "@/lib/cn";
```

- [ ] **Step 2: Mobile header**

In `Mobile/index.tsx`, add the same imports (`Github`, `GITHUB_REPO_URL`). The expanded menu is the absolutely-positioned `div` containing the `#benefits` / `#how-it-works` / `#faq` anchor links. Add a fourth menu item immediately after the `#faq` anchor (before `ButtonNavigation`):

```tsx
<a
  aria-label={t("github_aria")}
  className="flex items-center gap-2 text-foreground"
  href={GITHUB_REPO_URL}
  onClick={toggleMenu}
  rel="noopener noreferrer"
  target="_blank"
>
  <Github className="h-4 w-4" />
  {t("github")}
</a>
```

- [ ] **Step 3: Typecheck**

Run: `pnpm --filter @polotrip/web exec tsc --noEmit`
Expected: no new errors.

- [ ] **Step 4: Commit**

```bash
git add apps/web/src/components/Header
git commit -m "feat(web): add GitHub link to header"
```

---

### Task 6: GitHub link in Footer

**Files:**
- Modify: `apps/web/src/components/Footer/index.tsx`

**Interfaces:**
- Consumes: `GITHUB_REPO_URL` (Task 1); i18n key `Footer.github` (Task 1).

- [ ] **Step 1: Add the link**

In `Footer/index.tsx`, add import:

```tsx
import { GITHUB_REPO_URL } from "@/constants/githubRepo";
```

In the right-hand `<div className="flex flex-col">` (the LEGAL column), add after the privacy-policy `Link` and before the CNPJ span:

```tsx
<a
  className="mt-4 font-body_one text-primary"
  href={GITHUB_REPO_URL}
  rel="noopener noreferrer"
  target="_blank"
>
  {t("github")}
</a>
```

- [ ] **Step 2: Typecheck**

Run: `pnpm --filter @polotrip/web exec tsc --noEmit`
Expected: no new errors.

- [ ] **Step 3: Commit**

```bash
git add apps/web/src/components/Footer/index.tsx
git commit -m "feat(web): add GitHub link to footer"
```

---

### Task 7: Visual verification

**Files:** none (verification only).

- [ ] **Step 1: Start dev server**

Run: `pnpm run dev:web` (root). Wait for `Ready` on `http://localhost:3000`.

- [ ] **Step 2: Check every touchpoint in the browser, both locales**

On `http://localhost:3000` (default locale) and the `pt`/`en` variants:

1. Hero badge shows "Now open source"/"Agora open source", plane animation intact, click opens GitHub repo in new tab.
2. `#open-source` section renders between HowItWorks and FAQ: two columns on desktop, stacked on mobile width (~375px); terminal card scrolls horizontally on mobile instead of overflowing; both CTAs link correctly.
3. Header shows GitHub icon (desktop right side; mobile inside menu); icon legible on the transparent hero header (white on home) and on solid headers (other pages, e.g. `/privacy-policy`).
4. Footer shows GitHub link in the LEGAL column.
5. FAQ shows 8 questions; q7/q8 open and read correctly in both languages.
6. Toggle dark/light theme; terminal card and section text stay legible in both.
7. Paid flow untouched: Cta section and "Access account" header CTA unchanged.

- [ ] **Step 3: Lint sweep**

Run: `pnpm --filter @polotrip/web run lint`
Expected: pass (or only pre-existing warnings).

- [ ] **Step 4: Final commit if fixes were needed**

If verification produced fixes, commit them:

```bash
git add -A apps/web
git commit -m "fix(web): polish open-source landing touchpoints after visual check"
```
