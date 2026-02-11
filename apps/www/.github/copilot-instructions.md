# ============================================================================
#  DX — OFFICIAL WEBSITE · SYSTEM INSTRUCTIONS
#  Enhanced Development Experience · https://dx.dev
# ============================================================================
#
#  This file is the single source of truth for every AI assistant, copilot,
#  or code-generation tool that touches this codebase.  Every suggestion,
#  refactor, and new file MUST comply with the rules below.
#
#  Last updated : 2026-02-10
#  Maintainer   : DX Core Team
# ============================================================================


# ─────────────────────────────────────────────────────────────────────────────
# 0. PROJECT OVERVIEW
# ─────────────────────────────────────────────────────────────────────────────

Project Name    : DX (Enhanced Development Experience)
Project Type    : Official marketing + product website with authenticated
                  dashboard, tool-specific documentation spaces, macOS-style
                  dock bar, and real-time guest collaboration chat.

DX is a comprehensive developer platform offering 24/7 AI-powered CLI agents,
400+ pillar integrations, a desktop GUI app, and a rich ecosystem of tools
(Forge Style, Serializer, Media, Icon, Font, Check, and many others).

The entire DX ecosystem is built with Rust for performance and security.
The CLI is powered by Rust + GPU acceleration (Jet Team).
This website is the public-facing Next.js application for DX.


# ─────────────────────────────────────────────────────────────────────────────
# 1. TECH STACK — USE ONLY THESE, ALWAYS LATEST STABLE VERSIONS
# ─────────────────────────────────────────────────────────────────────────────

## Core Framework
- Next.js 16 (Nexus) — App Router ONLY, Turbopack enabled by default.
- Partial Prerendering (PPR) enabled where applicable.
- React 19 (Latest Stable)
- TypeScript 5.7+ (strict mode, NO `any` types ever)

## Styling & UI
- Tailwind CSS 4 (Oxide engine enabled by default)
- shadcn/ui (latest registry, `npx shadcn@latest`)
- Class Variance Authority (CVA) for component variants
- tailwind-merge (`twMerge`) for conditional class merging
- clsx for className construction
- Motion (formerly Framer Motion) v12+ for all animations

## State Management & Data Fetching
- Zustand 5 (lightweight global stores — NO Redux, NO Context for state)
- TanStack React Query v5 (all server data, caching, mutations)
- Next.js Server Actions for form mutations
- nuqs (latest) for URL search-param state synchronization

## Forms & Validation
- React Hook Form v7
- Zod v3.24+ for ALL schemas (API payloads, form validation, env vars)

## Authentication
- Better Auth for auth, session management, user profiles
  (If the team later decides on a different provider, swap the adapter
   but keep the same abstraction layer described in Section 7.)

## Real-Time / Chat
- Socket.IO (or PartyKit / Ably) for the guest collaboration chat
- Use WebSocket transport with automatic fallback
- All messages are ephemeral (NOT persisted to DB) unless configured

## Database & ORM (if needed for user data / chat rooms)
- Drizzle ORM with PostgreSQL (Neon / Supabase / PlanetScale)
- drizzle-zod for schema ↔ Zod type inference

## Tooling & DX (meta)
- bun (NOT npm, NOT yarn)
- Biome (formatting + linting) — config in `biome.json`
- Husky + lint-staged for pre-commit hooks
- Commitlint (Conventional Commits enforced)

## Testing
- Vitest for unit/integration tests
- Playwright for E2E tests
- Testing Library (@testing-library/react) for component tests
- MSW (Mock Service Worker) v2 for API mocking in tests

## Monitoring & Analytics (production)
- Sentry for error tracking
- Vercel Analytics + Speed Insights
- PostHog for product analytics (feature flags, session replay)

## Deployment
- Vercel (primary target)
- Docker support for self-hosting
- Edge Runtime for middleware, ISR for docs pages


# ─────────────────────────────────────────────────────────────────────────────
# 2. PROJECT STRUCTURE — FOLLOW THIS EXACTLY
# ─────────────────────────────────────────────────────────────────────────────

