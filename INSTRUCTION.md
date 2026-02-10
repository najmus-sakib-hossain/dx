At apps/www folder please do these:

```markdown
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
- Next.js 16 (Nexus) — App Router ONLY.
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
- Turbopack (Default in Next 16)

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

dx-website/
├── .github/
│   ├── workflows/           # CI/CD pipelines (lint, test, deploy)
│   └── PULL_REQUEST_TEMPLATE.md
├── .husky/                  # Git hooks
├── public/
│   ├── fonts/               # Self-hosted fonts (WOFF2)
│   ├── images/              # Static images (prefer SVG / WebP / AVIF)
│   ├── icons/               # Favicons, PWA icons
│   └── og/                  # Open Graph images
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── (marketing)/     # Route group: public pages
│   │   │   ├── page.tsx                 # Landing page
│   │   │   ├── pricing/page.tsx
│   │   │   ├── about/page.tsx
│   │   │   ├── changelog/page.tsx
│   │   │   └── layout.tsx
│   │   ├── (auth)/          # Route group: auth pages
│   │   │   ├── sign-in/[[...sign-in]]/page.tsx
│   │   │   ├── sign-up/[[...sign-up]]/page.tsx
│   │   │   └── layout.tsx
│   │   ├── (dashboard)/     # Route group: authenticated area
│   │   │   ├── dashboard/page.tsx       # DX Reaction Board
│   │   │   ├── settings/page.tsx
│   │   │   ├── agent/page.tsx           # CLI Agent control panel
│   │   │   └── layout.tsx               # Auth-protected layout
│   │   ├── (docs)/          # Route group: documentation
│   │   │   ├── docs/
│   │   │   │   ├── [tool]/              # Dynamic: /docs/forge-style, /docs/serializer
│   │   │   │   │   ├── page.tsx         # Tool overview
│   │   │   │   │   ├── [...slug]/page.tsx  # Nested doc pages
│   │   │   │   │   └── layout.tsx       # Tool-specific sidebar
│   │   │   │   └── page.tsx             # Docs index
│   │   │   └── layout.tsx
│   │   ├── api/             # API routes (Route Handlers)
│   │   │   ├── chat/        # WebSocket / chat endpoints
│   │   │   ├── webhooks/    # Clerk webhooks, Stripe webhooks
│   │   │   └── health/route.ts
│   │   ├── layout.tsx       # Root layout
│   │   ├── not-found.tsx    # Custom 404
│   │   ├── error.tsx        # Global error boundary
│   │   ├── loading.tsx      # Global loading UI
│   │   └── globals.css      # Tailwind directives + CSS custom properties
│   ├── components/
│   │   ├── ui/              # shadcn/ui primitives (button, dialog, etc.)
│   │   ├── layout/          # Header, Footer, DockBar, Sidebar
│   │   ├── landing/         # Landing page sections
│   │   ├── dashboard/       # Dashboard-specific components
│   │   ├── docs/            # Documentation components (MDX, CodeBlock)
│   │   ├── chat/            # Guest chat components
│   │   ├── dock/            # macOS Dock bar components
│   │   └── shared/          # Reusable across all areas
│   ├── hooks/               # Custom React hooks
│   ├── lib/                 # Utility functions and configurations
│   │   ├── utils.ts         # cn(), formatDate(), etc.
│   │   ├── constants.ts     # App-wide constants
│   │   ├── fonts.ts         # next/font configurations
│   │   └── metadata.ts      # SEO metadata helpers
│   ├── stores/              # Zustand stores
│   │   ├── dock-store.ts
│   │   ├── chat-store.ts
│   │   └── ui-store.ts
│   ├── services/            # API service layer (fetch wrappers)
│   ├── schemas/             # Zod schemas (shared between client & server)
│   ├── types/               # TypeScript type definitions
│   ├── config/              # App config, navigation, tool registry
│   │   ├── tools.ts         # DX tools registry (name, icon, route, docs)
│   │   ├── navigation.ts    # Nav items
│   │   └── site.ts          # Site-wide config (name, description, URLs)
│   ├── content/             # MDX content for docs (if using local content)
│   └── middleware.ts        # Next.js middleware (auth, redirects, i18n)
├── drizzle/                 # DB migrations
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/
├── biome.json
├── tailwind.config.ts
├── tsconfig.json
├── next.config.ts
├── drizzle.config.ts
├── vitest.config.ts
├── playwright.config.ts
├── .env.example
├── .env.local               # (git-ignored)
├── package.json
└── README.md


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
- Use branded types for IDs: `type UserId = string & { __brand: 'UserId' }`.
- Export types from a barrel `index.ts` in the `types/` directory.

## 3.2 React & Next.js 16 (Nexus)
- ALL components are functional components with arrow function syntax.
- Default to React Server Components (RSC). Only add `"use client"` when
  the component genuinely needs browser APIs, hooks, or event handlers.
- `"use client"` directive goes on the SMALLEST possible component, not
  on parent layouts or pages.
- Leverge **Partial Prerendering (PPR)** where applicable by wrapping dynamic components in `Suspense`.
- NEVER use `useEffect` for data fetching — use TanStack Query or
  Server Components with `fetch`.
- NEVER use `useEffect` for derived state — use `useMemo` or compute inline.
- Use `React.Suspense` with meaningful fallback components (never empty divs).
- Use `next/image` for ALL images. Always provide `width`, `height`, `alt`.
- Use `next/link` for ALL internal navigation. Never use `<a>` tags internally.
- Use `next/font` for ALL fonts — no external font CDN links.
- Use Next.js Metadata API for SEO (generateMetadata, opengraph-image).
- Pages must export `generateStaticParams` where possible for static generation.
- API Route Handlers: use typed `NextRequest` / `NextResponse`.
- Middleware: keep minimal, fast, edge-compatible.

## 3.3 Component Architecture
- NAMING: PascalCase for components, kebab-case for files.
  Example: `HeroSection` → `hero-section.tsx`
- ONE component per file (exception: small tightly-coupled sub-components).
- Props interface named `{ComponentName}Props`.
- Destructure props in function signature.
- Use `children` prop and composition over deep prop drilling.
- Collocate component, its types, and its tests:
    components/dock/dock-bar.tsx
    components/dock/dock-bar.test.tsx
    components/dock/dock-item.tsx
- Extract custom hooks when component logic exceeds ~30 lines.
- Use `forwardRef` for interactive UI primitives.
- Always `memo()` expensive list-rendered components.

## 3.4 Styling (Tailwind 4 + shadcn)
- NEVER use inline `style={{}}` — Tailwind only (exception: truly dynamic
  values like `style={{ '--progress': value } as React.CSSProperties}`).
- Use the `cn()` utility (from lib/utils.ts) for ALL conditional classes:
    ```ts
    import { clsx, type ClassValue } from "clsx";
    import { twMerge } from "tailwind-merge";
    export function cn(...inputs: ClassValue[]) {
      return twMerge(clsx(inputs));
    }
    ```
- Use CVA for component variants:
    ```ts
    const buttonVariants = cva("base-classes", {
      variants: { size: { sm: "...", lg: "..." } },
      defaultVariants: { size: "sm" },
    });
    ```
- Design tokens: define in CSS custom properties in globals.css,
  reference via Tailwind theme extension.
- Mobile-first responsive: `base → sm → md → lg → xl → 2xl`.
- Dark mode: use `dark:` variant. Theme toggle via `next-themes`.
- NO arbitrary Tailwind values unless absolutely necessary.
  Extend the theme in `tailwind.config.ts` or CSS variables.
- Animations: use Motion library. Prefer `motion` components.
  Use `AnimatePresence` for enter/exit transitions.
  Define animation variants as constants, not inline objects.

## 3.5 State Management
- Zustand stores: one store per domain (dock, chat, UI preferences).
- Store files export a typed hook:
    ```ts
    interface DockState {
      isExpanded: boolean;
      activeToolId: string | null;
      toggleDock: () => void;
      setActiveTool: (id: string) => void;
    }
    export const useDockStore = create<DockState>()(
      devtools(
        persist((set) => ({ ... }), { name: "dx-dock" })
      )
    );
    ```
- NEVER put server/fetched data in Zustand — that belongs in React Query.
- Use Zustand selectors to prevent unnecessary re-renders:
    ```ts
    const isExpanded = useDockStore((s) => s.isExpanded);
    ```

## 3.6 Data Fetching
- Server Components: use `fetch()` with `next: { revalidate }` or `cache`.
- Client Components: use `useQuery` / `useMutation` from TanStack Query.
- Define query keys as constants in a `query-keys.ts` file.
- ALL API calls go through the `services/` layer — components never
  call `fetch` directly.
- Handle loading, error, and empty states for EVERY query.
- Use Zod `.parse()` or `.safeParse()` to validate ALL API responses.

## 3.7 Forms
- React Hook Form + Zod resolver for EVERY form.
- Schema-first: define the Zod schema, infer the TS type from it:
    ```ts
    const loginSchema = z.object({
      email: z.string().email(),
      password: z.string().min(8),
    });
    type LoginForm = z.infer<typeof loginSchema>;
    ```
- Show field-level validation errors.
- Disable submit button while `isSubmitting`.
- Use Server Actions for simple mutations, React Query for complex ones.

## 3.8 Error Handling
- NEVER swallow errors silently. Log AND surface them.
- Use `error.tsx` boundaries at route segment level.
- API routes: return consistent error shape:
    ```json
    { "success": false, "error": { "code": "VALIDATION_ERROR", "message": "..." } }
    ```
- Use a `Result<T, E>` pattern for service functions:
    ```ts
    type Result<T, E = Error> =
      | { success: true; data: T }
      | { success: false; error: E };
    ```

## 3.9 Performance
- Lazy load below-the-fold sections with `dynamic()` + `ssr: false`.
- Use `React.lazy` + `Suspense` for heavy client components.
- Use `loading.tsx` at route level for instant navigation feedback.
- Images: WebP/AVIF, responsive `sizes` attribute, `priority` for LCP.
- Fonts: `next/font` with `display: "swap"`, subset to `latin`.
- Minimize client-side JavaScript: audit "use client" boundaries.
- Target Web Vitals: LCP < 2.5s, FID < 100ms, CLS < 0.1.

## 3.10 Security
- Validate ALL inputs with Zod on BOTH client and server.
- Sanitize user-generated content (chat messages) — use DOMPurify.
- CSRF protection via Next.js built-in mechanisms.
- Rate limit API routes (use `@upstash/ratelimit` or similar).
- Environment variables: validate with Zod at startup:
    ```ts
    // src/lib/env.ts
    import { z } from "zod";
    const envSchema = z.object({
      DATABASE_URL: z.string().url(),
      CLERK_SECRET_KEY: z.string().min(1),
      NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string().min(1),
      // ...
    });
    export const env = envSchema.parse(process.env);
    ```
- NEVER expose server-only secrets to the client (no `NEXT_PUBLIC_` prefix
  for secrets).
- Use `Content-Security-Policy` headers in `next.config.ts`.
- Auth checks in middleware.ts + layout-level checks for defense in depth.

## 3.11 Accessibility (a11y)
- WCAG 2.1 AA compliance minimum.
- All interactive elements must be keyboard accessible.
- Use semantic HTML: `<nav>`, `<main>`, `<section>`, `<article>`, `<aside>`.
- All images have meaningful `alt` text (or `alt=""` if decorative).
- Focus management for modals, dialogs, and dock bar.
- ARIA attributes where semantic HTML is insufficient.
- Color contrast ratio ≥ 4.5:1 for text, ≥ 3:1 for large text.
- Test with screen reader (VoiceOver / NVDA).
- Use `@axe-core/react` in development.

## 3.12 Documentation & Comments
- JSDoc comments on ALL exported functions, hooks, and components:
    ```ts
    /**
     * DockBar — macOS-style application dock fixed to the bottom of the viewport.
     * Lists all DX tools with animated hover magnification.
     *
     * @param tools - Array of DX tool configurations from the tool registry.
     * @param onToolSelect - Callback fired when a dock item is clicked.
     */
    ```
- Inline comments only for non-obvious "why" (never "what").
- README.md: project setup, architecture overview, environment variables.
- Each tool's docs content is in `src/content/docs/[tool]/`.


# ─────────────────────────────────────────────────────────────────────────────
# 4. FEATURE SPECIFICATIONS
# ─────────────────────────────────────────────────────────────────────────────

## 4.1 Landing Page (`/`)
- Hero section with animated headline, subtext, CTA buttons
  ("Get Started", "View Docs", "Open Dashboard")
- Animated background (gradient mesh or particle effect using Motion)
- Feature grid showcasing DX tools with icons and short descriptions
- Interactive demo / terminal mockup showing the DX CLI in action
- Testimonials / social proof section
- Pricing teaser or CTA section
- Footer with links, socials, legal
- macOS Dock Bar fixed at the bottom (see §4.4)

## 4.2 Authentication
- Clerk integration with custom-styled sign-in/sign-up pages
  matching DX brand design
- OAuth providers: GitHub, Google, GitLab (at minimum)
- Post-auth redirect to `/dashboard`
- Middleware-based route protection for all `(dashboard)` routes
- Webhook handler at `/api/webhooks/clerk` for user sync

## 4.3 Dashboard — DX Reaction Board (`/dashboard`)
- Authenticated area showing user's DX overview
- Tool status cards (active tools, agent status, recent activity)
- Quick actions panel
- CLI Agent status & control (connect, disconnect, view logs)
- Activity feed
- Settings accessible via sidebar or top-right avatar menu

## 4.4 macOS Dock Bar
- Fixed to the bottom of the viewport on ALL pages (public + authenticated)
- Lists all DX tools (from `src/config/tools.ts` registry)
- Each dock item: icon + tooltip on hover
- Mouse-proximity magnification effect (like macOS Dock)
  implemented with Motion — track mouse position,
  scale items based on distance from cursor.
- Click on a tool → navigates to its doc space (`/docs/[tool]`)
- Click on "Chat" icon → opens guest chat panel
- Click on "Dashboard" icon → navigates to dashboard (if authed)
  or sign-in page (if not)
- Responsive: on mobile, transform into a bottom sheet / drawer
- The dock bar has a frosted-glass background (`backdrop-blur`)
- Accessible: full keyboard navigation, ARIA roles

## 4.5 Documentation Spaces (`/docs/[tool]`)
- Each DX tool has its own documentation sub-site:
    /docs/forge-style
    /docs/serializer
    /docs/media
    /docs/icon
    /docs/font
    /docs/check
    /docs/cli
    /docs/agent
    ... (extensible via tool registry)
- Tool-specific layout with:
    - Left sidebar: nested navigation tree for that tool's pages
    - Main content area: MDX-rendered documentation
    - Right sidebar: table of contents (auto-generated from headings)
    - Top breadcrumb: Home > Docs > {Tool} > {Page}
- MDX support with custom components:
    - `<CodeBlock>` with syntax highlighting (Shiki), copy button, line numbers
    - `<Callout>` (info, warning, danger, tip)
    - `<Steps>` for numbered step-by-step guides
    - `<Tabs>` for code examples in different languages
    - `<APIReference>` for endpoint documentation
    - `<PropTable>` for component prop documentation
- Search: implement with FlexSearch or Algolia DocSearch
- Previous/Next page navigation at bottom
- "Edit on GitHub" link
- Version selector (if tools have versioned docs)

## 4.6 Guest Collaboration Chat
- Floating chat widget accessible from the Dock Bar
- When opened, user joins a global "lobby" room (or page-specific room)
- NO authentication required — guests pick a display name + random avatar
- Features:
    - Real-time text messaging via WebSocket (Socket.IO / PartyKit)
    - Shows online user count in the dock icon badge
    - User list sidebar in the chat panel
    - Typing indicators
    - Auto-scroll to latest message
    - Messages are EPHEMERAL — not stored after the session ends
    - Basic moderation: profanity filter, rate limiting (max 1 msg/sec)
    - Emoji reactions on messages
    - System messages for join/leave events
- UI: slide-up panel from dock bar, frosted glass design, Motion animations
- Mobile: full-screen chat overlay
- Accessible: screen reader announcements for new messages


# ─────────────────────────────────────────────────────────────────────────────
# 5. DESIGN SYSTEM & BRANDING
# ─────────────────────────────────────────────────────────────────────────────

## Color Palette (define in globals.css as HSL custom properties)
- Background:      hsl(0 0% 3.9%)          → near-black
- Foreground:      hsl(0 0% 98%)            → near-white
- Primary:         hsl(262 83% 58%)         → DX brand purple
- Primary-hover:   hsl(262 83% 65%)
- Secondary:       hsl(215 20% 15%)         → dark muted blue
- Accent:          hsl(142 71% 45%)         → green for success/agent
- Destructive:     hsl(0 84% 60%)           → red for errors
- Muted:           hsl(0 0% 15%)
- Border:          hsl(0 0% 14.9%)
- Ring:            hsl(262 83% 58%)

## Typography
- Headings:  "Inter" or "Cal Sans" (bold, tight tracking)
- Body:      "Inter" (regular)
- Code:      "JetBrains Mono" or "Fira Code" (monospace)
- All via `next/font` — NO external CDN

## Design Principles
- Dark-mode first (with light mode toggle)
- Glassmorphism: frosted glass panels with `backdrop-blur-xl bg-white/5`
- Smooth, purposeful animations (no gratuitous motion)
- Generous whitespace
- Consistent border radius: `rounded-lg` (8px) for cards, `rounded-xl` for
  larger containers, `rounded-full` for avatars and small badges
- Subtle gradients and glow effects on hover states


# ─────────────────────────────────────────────────────────────────────────────
# 6. ENVIRONMENT VARIABLES
# ─────────────────────────────────────────────────────────────────────────────

Maintain `.env.example` with ALL required vars (no values, just keys):

```env
# ── App ──
NEXT_PUBLIC_APP_URL=
NEXT_PUBLIC_APP_NAME=DX

