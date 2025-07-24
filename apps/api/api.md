# Sentry
Tracking code errors and exceptions to help developers find bugs.
In the global exception filter: catch unhandled exceptions and report them (such as AllExceptionsFilter).
In the application-level log: logger.error() and logger.warn() can be written to the log + report to Sentry.


# Prometheus
Application exposes /metrics interface, Prometheus regularly crawls

## Common indicators:

Number of HTTP requests, delays (such as histogram)

Memory, CPU usage (in combination with Node Exporter or process metrics)

Active connections, database connection pool occupancy, etc.

## Access libraries: such as prom-client (Node.js), @willsoto/nestjs-prometheus (NestJS)

# Sentry upload source map

pnpm dlx @sentry/wizard@latest -i sourcemaps --saas --org bunny-farm-group --project bunny-farm-api