```
src/
├── app/
│   ├── (marketing)/          # Route group: public pages
│   │   ├── page.tsx          # Landing page
│   │   ├── pricing/page.tsx
│   │   ├── about/page.tsx
│   │   ├── changelog/page.tsx
│   │   └── layout.tsx
│   ├── (auth)/               # Route group: auth pages
│   │   ├── sign-in/page.tsx
│   │   ├── sign-up/page.tsx
│   │   └── layout.tsx
│   ├── (dashboard)/          # Route group: authenticated area
│   │   ├── dashboard/page.tsx
│   │   ├── settings/page.tsx
│   │   ├── agent/page.tsx
│   │   └── layout.tsx
│   ├── (docs)/               # Route group: documentation
│   │   ├── docs/
│   │   │   ├── [tool]/
│   │   │   │   ├── page.tsx
│   │   │   │   ├── [...slug]/page.tsx
│   │   │   │   └── layout.tsx
│   │   │   └── page.tsx
│   │   └── layout.tsx
│   ├── api/
│   │   ├── chat/route.ts
│   │   ├── webhooks/route.ts
│   │   └── health/route.ts
│   ├── layout.tsx
│   ├── not-found.tsx
│   ├── error.tsx
│   ├── loading.tsx
│   └── globals.css
├── components/
│   ├── ui/                   # shadcn/ui primitives
│   ├── layout/               # Header, Footer, Sidebar
│   ├── landing/              # Landing page sections
│   ├── dashboard/            # Dashboard components
│   ├── docs/                 # Documentation components
│   ├── chat/                 # Guest chat components
│   ├── dock/                 # macOS Dock bar
│   ├── effects/              # Visual effects (Spotlight, Noise, etc.)
│   ├── animations/           # React-bits animation components
│   ├── backgrounds/          # React-bits background components
│   ├── providers/            # Theme, Auth providers
│   └── shared/               # Cross-cutting components
├── hooks/
├── lib/
│   ├── utils.ts
│   ├── constants.ts
│   ├── fonts.ts
│   ├── metadata.ts
│   ├── env.ts
│   └── auth.ts
├── stores/
│   ├── dock-store.ts
│   ├── chat-store.ts
│   └── ui-store.ts
├── services/
│   └── api-client.ts
├── schemas/
├── types/
├── config/
│   ├── tools.ts
│   ├── navigation.ts
│   └── site.ts
├── content/                  # MDX docs content
└── middleware.ts
```


# ─────────────────────────────────────────────────────────────────────────────
# 3. CODING STANDARDS — NON-NEGOTIABLE RULES
# ─────────────────────────────────────────────────────────────────────────────

## 3.1 TypeScript
- STRICT MODE always enabled in tsconfig.json.
- NEVER use `any`. Use `unknown` + type guards or proper generics.
- NEVER use `@ts-ignore` or `@ts-expect-error` without a linked issue comment.
- ALL function parameters and return types MUST be explicitly typed.
- Use `satisfies` operator for type-safe object literals.
- Prefer `interface` for object shapes, `type` for unions/intersections.
- Export types from a barrel `index.ts` in the `types/` directory.

## 3.2 React & Next.js
- ALL components are functional components with arrow function syntax.
- Default to React Server Components (RSC). Only add `"use client"` when
  the component genuinely needs browser APIs, hooks, or event handlers.
- `"use client"` directive goes on the SMALLEST possible component.
- Leverage Partial Prerendering (PPR) by wrapping dynamic in `Suspense`.
- NEVER use `useEffect` for data fetching — use TanStack Query or RSC.
- NEVER use `useEffect` for derived state — use `useMemo` or compute inline.
- Use `React.Suspense` with meaningful fallback components.
- Use `next/image` for ALL images. Always provide `width`, `height`, `alt`.
- Use `next/link` for ALL internal navigation.
- Use `next/font` for ALL fonts — no external font CDN links.

## 3.3 Component Architecture
- NAMING: PascalCase for components, kebab-case for files.
- ONE component per file (exception: small tightly-coupled sub-components).
- Props interface named `{ComponentName}Props`.
- Use `children` prop and composition over deep prop drilling.
- Extract custom hooks when component logic exceeds ~30 lines.
- Use `forwardRef` for interactive UI primitives.
- Always `memo()` expensive list-rendered components.

## 3.4 Styling (Tailwind 4 + shadcn)
- NEVER use inline `style={{}}` — Tailwind only.
- Use the `cn()` utility for ALL conditional classes.
- Use CVA for component variants.
- Mobile-first responsive: `base → sm → md → lg → xl → 2xl`.
- Dark mode: use `dark:` variant. Theme toggle via `next-themes`.
- Animations: use Motion library. Define animation variants as constants.

## 3.5 State Management
- Zustand stores: one store per domain (dock, chat, UI preferences).
- NEVER put server/fetched data in Zustand — use React Query.
- Use Zustand selectors to prevent unnecessary re-renders.

