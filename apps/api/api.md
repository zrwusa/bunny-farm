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


┌   Sentry Source Maps Upload Configuration Wizard
│
◇   ──────────────────────────────────────────────────────────────────────────────────╮
│                                                                                     │
│  This wizard will help you upload source maps to Sentry as part of your build.      │
│  Thank you for using Sentry :)                                                      │
│                                                                                     │
│  (This setup wizard sends telemetry data and crash reports to Sentry.               │
│  You can turn this off by running the wizard with the '--disable-telemetry' flag.)  │
│                                                                                     │
│  Version: 5.4.0                                                                     │
│                                                                                     │
├─────────────────────────────────────────────────────────────────────────────────────╯
│
●  If the browser window didn't open automatically, please open the following link to log into Sentry:
│  
│  https://sentry.io/account/settings/wizard/dih2s6sv0h97vfi39wzhs9uvce2ius6xj4adyuruizyqilx4eiae2f1v05h3dqd4/?org_slug=bunny-farm-group&project_slug=bunny-farm-api
│
◇  Login complete.
│
◇  Selected project bunny-farm-group/bunny-farm-api
│
◆  Which framework, bundler or build tool are you using?
│  ○ Angular
│  ○ Create React App
◇  Which framework, bundler or build tool are you using?
│  tsc
│
◇  The @sentry/cli package is already installed. Do you want to update it to the latest version?
│  Yes
│
◇  Please select your package manager.
│  PNPM
│
◇  Updated @sentry/cli with PNPM.
│
◇  Where are your build artifacts located?
│  ./dist
│
◆  Enabled source maps generation in tsconfig.json.
│
●  We recommend checking the modified file after the wizard finished to ensure it works with your build setup.
│
●  Added a sentry:sourcemaps script to your package.json.
│
◇  Do you want to automatically run the sentry:sourcemaps script after each production build?
│  Yes
│
◇  Is pnpm build your production build command?
│  Yes
│
●  Added sentry:sourcemaps script to your build command.
│
◆  Added auth token to .sentryclirc for you to test uploading source maps locally.
│
◆  Created .sentryclirc.
│
◆  Added .sentryclirc to .gitignore.
│
◇  Are you using a CI/CD tool to build and deploy your application?
│  No
│
●  No Problem! Just make sure that the Sentry auth token from .sentryclirc is available whenever you build and deploy your app.
│
◇  Looks like you have Prettier in your project. Do you want to run it on your files?
│  Yes
│
◇  Prettier failed to run.
│
▲  Prettier failed to run. There may be formatting issues in your updated files.
│
└  That's it - everything is set up!

Test and validate your setup locally with the following Steps:

1. Build your application in production mode.
   → For example, run pnpm build.
   → You should see source map upload logs in your console.
2. Run your application and throw a test error.
   → The error should appear in Sentry:
   → https://bunny-farm-group.sentry.io/issues/?project=4509705469493248
3. Open the error in Sentry and verify that it's source-mapped.
   → The stack trace should show your original source code.

If you encounter any issues, please refer to the Troubleshooting Guide:
https://docs.sentry.io/platforms/javascript/sourcemaps/troubleshooting_js

If the guide doesn't help or you encounter a bug, please let us know:
https://github.com/getsentry/sentry-javascript/issues

