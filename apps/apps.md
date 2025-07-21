Typescript, NestJS, Next.js, PostgreSQL, GraphQL, Redis, TypeORM, Elastic search, Turborepo Monorepo

| Provider   | Service                        | Tech Stack / Version             | Project Name      | URL                                       |
| ---------- | ------------------------------ | -------------------------------- | ----------------- | ----------------------------------------- |
| Vercel     | Web Frontend                   | Next.js 15.1.5                   | bunny-farm-web    | [vercel.com](https://vercel.com/)         |
| Render     | Web API                        | NestJS 11.0.11, TypeORM, GraphQL | bunny-farm-api    | [render.com](https://render.com/)         |
| Render     | Redis Key-Value Store          | Valkey 8.1.0                     | bunny-farm-kv     | [render.com](https://render.com/)         |
| Neon       | Database (PostgreSQL)          | PostgreSQL 16                    | bunny-farm        | [neon.com](https://neon.com/)             |
| Bonsai     | Search Service (Elasticsearch) | Elasticsearch 7.10.2             | Bunny Farm search | [bonsai.io](https://bonsai.io/)           |
| Cloudflare | Domain & CDN                   | bunnyfarmnz.com                  | -                 | [cloudflare.com](https://cloudflare.com/) |


# Observability and Monitoring

| Function                   | Recommended Tools                                                                                                         | Notes                                                                                    |
| -------------------------- | ------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| **Log Collection**         | [Pino](https://getpino.io/), [Winston](https://github.com/winstonjs/winston) + [Logtail](https://logtail.com/) / Logstash | Use structured logging, and send logs to an external service for analysis                |
| **Error Tracking**         | [Sentry](https://sentry.io)                                                                                               | Automatically capture frontend and backend errors with full stack trace and user context |
| **Performance Monitoring** | [OpenTelemetry](https://opentelemetry.io/) + Grafana / Datadog                                                            | Enables APM insights and distributed tracing                                             |
| **Health Checks**          | NestJS `/health` endpoint + Vercel/Render dashboards                                                                      | For liveness and readiness checks                                                        |
| **Database Monitoring**    | Neon dashboard + `pg_stat_statements`                                                                                     | Analyze slow queries and database performance                                            |

# User Experience Optimization

| Function                           | Recommended Tools                   | Notes                                                         |
| ---------------------------------- | ----------------------------------- | ------------------------------------------------------------- |
| **Internationalization (i18n)**    | Next.js i18n routing, `nestjs-i18n` | Prepares the system for multilingual support                  |
| **Image Optimization**             | Next.js `Image` + Cloudflare CDN    | Improves load time and SEO                                    |
| **Frontend Performance Analytics** | Vercel Performance Insights         | Helps optimize key metrics like LCP, FCP, CLS                 |
| **Session Persistence**            | Redis + Refresh Token Rotation      | If already in use, consider enhancing with token blacklisting |

# Caching and Performance Optimization

| Function                       | Recommended Tools                                                      | Notes                                                |
| ------------------------------ | ---------------------------------------------------------------------- | ---------------------------------------------------- |
| **Redis Caching Strategy**     | Categorized caching for product lists/details, delayed double-deletion | Reduces DB load and improves read performance        |
| **Elasticsearch Tiered Data**  | Keep hot items in memory, asynchronously refresh cold data             | Lowers query load on Elasticsearch                   |
| **GraphQL Query Optimization** | Use DataLoader + pagination                                            | Reduces N+1 problems and improves API response times |

# Security Enhancements

| Function                     | Recommended Tools                               | Notes                                                                |
| ---------------------------- | ----------------------------------------------- | -------------------------------------------------------------------- |
| **XSS/CSRF Protection**      | Next.js built-in defenses, `helmet` in NestJS   | Use `helmet` middleware for securing HTTP headers                    |
| **API Rate Limiting**        | `@nestjs/throttler`, Redis token bucket         | Prevents abuse and brute-force attacks                               |
| **Secret Management**        | `.env` + Render/Neon Secret Store               | Ensures sensitive keys/tokens are not committed to source code       |
| **Audit Logs**               | Custom DB tables or Elasticsearch storage       | For user behavior tracking and compliance purposes                   |
| **GraphQL Query Protection** | `graphql-depth-limit` + `graphql-cost-analysis` | Prevents overly deep or expensive queries from affecting performance |


# Developer Productivity

| Function                            | Recommended Tools                                                      | Notes                                                  |
| ----------------------------------- | ---------------------------------------------------------------------- | ------------------------------------------------------ |
| **CI/CD Automation**                | GitHub Actions + Vercel/Render deploy hooks                            | Automates testing, build, and deployment               |
| **Dependency Vulnerability Checks** | Snyk / `npm audit` + Renovate bot                                      | Detect and patch package vulnerabilities automatically |
| **GraphQL Schema Validation**       | [GraphQL Inspector](https://github.com/kamilkisiela/graphql-inspector) | Ensures safe and controlled changes to GraphQL schemas |
| **Code Quality Analysis**           | [SonarCloud](https://sonarcloud.io/)                                   | Provides code health and technical debt metrics        |
| **Unified Error Format**            | `HttpExceptionFilter` + standard response protocol                     | Improves consistency and error handling in NestJS apps |

# Future-Proof Enhancements

| Function                   | Recommended Tools                                      | Notes                                                           |
| -------------------------- | ------------------------------------------------------ | --------------------------------------------------------------- |
| **Admin Dashboard / CMS**  | [Strapi](https://strapi.io/) or custom-built dashboard | For product and content management                              |
| **Scheduled Tasks**        | `@nestjs/schedule` + Redis delayed queue               | For cleanup jobs, retries, notifications, etc.                  |
| **Permission System**      | RBAC (role-based) or ABAC (attribute-based)            | Enables fine-grained access control                             |
| **Real-Time Capabilities** | NestJS + `socket.io`                                   | For order status updates, chat, live inventory, etc.            |
| **Multi-Tenant Support**   | Schema-per-tenant or logic-based tenancy               | Important if you plan to support multiple vendors in the future |
