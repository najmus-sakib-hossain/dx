# Next.js Modern Stack Setup

## Quick Start

1. Install dependencies:
```bash
bun install
```

2. Set up environment variables:
```bash
cp .env.example .env.local
```

3. Generate a secret for Better Auth:
```bash
openssl rand -base64 32
```
Add it to `.env.local` as `BETTER_AUTH_SECRET`

4. Run database migrations:
```bash
bun run db:push
```

5. Start the development server:
```bash
bun run dev
```

Visit http://localhost:3000

## Tech Stack

- **Next.js 16** - React framework with App Router
- **React Query (TanStack Query v5)** - Data fetching and caching
- **Framer Motion 12** - Animation library
- **Drizzle ORM** - Type-safe database queries
- **Turso** - SQLite database (libSQL)
- **Zustand 5** - State management
- **Better Auth 1.4** - Authentication
- **PGlite** - PostgreSQL in the browser
- **Spline** - 3D rendering

## Database Setup

### Using Turso (Production)

1. Install Turso CLI:
```bash
curl -sSfL https://get.tur.so/install.sh | bash
```

2. Create a database:
```bash
turso db create my-app
```

3. Get credentials:
```bash
turso db show my-app --url
turso db tokens create my-app
```

4. Update `.env.local` with your Turso credentials

### Using Local SQLite (Development)

The project is already configured to use `file:local.db` for local development.

## Available Scripts

- `bun run dev` - Start development server
- `bun run build` - Build for production
- `bun run start` - Start production server
- `bun run lint` - Run Biome linter
- `bun run format` - Format code with Biome
- `bun run db:generate` - Generate migrations
- `bun run db:migrate` - Run migrations
- `bun run db:push` - Push schema to database
- `bun run db:studio` - Open Drizzle Studio

## Features Demonstrated

### React Query
- Data fetching with caching
- Mutations with optimistic updates
- Automatic refetching
- DevTools integration

### Framer Motion
- Page animations
- Component transitions
- Hover effects
- Staggered animations

### Zustand
- Global state management
- Persistent storage
- DevTools support

### Better Auth
- Email/password authentication
- OAuth providers (GitHub, Google)
- Session management

### PGlite
- Browser-based PostgreSQL
- Local-first data storage
- No backend required

### Spline
- 3D scene rendering
- Interactive 3D elements

## OAuth Setup (Optional)

### GitHub OAuth

1. Go to GitHub Settings > Developer settings > OAuth Apps
2. Create a new OAuth App
3. Set callback URL: `http://localhost:3000/api/auth/callback/github`
4. Add credentials to `.env.local`

### Google OAuth

1. Go to Google Cloud Console
2. Create OAuth 2.0 credentials
3. Set callback URL: `http://localhost:3000/api/auth/callback/google`
4. Add credentials to `.env.local`
