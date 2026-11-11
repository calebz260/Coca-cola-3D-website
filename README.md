# Contour: a Coca-Cola concept site

An interactive 3D concept for the contour bottle. Independent concept project, not affiliated
with or endorsed by The Coca-Cola Company. No official logos, photography or licensed models
are included: the wordmark is typeset and the bottle is generated in code (see `DESIGN.md`).

```
client/   React 19 + TypeScript + Vite, Three.js via React Three Fiber + drei, GSAP, Tailwind CSS 4
server/   Node + Express 5 + TypeScript, Prisma 6, PostgreSQL 16, zod validation
```

## Quick start

Requirements: Node 20+, Docker Desktop.

```bash
# 1. Database (PostgreSQL 16 in Docker, host port 5433)
npm run db:up

# 2. API environment
cp server/.env.example server/.env        # PowerShell: Copy-Item server/.env.example server/.env

# 3. Dependencies (each app has its own package.json)
npm --prefix server install               # also runs `prisma generate`
npm --prefix client install

# 4. Create the table
npm run db:migrate

# 5. Run API (http://localhost:5050) and site (http://localhost:5173) together
npm run dev
```

## Scripts

| Command (from repo root) | What it does |
|---|---|
| `npm run dev` | API with hot reload + Vite dev server |
| `npm run typecheck` | `tsc --noEmit` for client and server |
| `npm test` | API tests (Vitest + Supertest, no database needed) |
| `npm run test:e2e` | Playwright browser tests on desktop, tablet, phone and 320px (needs API + DB running) |
| `npm run build` | Production builds: `client/dist` and `server/dist` |
| `npm run db:up` / `db:down` | Start or stop PostgreSQL |

Production: `npm --prefix server run db:deploy`, then `npm --prefix server start`, and serve
`client/dist` behind the same origin with `/api` proxied to the API (or set `VITE_API_URL`
at build time and add the site origin to `CORS_ORIGIN`). Set `TRUST_PROXY=1` behind a proxy so
rate limiting sees real client IPs.

## API

| Method | Path | Notes |
|---|---|---|
| `GET` | `/api/health` | `{ status, database }`, 503 when the database is unreachable |
| `POST` | `/api/contact` | `{ fullName, email, subject, message }`. 201 on success, 400 with `fieldErrors`, 429 when rate limited (5 per 15 min per IP by default) |

Security: helmet headers, CORS allow-list, 20 kB JSON body limit, strict zod schema (unknown
fields rejected, control characters stripped), honeypot field, rate limiting, errors never expose
stack traces or database details. Secrets live in `server/.env`, which is git-ignored.

## 3D and performance notes

- One fixed WebGL canvas for the whole page. GSAP ScrollTrigger moves the bottle between the
  hero, story and experience sections. The canvas stops rendering while other sections are on screen.
- Three.js, R3F and drei ship in a separate chunk loaded with `React.lazy` after first paint.
  An SVG bottle with the same profile stands in while it loads.
- Quality tiers: `high` (desktop), `lite` (phones, low memory, data saver: fewer particles, no
  contact shadow, lower pixel ratio) and `none` (no WebGL: SVG bottle that still follows the
  scroll choreography). Force one with `?stage=high|lite|none`.
- `prefers-reduced-motion` stops auto-spin, bubble movement, the hero entrance and text reveals.
- The bottle is procedural geometry (lathe-turned profile), so there is no GLB to compress. If you
  get a licensed GLB later, compress it with `npx @gltf-transform/cli optimize in.glb out.glb
  --compress meshopt` and load it with drei's `useGLTF`.
