# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 0.1.x   | :white_check_mark: |

## Reporting a Vulnerability

If you discover a security vulnerability, please email security@yourdomain.com instead of using the issue tracker.

Please include:

- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Suggested fix (if any)

We will respond within 48 hours and work with you to address the issue.

## Security Measures

This application implements the following security measures:

### Authentication & Authorization
- Better Auth for secure authentication
- Session management with secure cookies
- OAuth 2.0 support for GitHub and Google
- Password hashing with industry-standard algorithms

### Data Protection
- Environment variable validation
- Input validation with Zod schemas
- SQL injection prevention via parameterized queries
- XSS protection via React's built-in escaping

### Network Security
- HTTPS enforcement in production
- Security headers (HSTS, CSP, X-Frame-Options, etc.)
- CORS configuration
- Rate limiting on API endpoints

### Application Security
- TypeScript for type safety
- Error boundaries to prevent information leakage
- Structured logging without sensitive data
- Dependency vulnerability scanning

### Database Security
- Type-safe queries with Drizzle ORM
- Prepared statements
- Connection pooling
- Encrypted connections to Turso

## Best Practices

When contributing:

1. Never commit secrets or API keys
2. Use environment variables for configuration
3. Validate all user inputs
4. Follow the principle of least privilege
5. Keep dependencies up to date
6. Write secure code following OWASP guidelines

## Security Updates

We regularly update dependencies to patch security vulnerabilities. Run `bun update` regularly to stay current.
