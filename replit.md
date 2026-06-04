# SecureVote — Online Secure Voting System

A full-stack educational voting platform demonstrating secure digital elections with JWT auth, OTP verification, real-time results charts, and a full admin panel.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 8080)
- `pnpm --filter @workspace/securevote run dev` — run the frontend (assigned port)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string, `SESSION_SECRET` — JWT secret

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React 19 + Vite, wouter routing, shadcn/ui, framer-motion, recharts, sonner toasts
- API: Express 5 with pino logging
- DB: PostgreSQL + Drizzle ORM
- Auth: JWT (jsonwebtoken) + bcrypt + OTP (6-digit, stored in sessions table)
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec at `lib/api-spec/openapi.yaml`)
- Build: esbuild (CJS bundle)

## Where things live

- `lib/api-spec/openapi.yaml` — OpenAPI spec (source of truth for all API contracts)
- `lib/api-client-react/src/generated/` — generated React Query hooks + Zod schemas (do not edit)
- `lib/db/src/schema/` — Drizzle ORM schema (users, elections, candidates, votes, activity_logs)
- `artifacts/api-server/src/routes/` — Express route handlers (auth, elections, candidates, votes, results, admin)
- `artifacts/securevote/src/pages/` — All frontend pages
- `artifacts/securevote/src/hooks/` — useAuth.ts (JWT auth), useVote.ts (candidate selection state)
- `artifacts/securevote/src/components/Navbar.tsx` — Site navigation with dark mode toggle

## Architecture decisions

- Contract-first API: OpenAPI spec → Orval codegen → typed hooks; never write fetch calls manually.
- JWT auth: tokens stored in localStorage as `sv_token`; `useAuth` hook manages state via `useGetMe`.
- OTP stored in DB sessions table with 10-minute expiry; returned in response message for demo purposes.
- Vote flow: select candidate → `useVote` global state → /vote/confirm → `useCastVote` mutation.
- Admin routes require `role=admin` JWT claim checked by `requireAdmin` middleware.
- Dark mode: manual toggle stored in localStorage `sv_theme`; applied via `.dark` class on `<html>`.

## Product

- **Home page**: Hero with features, how-it-works, benefits section
- **Voter flow**: Register → Login → OTP verify → Dashboard → Browse Candidates → Vote Confirm → Vote Success
- **Public pages**: Results (bar + pie charts), Awareness (FAQ, stats, security info)
- **Voter profile**: Shows voting status and account info
- **Admin panel**: Login → Dashboard (stats + activity log) → Elections, Candidates, Voters, Results management

## Demo Credentials

| Role  | ID / Username | Password    |
|-------|---------------|-------------|
| Voter | V001–V020     | Voter@1234  |
| Admin | admin         | admin123    |

Admin login: `/admin/login`

## Seed Data

- 1 admin, 20 voters (V001–V020), 11 pre-cast votes
- 1 active election: "National College Council Election 2025"
- 5 candidates: Aditya Verma (leading, 3 votes), Neha Singh, Rohit Sharma, Divya Menon, Siddharth Rao

## Gotchas

- Always rebuild the API server (`pnpm --filter @workspace/api-server run build`) before restarting the workflow after route changes.
- OTP hint is shown in the login response `message` field for demo; production would use email/SMS.
- After schema changes: run `pnpm --filter @workspace/db run push` and re-seed if needed.
- The `useVote` hook uses module-level state (not React context) for simplicity; clearing state on vote success is handled in vote-success page.

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