# ── Clerk Auth ──
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard
CLERK_WEBHOOK_SECRET=

# ── Database ──
DATABASE_URL=

# ── Chat ──
NEXT_PUBLIC_SOCKET_URL=
SOCKET_SECRET=

# ── Analytics ──
NEXT_PUBLIC_POSTHOG_KEY=
NEXT_PUBLIC_POSTHOG_HOST=
SENTRY_DSN=
SENTRY_AUTH_TOKEN=

# ── Search ──
NEXT_PUBLIC_ALGOLIA_APP_ID=
NEXT_PUBLIC_ALGOLIA_SEARCH_KEY=
ALGOLIA_ADMIN_KEY=
```

Validate ALL env vars at build time using the Zod schema in `src/lib/env.ts`.
Separate `server` and `client` schemas.


# ─────────────────────────────────────────────────────────────────────────────
# 7. AUTHENTICATION ABSTRACTION
# ─────────────────────────────────────────────────────────────────────────────

Wrap all auth calls behind an abstraction in `src/lib/auth.ts`:

```ts
// src/lib/auth.ts
import { currentUser, auth } from "@clerk/nextjs/server";

export async function getCurrentUser() { ... }
export async function requireAuth() { ... }  // throws redirect if not authed
export function getAuthToken() { ... }
```

This makes it easy to swap Clerk for another provider in the future
without touching every component.


# ─────────────────────────────────────────────────────────────────────────────
# 8. DX TOOL REGISTRY
# ─────────────────────────────────────────────────────────────────────────────

Every DX tool is registered in `src/config/tools.ts`:

```ts
export interface DXTool {
  id: string;             // "forge-style"
  name: string;           // "Forge Style"
  shortName: string;      // "Forge"
  description: string;    // One-line description
  icon: string;           // Icon component name or path
  color: string;          // HSL accent color for the tool
  docsPath: string;       // "/docs/forge-style"
  status: "stable" | "beta" | "coming-soon";
  category: "styling" | "data" | "media" | "dev-tools" | "cli" | "agent";
}

