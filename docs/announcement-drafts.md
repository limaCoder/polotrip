# Open Source Announcement Drafts

## X — main post (short, story-first)

A year ago I built a SaaS to turn travel photos into interactive albums — timeline, map, the works.

It never found its market. I got zero paying users.

Today I'm open-sourcing all of it (MIT): Next.js + Fastify monorepo, EXIF-aware upload pipeline, and an MCP server so you can chat with your own travel photos through any AI agent — self-hosted, your data stays yours.

Repo: https://github.com/marioaulima/polotrip

## X — thread version (post 1 = above, then:)

**2/** What's inside:
- Next.js 15 frontend, Fastify backend, Turborepo monorepo
- Client-side compression that preserves EXIF (GPS + date survive upload)
- Interactive map (Leaflet) + timeline generated from photo metadata
- Stripe pay-per-album checkout
- MCP server: point Claude/any MCP client at your albums and ask "where did we have dinner on day 3 in Rome?"

**3/** Why it failed (honest version):
I built for a year and marketed for a week. One LinkedIn post, a couple of Reddit threads. B2C with no distribution is a building with no door.

The code was never the problem. Learn from me: validate the channel before you polish the product.

**4/** Why open source it instead of letting it die:
Your travel memories shouldn't live only inside Google Photos, where a proprietary model reads them. Self-host Polotrip and the photos — and the AI layer on top of them — are yours.

If that resonates, stars and PRs welcome. And if you're building something and want to talk MCP/AI pipelines, DMs open.

## LinkedIn version

**I'm open-sourcing my failed startup.**

A year ago I launched Polotrip — a SaaS that turns travel photos into interactive digital albums with a map, a timeline, and (later) an MCP server that lets you chat with your own photos through AI agents.

It got zero paying users. Not because the product was broken — because I spent a year building and about a week on distribution. Classic engineer mistake, and I'm writing it down so it stays learned.

Instead of letting the repo rot, I'm releasing everything under MIT:

- Turborepo monorepo: Next.js 15 + Fastify + Drizzle
- Upload pipeline with client-side compression that preserves EXIF metadata
- Leaflet map + timeline auto-generated from photo geodata
- Stripe pay-per-album billing
- An MCP server so any AI agent can answer questions about your travel memories — self-hosted, so your photos never leave your infrastructure

If you care about owning your memories instead of renting them from Big Tech, or you just want a real-world MCP + AI pipeline reference, the repo is here:

https://github.com/marioaulima/polotrip

Post-mortem thread with the full lessons coming soon. Feedback, issues, and PRs are very welcome.

## Notes before posting

- Attach a 15–25s screen recording: open an album → scroll timeline → map → MCP chat answering a question about the photos. Posts with demo video massively outperform text-only.
- Post X thread in the morning US time (recruiter/dev audience), LinkedIn same day.
- Pin the X thread to your profile.
