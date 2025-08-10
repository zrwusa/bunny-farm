

| Mode | Where is the token | How to judge by AuthProvider  |
| --------------------- | ------------- | ------------------------------ |
| **Cookie (HttpOnly)** | The browser is not readable, only the backend can be read | Click `/api/me` to see if it is valid, and it is impossible to directly judge token |
| **Storage** | Browser readable | Direct reading `localStorage` determines whether it is about to expire |

## Key Differences in Middleware, AuthProvider and <Private>

| ⚙️                        | `middleware`                                                                     | `AuthProvider`                                                                        | `<Private>`                                     |
| ------------------------- | -------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- | ----------------------------------------------- |
| **Running time** | Server side (Edge / Vercel Edge) | Browser side (CSR stage) | Browser side (CSR stage) |
| **Run target** | Request per hit | Every page load/routing | When per page rendering |
| **Input by** | Cookie: `ACCESS_TOKEN`, `REFRESH_TOKEN` | `user` returned by `/api/me`, or SSR embed | `user` provided by `AuthProvider` |
| **Main Responsibilities** | **Blocking the way before requesting**<br>✔️ Valid token release<br>✔️ No token try refresh<br>❌ Redirect if refresh fails `/auth/login` | **Provide user context**<br>✔️ Initialize refresh (if required)<br>✔️ Click `/api/me` to get `user`<br>✔️ Mount `user` to React tree | **Page-level guard**<br>✔️ If `!user` ➜ Front-end jump `/auth/login` |
| **How to determine login** | Whether there is `ACCESS_TOKEN` (only see cookies) | `/api/me` returns `user` | `user` provided by `AuthProvider` |
| **Will it refresh token** | ✔️ Yes (when there is no `ACCESS_TOKEN`, call `/api/auth/refresh`) | ✔️ Yes (if SSR embed does not exist or fails, call `refreshTokens`) | ❌ No (just rely on `user` of `AuthProvider`) |
| **Can you see HttpOnly Cookie** | ✔️ Yes | ❌ No (only using the backend interface) | ❌ No (all relying on `AuthProvider`) |
| **Execution Location** | Edge runtime / Node | Browser | Browser |
| **Optional whether to enable** | Must be enabled (protecting private routing) | Must be enabled (for `Private`) | Optional (only packages that require login to visible pages) |


|        | `PROTECTED_PATHS`                     | `matcher`                           |
| ------ | ------------------------------------- | ----------------------------------- |
| Purpose | Decide whether to authenticate in the middleware runtime | Decide whether to let requests go during the compilation period of Next.js |
| Expression ability | You can write more complex judgments, such as: startsWith, RegExp, role permissions, etc. | It must be a simple path pattern, and the syntax is specified by Next.js |
| When will it take effect | Every request will run when it arrives | Next.js routing layer decides whether to throw traffic to middleware |
| Influence performance | Less | More, run away after leaving |
| Can do dynamic | Yes | No, it must be static |