export const DX_TOOLS: DXTool[] = [
  {
    id: "forge-style",
    name: "Forge Style",
    shortName: "Forge",
    description: "Advanced style system and design token management",
    icon: "Paintbrush",
    color: "hsl(262 83% 58%)",
    docsPath: "/docs/forge-style",
    status: "stable",
    category: "styling",
  },
  // ... all other tools
] as const satisfies DXTool[];
```

The Dock Bar, navigation, docs routes, and landing page ALL read from
this single registry. Adding a new tool = adding one object here.


# ─────────────────────────────────────────────────────────────────────────────
# 9. GIT & CI/CD CONVENTIONS
# ─────────────────────────────────────────────────────────────────────────────

## Commit Messages — Conventional Commits (enforced by commitlint)
  feat(dock): add mouse-proximity magnification effect
  fix(chat): prevent XSS in guest messages
  docs(serializer): add API reference page
  refactor(auth): extract auth abstraction layer
  test(dashboard): add unit tests for reaction board
  chore(deps): update next to 16.x

## Branch Naming
  feat/dock-magnification
  fix/chat-xss
  docs/serializer-api

## PR Requirements
- All checks pass (lint, type-check, tests)
- At least 1 approval
- No `console.log` in production code (use logger utility)
- Bundle size impact reported via CI

## CI Pipeline (GitHub Actions)
  1. Install (pnpm install --frozen-lockfile)
  2. Lint (biome check)
  3. Type check (tsc --noEmit)
  4. Unit tests (vitest run)
  5. Build (next build)
  6. E2E tests (playwright — on PRs to main only)
  7. Deploy preview (Vercel)


# ─────────────────────────────────────────────────────────────────────────────
# 10. FILE NAMING CONVENTIONS
# ─────────────────────────────────────────────────────────────────────────────

Files/Folders        : kebab-case          (dock-bar.tsx, use-dock.ts)
Components           : PascalCase export   (export const DockBar = ...)
Hooks                : camelCase, `use` prefix (useDock, useChat)
Stores               : kebab-case file, camelCase hook (dock-store.ts → useDockStore)
Schemas              : kebab-case file, camelCase export (user-schema.ts → userSchema)
Types/Interfaces     : PascalCase          (DXTool, ChatMessage)
Constants            : SCREAMING_SNAKE     (MAX_CHAT_MESSAGES, DX_TOOLS)
Utilities            : camelCase           (formatDate, cn)
Test files           : co-located, `.test.ts(x)` suffix


# ─────────────────────────────────────────────────────────────────────────────
# 11. PACKAGE.JSON SCRIPTS
# ─────────────────────────────────────────────────────────────────────────────

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "biome check --write .",
    "lint:check": "biome check .",
    "type-check": "tsc --noEmit",
    "test": "vitest run",
    "test:watch": "vitest",
    "test:e2e": "playwright test",
    "test:coverage": "vitest run --coverage",
    "db:generate": "drizzle-kit generate",
    "db:migrate": "drizzle-kit migrate",
    "db:studio": "drizzle-kit studio",
    "postinstall": "pnpm dlx shadcn@latest init"
  }
}
```
*(Note: Turbopack is the default in Next.js 16, explicit flags are optional)*

