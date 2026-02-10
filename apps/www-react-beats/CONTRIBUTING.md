# Contributing Guide

Thank you for considering contributing to this project!

## Development Setup

1. Fork and clone the repository
2. Install dependencies: `bun install`
3. Copy `.env.example` to `.env.local` and fill in required values
4. Run database migrations: `bun run db:push`
5. Start development server: `bun run dev`

## Code Standards

### TypeScript

- Use TypeScript strict mode
- No `any` types - use proper typing or `unknown`
- Prefer interfaces for object shapes
- Use type inference where possible

### Code Style

- Run `bun run format` before committing
- Run `bun run lint` to check for issues
- Follow existing code patterns
- Keep functions small and focused
- Use meaningful variable names

### Validation

- All user inputs must be validated with Zod schemas
- Place validation schemas in `lib/validations/`
- Export types from validation schemas

### Error Handling

- Use custom error classes from `lib/errors.ts`
- Never expose internal errors to users
- Log errors with context using `lib/logger.ts`
- Wrap async operations in try-catch blocks

### Components

- Keep components focused and single-purpose
- Use composition over inheritance
- Extract reusable logic into custom hooks
- Place shared components in `components/`
- Place feature-specific components near their usage

### Database

- Use Drizzle ORM for all database operations
- Add indexes for frequently queried columns
- Use transactions for multi-step operations
- Never use raw SQL without parameterization

## Commit Messages

Follow conventional commits:

- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code style changes (formatting, etc.)
- `refactor:` Code refactoring
- `test:` Adding or updating tests
- `chore:` Maintenance tasks

Example: `feat: add user profile page`

## Pull Request Process

1. Create a feature branch from `main`
2. Make your changes
3. Run validation: `bun run validate`
4. Commit with conventional commit messages
5. Push to your fork
6. Open a pull request with a clear description

### PR Checklist

- [ ] Code follows project style guidelines
- [ ] All validation scripts pass
- [ ] No console.log statements (use logger)
- [ ] Error handling is implemented
- [ ] Input validation is added
- [ ] Types are properly defined
- [ ] Documentation is updated if needed

## Testing

Currently, this project doesn't have automated tests. When adding tests:

- Place tests next to the code they test
- Use descriptive test names
- Test edge cases and error conditions
- Mock external dependencies

## Questions?

Open an issue for discussion before starting major changes.
