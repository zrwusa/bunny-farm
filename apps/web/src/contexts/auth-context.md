| Functions | middleware is responsible? | AuthProvider is responsible? |
| -------------------------------- | -------------- | ---------------- |
| Check for access token | ✅ | ❌ |
| Refresh token if not | ✅ | ❌ |
| If the refresh fails, jump to the login page | ✅ | ❌ |
| token is valid, the page continues to load | ✅ | ✅ |
| Get current user information (getMe) | ❌ | ✅ |
| Automatically refresh tokens (cookie or storage) regularly | ❌ | ✅ |
| Manage localStorage token in storage mode | ❌ | ✅ |
| Refresh token when the client jumps | ❌ | ✅ |
| token refreshes when it is about to expire (silent refresh) | ❌ | ✅ |


# How to write cookies

| Method | Can Token be refreshed | Reason                                      |
| ---------------------------------------- | ----------- | ------------------------------------------ |
| **Server Component / SSR** | ❌ | The Set-Cookie obtained by `fetch()` is only valid inside the server and will not be passed to the browser |
| **Server Actions** | ❌ | The return value is component data, not the original HTTP response, and cannot be written in cookies |
| **`middleware.ts`** | ✅ | Manually forward `Set-Cookie` to the response header, and the browser can receive it |
| **Static Export** | ❌ | Dynamic logic or writing is not supported at all |
| **Client fetch + `credentials: 'include'`** | ✅ | Browser can automatically come with/receive cookies, suitable for silent refresh |