# ─────────────────────────────────────────────────────────────────────────────
# 12. IMPORTANT CONSTRAINTS & REMINDERS
# ─────────────────────────────────────────────────────────────────────────────

1.  NEVER generate placeholder "lorem ipsum" content. Use realistic DX copy.
2.  NEVER use `var` — always `const`, use `let` only when reassignment needed.
3.  NEVER use default exports (except for Next.js pages/layouts, which require them).
4.  NEVER import from parent directories in shared components (no `../../`).
    Use path aliases: `@/components/...`, `@/lib/...`, `@/stores/...`.
5.  ALWAYS handle loading and error states. No unhandled promises.
6.  ALWAYS add `key` props to lists — NEVER use array index as key.
7.  ALWAYS return early for guard clauses instead of deep nesting.
8.  ALWAYS use `as const` for literal arrays/objects that shouldn't widen.
9.  ALWAYS co-locate related code. Don't scatter related logic across the tree.
10. ALWAYS consider mobile-first and responsive design for every component.
11. ALWAYS check — does this component need `"use client"`? If not, keep it
    as a Server Component.
12. ALWAYS provide proper `aria-label`, `role`, and keyboard handlers
    for interactive custom elements.
13. When generating code, produce COMPLETE files — no `// ... rest of code`
    shortcuts. Every file must be copy-pasteable and functional.
