# Modern Stack Web Application

A production-ready Next.js 16 application showcasing modern web development practices with TypeScript, React Query, Framer Motion, Drizzle ORM, and more.

## Features

- ⚡ **Next.js 16** with App Router and React Server Components
- 🎨 **Tailwind CSS** with shadcn/ui components
- 🔐 **Better Auth** for authentication (email/password + OAuth)
- 📊 **React Query (TanStack Query v5)** for data fetching and caching
- 🎭 **Framer Motion 12** for smooth animations
- 🗄️ **Drizzle ORM** with Turso (libSQL) database
- 🧠 **Zustand 5** for state management
- 🌐 **PGlite** - PostgreSQL in the browser
- 🎨 **Spline** for 3D rendering
- ✅ **Zod** for runtime validation
- 🛡️ **Security headers** and best practices
- 📝 **TypeScript** with strict mode
- 🎯 **Error boundaries** and proper error handling
- 📊 **Structured logging** system

## Prerequisites

- Node.js 20+ or Bun 1.0+
- Git

## Getting Started

### 1. Install Dependencies

```bash
bun install
# or
npm install
```

### 2. Environment Setup

Copy the example environment file:

```bash
cp .env.example .env.local
```

Generate a secure auth secret:

```bash
openssl rand -base64 32
```

Update `.env.local` with your values:

```env
# Required
BETTER_AUTH_SECRET=your-generated-secret-here
BETTER_AUTH_URL=http://localhost:3000

# Optional - for production with Turso
TURSO_DATABASE_URL=libsql://your-database.turso.io
TURSO_AUTH_TOKEN=your-turso-token

# Optional - for OAuth
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

### 3. Database Setup

For local development (uses SQLite):

```bash
bun run db:push
```

For production with Turso:

1. Install Turso CLI:
```bash
curl -sSfL https://get.tur.so/install.sh | bash
```

2. Create a database:
```bash
turso db create my-app
turso db show my-app --url
turso db tokens create my-app
```

3. Update `.env.local` with Turso credentials
4. Run migrations:
```bash
bun run db:push
```

### 4. Run Development Server

```bash
bun run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

- `bun run dev` - Start development server
- `bun run build` - Build for production
- `bun run start` - Start production server
- `bun run lint` - Run Biome linter
- `bun run format` - Format code with Biome
- `bun run db:generate` - Generate database migrations
- `bun run db:migrate` - Run migrations
- `bun run db:push` - Push schema changes to database
- `bun run db:studio` - Open Drizzle Studio (database GUI)

## Project Structure

```
apps/www/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── layout.tsx         # Root layout with providers
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   └── *.tsx             # Feature components
├── lib/                   # Core utilities
│   ├── db/               # Database configuration
│   ├── hooks/            # Custom React hooks
│   ├── providers/        # Context providers
│   ├── store/            # Zustand stores
│   ├── validations/      # Zod schemas
│   ├── auth.ts           # Auth configuration
│   ├── auth-client.ts    # Client-side auth
│   ├── env.ts            # Environment validation
│   ├── errors.ts         # Custom error classes
│   ├── logger.ts         # Logging utility
│   └── utils.ts          # Helper functions
├── public/               # Static assets
└── types/                # TypeScript type definitions
```

## Security Features

- ✅ Environment variable validation with Zod
- ✅ Security headers (CSP, HSTS, X-Frame-Options, etc.)
- ✅ Input validation on all forms
- ✅ Proper error handling without exposing internals
- ✅ Type-safe database queries
- ✅ Authentication with Better Auth
- ✅ CSRF protection
- ✅ XSS protection

## Error Handling

The application uses a structured error handling approach:

- Custom error classes for different error types
- Error boundaries for React component errors
- Structured logging with context
- User-friendly error messages
- Development vs production error details

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

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Docker

```bash
docker build -t modern-stack .
docker run -p 3000:3000 modern-stack
```

## Performance Optimizations

- React Compiler enabled
- Image optimization with Next.js Image
- Code splitting and lazy loading
- Optimized package imports
- Framer Motion animations optimized
- Database query optimization

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run linting and formatting
5. Submit a pull request

## License

MIT

## Support

For issues and questions, please open an issue on GitHub.