## 3.6 Data Fetching
- Server Components: use `fetch()` with `next: { revalidate }`.
- Client Components: use `useQuery` / `useMutation` from TanStack Query.
- ALL API calls go through the `services/` layer.
- Validate ALL API responses with Zod.

## 3.7 Security
- Validate ALL inputs with Zod on BOTH client and server.
- Sanitize user-generated content (chat messages).
- NEVER expose server-only secrets to the client.
- Auth checks in middleware.ts + layout-level checks.

## 3.8 Accessibility
- WCAG 2.1 AA compliance minimum.
- All interactive elements must be keyboard accessible.
- Use semantic HTML elements.
- Focus management for modals, dialogs, and dock bar.
- Color contrast ratio ≥ 4.5:1 for text.

## 3.9 Performance
- Lazy load below-the-fold sections with `dynamic()`.
- Images: WebP/AVIF, responsive `sizes`, `priority` for LCP.
- Fonts: `next/font` with `display: "swap"`, subset to `latin`.
- Target: LCP < 2.5s, FID < 100ms, CLS < 0.1.


# ─────────────────────────────────────────────────────────────────────────────
# 4. FEATURE SPECIFICATIONS
# ─────────────────────────────────────────────────────────────────────────────

## 4.1 Landing Page
- Hero with animated headline, gradient backgrounds, CTA buttons
- Feature grid showcasing all DX tools
- Interactive CLI terminal mockup
- FAQ section, testimonials, CTA
- macOS Dock Bar fixed at bottom

## 4.2 Authentication (Better Auth)
- Custom-styled sign-in/sign-up pages
- OAuth: GitHub, Google, GitLab
- Middleware-based route protection for dashboard

## 4.3 Dashboard — DX Reaction Board
- Tool status cards, agent status, activity feed
- Quick actions panel, settings

## 4.4 macOS Dock Bar
- Fixed bottom on ALL pages
- Mouse-proximity magnification (Motion)
- Lists all DX tools from registry
- Chat icon opens guest chat panel
- Frosted glass background, keyboard accessible

## 4.5 Documentation Spaces (/docs/[tool])
- Tool-specific layouts with sidebar, TOC, breadcrumbs
- MDX with CodeBlock, Callout, Steps, Tabs components
- Search, previous/next navigation

## 4.6 Guest Collaboration Chat
- Real-time text messaging via WebSocket
- Ephemeral messages, no auth required
- Typing indicators, online count, emoji reactions


# ─────────────────────────────────────────────────────────────────────────────
# 5. DESIGN SYSTEM
# ─────────────────────────────────────────────────────────────────────────────

- Dark-mode first
- Primary: DX brand purple hsl(262 83% 58%)
- Accent: Agent green hsl(142 71% 45%)
- Glassmorphism: `backdrop-blur-xl bg-white/5`
- Fonts: Inter (body), JetBrains Mono (code) via next/font
- Smooth, purposeful Motion animations


# ─────────────────────────────────────────────────────────────────────────────
# 6. FILE NAMING CONVENTIONS
# ─────────────────────────────────────────────────────────────────────────────

Files/Folders        : kebab-case          (dock-bar.tsx)
Components           : PascalCase export   (export const DockBar)
Hooks                : camelCase, `use` prefix (useDock)
Stores               : kebab-case file, camelCase hook (dock-store.ts)
Schemas              : kebab-case file, camelCase export
Types/Interfaces     : PascalCase          (DXTool, ChatMessage)
Constants            : SCREAMING_SNAKE     (MAX_CHAT_MESSAGES)


# ─────────────────────────────────────────────────────────────────────────────
# 7. IMPORTANT CONSTRAINTS
# ─────────────────────────────────────────────────────────────────────────────

1.  NEVER generate placeholder "lorem ipsum" content. Use realistic DX copy.
2.  NEVER use `var` — always `const`, use `let` only when reassignment needed.
3.  NEVER use default exports except Next.js pages/layouts.
4.  Use path aliases: `@/components/...`, `@/lib/...`, `@/stores/...`.
5.  ALWAYS handle loading and error states.
6.  ALWAYS add `key` props to lists — NEVER use array index as key.
7.  ALWAYS return early for guard clauses.
8.  ALWAYS use `as const` for literal arrays/objects.
9.  Maximum file length: ~300 lines. Decompose if longer.
10. Use absolute imports with `@/` prefix exclusively.
11. Group imports: React/Next → third-party → internal → types.
12. ALL asynchronous fetching should leverage Next.js caching.
13. Produce COMPLETE files — no `// ... rest of code` shortcuts.

# ============================================================================
#  END OF SYSTEM INSTRUCTIONS
# ============================================================================
