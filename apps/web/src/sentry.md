(base) ➜  web git:(main) ✗ pnpm dlx @sentry/wizard -i nextjs
Packages: +125
+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
Progress: resolved 125, reused 116, downloaded 9, added 125, done

┌   Sentry Next.js Wizard
│
◇   ────────────────────────────────────────────────────────────────────────────────────────────────╮
│                                                                                                   │
│  The Sentry Next.js Wizard will help you set up Sentry for your application.                      │
│  Thank you for using Sentry :)                                                                    │
│                                                                                                   │
│  Version: 6.1.2                                                                                   │
│                                                                                                   │
│  This wizard sends telemetry data and crash reports to Sentry. This helps us improve the Wizard.  │
│  You can turn this off at any time by running sentry-wizard --disable-telemetry.                  │
│                                                                                                   │
├───────────────────────────────────────────────────────────────────────────────────────────────────╯
│
▲  You have uncommitted or untracked files in your repo:
│  
│  - apps/web/next.config.ts
│  - apps/web/src/components/features/cms/product-form-client.tsx
│  - apps/web/src/lib/api/client-actions.ts
│  - apps/web/src/hooks/product/use-create-product.ts
│  
│  The wizard will create and update files.
│
◇  Do you want to continue anyway?
│  Yes
│
◇  Are you using Sentry SaaS or self-hosted Sentry?
│  Sentry SaaS (sentry.io)
│
◇  Do you already have a Sentry account?
│  Yes
│
●  If the browser window didn't open automatically, please open the following link to log into Sentry:
│  
│  https://sentry.io/account/settings/wizard/jyle3qaenqc2f0eaeckqp632h4jzf9ogwjd7jrcs3grw7ab0hfub43lnjb101ajl/?project_platform=javascript-nextjs
│
◇  Login complete.
│
◇  Selected project bunny-farm-group/bunny-farm-web
│
◇  The @sentry/nextjs package is already installed. Do you want to update it to the latest version?
│  Yes
│
◇  Please select your package manager.
│  PNPM
│
◇  Updated @sentry/nextjs with PNPM.
│
◇  Do you want to route Sentry requests in the browser through your Next.js server to avoid ad blockers?
│  Yes
│
◇  Do you want to enable Tracing to track the performance of your application?
│  Yes
│
◇  Do you want to enable Session Replay to get a video-like reproduction of errors during a user session?
│  Yes
│
◇  Do you want to enable Logs to send your application logs to Sentry?
│  Yes
│
◇  Found existing Sentry server config (sentry.server.config.ts). Overwrite it?
│  Yes
│
▲  Removed existing sentry.server.config.ts.
│
◆  Created fresh sentry.server.config.ts.
│
◇  Found existing Sentry edge config (sentry.edge.config.ts). Overwrite it?
│  Yes
│
▲  Removed existing sentry.edge.config.ts.
│
◆  Created fresh sentry.edge.config.ts.
│
◇  Add the following code to your instrumentation.ts file:

import * as Sentry from '@sentry/nextjs';

export async function register() {
if (process.env.NEXT_RUNTIME === 'nodejs') {
await import('../sentry.server.config');
}

if (process.env.NEXT_RUNTIME === 'edge') {
await import('../sentry.edge.config');
}
}

export const onRequestError = Sentry.captureRequestError;


│
◇  Did you apply the snippet above?
│  Yes, continue!
│
◇  Add the following code to your instrumentation-client.ts file:

// This file configures the initialization of Sentry on the client.
// The added config here will be used whenever a users loads a page in their browser.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";

Sentry.init({
dsn: "https://e2875ba9d78f215a07b6f21c0dc62c00@o4509705454747648.ingest.us.sentry.io/4509705462939648",

// Add optional integrations for additional features
integrations: [
Sentry.replayIntegration(),
],

// Define how likely traces are sampled. Adjust this value in production, or use tracesSampler for greater control.
tracesSampleRate: 1,
// Enable logs to be sent to Sentry
enableLogs: true,

// Define how likely Replay events are sampled.
// This sets the sample rate to be 10%. You may want this to be 100% while
// in development and sample at a lower rate in production
replaysSessionSampleRate: 0.1,

// Define how likely Replay events are sampled when an error occurs.
replaysOnErrorSampleRate: 1.0,

// Setting this option to true will print useful information to the console while you're setting up Sentry.
debug: false,
});

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;

│
◇  Did you apply the snippet above?
│  Yes, continue!
│
◇  next.config.ts already contains Sentry SDK configuration. Should the wizard modify it anyways?
│  Yes
│
◆  Added Sentry configuration to next.config.ts. (you probably want to clean this up a bit!)
│
●  It seems like you already have a custom error page for your app directory.
│  
│  Please add the following code to your custom error page
│  at src/app/global-error.tsx:
│  
"use client";

import * as Sentry from "@sentry/nextjs";
import Error from "next/error";
import { useEffect } from "react";

export default function GlobalError({ error }: { error: Error }) {
useEffect(() => {
Sentry.captureException(error);
}, [error]);

return (
<html>
<body>
{/* Your Error component here... */}
</body>
</html>
);
}

│
◇  Did you add the code to your src/app/global-error.tsx file as described above?
│  Yes
│
◇  Do you want to create an example page ("/sentry-example-page") to test your Sentry setup?
│  Yes
│
◆  Created src/app/sentry-example-page/page.tsx.
│
◆  Created src/app/api/sentry-example-api/route.ts.
│
◆  Added auth token to .env.sentry-build-plugin
│
■  Failed adding .env.sentry-build-plugin to .gitignore. Please add it manually!
│
◇  Warning: The Sentry SDK is only compatible with Turbopack on Next.js version 15.3.0 (or 15.3.0-canary.8) or later. If you are using
Turbopack with an older Next.js version, temporarily remove `--turbo` or `--turbopack` from your dev command until you have verified the
SDK is working as expected. Note that the SDK will continue to work for non-Turbopack production builds.
│  I understand.
│
◇  Are you using a CI/CD tool to build and deploy your application?
│  No
│
●  No Problem! Just make sure that the Sentry auth token from .env.sentry-build-plugin is available whenever you build and deploy your app.
│
└  
Successfully installed the Sentry Next.js SDK!

You can validate your setup by (re)starting your dev environment (e.g. pnpm dev) and visiting "/sentry-example-page"
Don't forget to remove `--turbo` or `--turbopack` from your dev command until you have verified the SDK is working. You can safely add it back afterwards.

If you encounter any issues, let us know here: https://github.com/getsentry/sentry-javascript/issues
