# What @sentry/nextjs Automatically Reports

| Error Source Type                                           | Auto Report? | Notes                                                            |
| ----------------------------------------------------------- | ------------ | ---------------------------------------------------------------- |
| `ErrorBoundary`-caught frontend rendering errors            | ✅            | Automatically reported if using `Sentry.ErrorBoundary`           |
| Exceptions in API routes (`pages/api/*`, `app/api/*`)       | ✅            | Automatically intercepted and reported                           |
| Exceptions in SSR (`getServerSideProps`, `getInitialProps`) | ✅            | Automatically reported                                           |
| Uncaught errors in Middleware                               | ✅            | Reported automatically unless you manually try-catch             |
| Unhandled sync/async exceptions in backend logic            | ✅            | Automatically reported (e.g., thrown errors, unhandled Promises) |
| Uncaught frontend runtime errors (e.g., JS exceptions)      | ✅            | Reported globally (configure React error boundary properly)      |
| Unhandled Promise rejections in frontend                    | ✅            | Automatically reported via global `unhandledrejection` handler   |

# What @sentry/nextjs Does Not Report Automatically

| Error Type                                             | Auto Report? | Reason                                                               |
| ------------------------------------------------------ | ------------ | -------------------------------------------------------------------- |
| Errors caught manually via `try { ... } catch (err)`   | ❌            | Considered "handled" unless you manually `Sentry.captureException()` |
| `fetch()` fails but you don't throw                    | ❌            | `fetch()` doesn't throw by default — needs `throw new Error(...)`    |
| Errors thrown and caught immediately in business logic | ❌            | Handled internally, Sentry won’t treat as unhandled                  |
| Backend returns error, frontend uses `.catch()`        | ❌            | The error chain is caught; Sentry can’t detect                       |
| Only `console.error()` is called after catching error  | ❌            | `console.*` is not hooked by Sentry                                  |

