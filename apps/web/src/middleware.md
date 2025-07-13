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

## The same points
| Features | Nginx | Next.js Middleware |
| ------ | ------------------------------ | ------------------------------- |
| Routing distribution | `location` configuration can match URLs and distribute them to different backends | `matcher` can match URL Pattern trigger execution |
| Permission interception | You can use `if` + `rewrite` for simple authentication | You can read cookies and headers for identity judgment |
| URL rewrite | `rewrite` command change URL | `NextResponse.rewrite()` change URL |
| Redirect | `return 301` or `rewrite` | `NextResponse.redirect()` |
| Running location | Server layer (usually in the server or load balancer) | Edge CDN node, closer to the user |
| Performance targets | Efficient processing of network traffic | Millisecond delay without recalculation |

## The difference

| Differences | Nginx | Middleware |
| -------- | --------------------------- | ---------------------------------- |
| Programming capabilities | Configuration files + Lua (OpenResty) | Modern JS/TS, complete programming capabilities |
| Status | Statusless | Statusless |
| Executable logic complexity | Natively only supports conditions, variables, and rewrite, and complex needs Lua | You can directly use JS, write conditions, call third-party services, and do experimental diversion |
| Running Environment | On your server (such as Ubuntu + Nginx) | On Edge node (Vercel / Cloudflare POP) |
| Cold start | No (configuration is configuration) | In theory, neither (Edge Function cold start is extremely fast) |
| Purpose | General Web Service Portal | Request Interceptor customized for Next.js services |



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

