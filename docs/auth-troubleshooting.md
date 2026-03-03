# Auth & Cookie Troubleshooting: The Great Polotrip Debugging Legacy

This document serves as a post-mortem and permanent reference for the series of authentication and cookie-related issues encountered during the integration of **Better Auth 1.4**, **Fastify**, and **Next.js** (using rewrites).

## 🚀 The TL;DR (Context)

Our architecture uses a decoupled **Next.js** frontend and a **Fastify** backend. To avoid CORS issues and simplify authentication, we use Next.js `rewrites` to proxy `/api/:path*` to the backend. This allows cookies to be shared under a "same-origin" illusion for the browser.

---

## 🔍 Root Causes & Solutions

### 1. Fastify `toNodeHandler` & Multiple `Set-Cookie` Headers

**The Issue:** The default Better Auth Fastify integration or generic Node adapters often fail to properly relay multiple `Set-Cookie` headers when running behind a proxy. Fastify's response handling sometimes "squashed" these headers or only sent the first one.
**The Fix:** We bypassed `toNodeHandler` and implemented a custom manual handler in `apps/server/src/http/routes/v1/auth/index.ts`.

- **CRITICAL:** We used `response.headers.getSetCookie()` instead of `forEach`.
- **Wait, Why?** `Headers.forEach` concatenates multiple `Set-Cookie` headers into a single comma-separated string, which browsers **reject**. `getSetCookie()` returns a proper array that Fastify can emit as separate headers.

### 2. The Fatal Cookie Name Collision

**The Issue:** We had manually renamed the `session_token` to `polotrip.state`.
**The Conflict:** Better Auth's OAuth/Google flow uses a temporary security cookie also named `${prefix}.state`.

- **The Result:** During the callback, Better Auth would send a command to **delete** the `state` cookie (Max-Age=0) and **create** the `session_token` cookie simultaneously. Since they had the same name, the deletion won out, and the user was never "logged in".
  **The Fix:** Removed custom naming. We now use the defaults: `polotrip.state` for OAuth flow and `polotrip.session_token` for the session.

### 3. Production `__Secure-` Prefixing

**The Issue:** Better Auth automatically enables `useSecureCookies` in production. This doesn't just add the `Secure` flag; it prepends `__Secure-` to the cookie name (e.g., `__Secure-polotrip.session_token`).
**The Result:** Our Middleware and SSR logic were hardcoded to look for `polotrip.session_token` and failed to see the production cookie.
**The Fix:** Updated all lookups to check for both:

```typescript
const sessionCookie =
  cookies.get('__Secure-polotrip.session_token') || cookies.get('polotrip.session_token');
```

### 4. Next.js SSR Header Forwarding (The `.find()` Bug)

**The Issue:** In `apps/web/src/http/api.ts`, we gathered cookies to forward to the backend during Server-Side Rendering (SSR).

- **The Bug:** We used `.find(c => c.startsWith("polotrip"))`.
- **The Result:** Since Better Auth sends multiple cookies (csrf, state, session), `.find()` only grabbed the _first_ one it found. If the session token wasn't first, it was dropped, causing 401s on server-rendered pages.
  **The Fix:** Changed to `.filter(...).join("; ")` to forward **all** relevant cookies.

### 5. Client-Side CORS vs. Proxy URL

**The Issue:** The client-side API instance was fetching directly from `env.NEXT_PUBLIC_API_URL` (direct backend domain).
**The Result:** Even with correct cookies, the browser blocked sending them to `api.polotrip.com` because they were `SameSite=Lax` and tied to `polotrip.com`.
**The Fix:** Forced the browser client to use the relative `/api/` path:

```typescript
const baseConfig = {
  prefixUrl: isClient ? '/api/' : `${env.NEXT_PUBLIC_API_URL}/api/`,
  // ...
};
```

This forces browser requests through the Next.js `rewrites` proxy, attaching the cookies correctly.

---

## 🛠️ Checklist for New Auth Features

- [ ] **Cookie Names:** Never name a custom cookie the same as an internal Better Auth state/csrf cookie.
- [ ] **Prefixes:** Always account for `__Secure-` prefix in production when reading cookies manually.
- [ ] **Header Extraction:** Always use `getSetCookie()` if mapping headers manually to avoid comma-concatenation.
- [ ] **API URL:** Browser-side requests **MUST** use the relative `/api/` path to leverage the Next.js proxy and SameSite cookies.
- [ ] **SSR Forwarding:** Server-side requests **MUST** filter and forward all auth-related cookies, not just the first one found.

---

## 📂 Key Files Involved

- `packages/auth/src/auth.ts`: Global Auth Configuration.
- `apps/server/src/http/routes/v1/auth/index.ts`: Fastify Adapter/Proxy.
- `apps/web/src/http/api.ts`: Centralized API client (SSR/Client hybrid).
- `apps/web/src/middleware.ts`: Next.js Auth Guard.
- `apps/web/next.config.ts`: Proxy Rewrites configuration.
