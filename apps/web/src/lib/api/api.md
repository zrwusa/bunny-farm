
# GraphQL Error Handling Rules

| **Category**           | **Code(s)**                                   | **Handler**                                        | **Thrown Error**     | **Handled By**                        | **Description**                                                                     |
| ---------------------- | --------------------------------------------- | -------------------------------------------------- | -------------------- | ------------------------------------- | ----------------------------------------------------------------------------------- |
| ✅ Validation Errors    | `BAD_USER_INPUT`, `VALIDATION_FAILED`         | `handleGraphQLErrors`                              | *None*               | UI layer (e.g. form validation)       | These are considered user input errors and are handled gracefully in the UI.        |
| ❌ Auth Errors          | `UNAUTHENTICATED`, `FORBIDDEN`                | `handleGraphQLAuthErrors`<br>`handleGraphQLErrors` | `AuthError`          | Token refresh logic or login redirect | Triggers token refresh or UI login flow. Both layers ensure auth errors are caught. |
| ❌ Network Errors       | HTTP non-200                                  | `fetchGraphQLInternal`                             | `NetworkError`       | Error boundary / global handler       | Low-level transport failure (e.g. 502, 503). Bubbles up for global error handling.  |
| ❌ Other GraphQL Errors | Any other `extensions.code` or missing `code` | `handleGraphQLErrors`                              | `Error` (aggregated) | Error boundary / global handler       | These are unclassified server-side errors (e.g. DB issues, logic bugs).             |