14. Prefer composition over inheritance. Prefer flat over nested.
15. Maximum file length: ~300 lines. If longer, decompose.
16. Use absolute imports with `@/` prefix exclusively.
17. Group imports in this order (with blank lines between groups):
      1. React / Next.js
      2. Third-party libraries
      3. Internal modules (@/...)
      4. Relative imports (only in tests or co-located files)
      5. Type-only imports (using `import type`)
18. ALL asynchronous server component data fetching should leverage
    Next.js caching, `revalidatePath`, or `revalidateTag` where appropriate.


# ─────────────────────────────────────────────────────────────────────────────
# 13. EXAMPLE: cn() UTILITY (for reference)
# ─────────────────────────────────────────────────────────────────────────────

```ts
// src/lib/utils.ts
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
```


# ─────────────────────────────────────────────────────────────────────────────
# 14. EXAMPLE: TYPED FETCH SERVICE
# ─────────────────────────────────────────────────────────────────────────────

```ts
// src/services/api-client.ts
import { env } from "@/lib/env";

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: { code: string; message: string };
}

export async function apiClient<T>(
  endpoint: string,
  options?: RequestInit
): Promise<ApiResponse<T>> {
  const url = `${env.NEXT_PUBLIC_APP_URL}/api${endpoint}`;
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json", ...options?.headers },
    ...options,
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: "Unknown error" }));
    return { success: false, error: { code: String(res.status), message: error.message } };
  }
  const data = (await res.json()) as T;
  return { success: true, data };
}
```


# ─────────────────────────────────────────────────────────────────────────────
# 15. FINAL NOTE
# ─────────────────────────────────────────────────────────────────────────────

This codebase represents the public face of DX — a premium developer tool.
Every pixel, every interaction, and every line of code must reflect the
quality and polish that DX stands for.

Build it like you're proud to show the source code to the world.

When in doubt, choose:
  - Simplicity over cleverness
  - Readability over brevity
  - Type safety over convenience
  - Composition over abstraction
  - User experience over developer shortcuts

# ============================================================================
#  END OF SYSTEM INSTRUCTIONS
# ============================================================================
```
