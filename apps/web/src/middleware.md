# Typical uses
Auth Guard (most common): detect cookie/session, intercept unlogged users, and redirect to /login.

Internationalization (i18n) redirection: automatically assign paths such as /en /zh according to Accept-Language.

A/B test: diversion of different versions based on request header or cookies on the Edge side.

Rewrite: Rewrite the request to another path or external domain name at the edge layer.



## Next.js Middleware ≈ Nginx's reverse proxy + routing forwarding

| Nginx                  | Next.js Middleware               |
| ---------------------- | -------------------------------- |
| Configure at the edge (CDN, pre-agent) | Deploy in Vercel Edge or build self-built Edge Runtime |
| Intercept request headers, cookies | `request.headers` readable |
| Do URL rewrite `rewrite` | `NextResponse.rewrite` |
| Do URL redirect `return 301` | `NextResponse.redirect` |
| Do ACL (IP whitelist/blacklist) | You can use `request.ip` to do interception |
| Can forward to different backends | Can `rewrite` to other APIs or external URLs |

## Differences 

| 点     | Nginx                      | Next.js Middleware                        |
| ----- | -------------------------- | ----------------------------------------- |
| Configuration method | Configuration file (`nginx.conf`) | Using JavaScript/TypeScript |
| Executable logic | Only match + forwarding, complex logic needs to be written to Lua or external services | You can directly write JS logic (parse JWT, cookies, A/B shunts) |
| Deployment location | Build your own server | Follow Vercel Edge Network by default or build Edge Runtime by yourself |
| Range of action | Any path, containing static files | Only act on matching routes (pages and APIs), and do not handle static resources such as `/public/` |



# Middleware execution timing

| Scenario | Will Middleware execute?             |
| --------------------------------------------- | ---------------------------- |
| Visit the page matched to `app/` or `pages/` | ✅ Will |
| Access interfaces matching `app/api/` or `pages/api/` | ✅ Will |
| Access static files matching `/public` (such as `/public/image.png`) | ❌ No |
| Visit `_next/static/` (build product) | ❌ No |
| Visit `/favicon.ico` (root directory special file) | ❌ No |
| Access external domain names (such as `fetch` third party on your client) | ❌ No |
| SSR / SSG / ISR page request | ✅ Yes, you will go through Middleware first and then to the actual processing logic |
| Routing rewrite, redirect, response interception | ✅ Only do it in Middleware |

