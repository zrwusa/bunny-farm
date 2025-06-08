// import { NextRequest, NextResponse } from 'next/server'
// import { parse } from 'cookie'
//
// const GRAPHQL_URL = process.env.GRAPH_QL_API_URL || 'http://localhost:8080/graphql'
//
// export const runtime = 'nodejs'
//
// async function fetchGraphQL(query: string, token?: string) {
//     console.debug('[fetchGraphQL] token:', token)
//     return fetch(GRAPHQL_URL, {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json',
//             ...(token ? { Authorization: `Bearer ${token}` } : {}),
//         },
//         body: query,
//         credentials: 'include',
//     })
// }
//
// async function refreshTokenByCookie(cookies: string) {
//     console.debug('[refreshTokenByCookie] cookies:', cookies)
//
//     const refreshQuery = JSON.stringify({
//         query: `mutation { refreshTokenByCookie { accessToken refreshToken } }`,
//     })
//
//     return fetch(GRAPHQL_URL, {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json',
//             Cookie: cookies,
//         },
//         body: refreshQuery,
//         credentials: 'include',
//     })
// }
//
// async function tryRefreshAndRetry(originalBody: string, cookieHeader: string): Promise<NextResponse | null> {
//     const refreshRes = await refreshTokenByCookie(cookieHeader)
//     console.debug('[tryRefreshAndRetry] refresh status:', refreshRes.status)
//
//     if (!refreshRes.ok) return null
//
//     const json = await refreshRes.json()
//     console.debug('[tryRefreshAndRetry] refresh JSON:', json)
//
//     const accessToken = json.data?.refreshTokenByCookie?.accessToken
//     if (!accessToken) return null
//     console.debug('[tryRefreshAndRetry] accessToken:', accessToken)
//     const gqlRes = await fetchGraphQL(originalBody, accessToken)
//
//     const response = new NextResponse(await gqlRes.text(), {
//         status: gqlRes.status,
//         headers: { 'Content-Type': 'application/json' },
//     })
//
//     const setCookie = refreshRes.headers.get('set-cookie')
//     if (setCookie) {
//         response.headers.set('Set-Cookie', setCookie)
//     }
//
//     console.debug('[tryRefreshAndRetry] Retried with refreshed token')
//     return response
// }
//
// export async function POST(req: NextRequest) {
//     const body = await req.text()
//     console.debug('[POST] Received body:', body)
//
//     const cookieHeader = req.headers.get('cookie') || ''
//     console.debug('[POST] Cookie header:', cookieHeader)
//
//     const parsedCookies = parse(cookieHeader)
//     const accessToken = parsedCookies['access_token']
//     console.debug('[POST] Parsed access_token:', accessToken)
//
//     // First try with access token if it exists
//     const gqlRes = await fetchGraphQL(body, accessToken)
//     console.debug('[POST] Initial GraphQL status:', gqlRes.status)
//
//     let gqlJson: any = null
//     try {
//         gqlJson = await gqlRes.clone().json()
//         console.debug('[POST] GraphQL JSON:', gqlJson)
//     } catch (e) {
//         console.debug('[POST] Failed to parse GraphQL JSON:', e)
//     }
//
//     const isUnauth =
//         gqlRes.status === 401 ||
//         gqlRes.status === 403 ||
//         gqlJson?.errors?.some((e: any) => e.extensions?.code === 'UNAUTHENTICATED')
//
//     if ((!accessToken || isUnauth) && cookieHeader.includes('refresh_token=')) {
//         console.debug('[POST] Trying refreshTokenByCookie...')
//         const refreshResponse = await tryRefreshAndRetry(body, cookieHeader)
//         if (refreshResponse) return refreshResponse
//         console.debug('[POST] Refresh failed or no accessToken returned.')
//     }
//
//     // Final fallback: return original response
//     return new NextResponse(await gqlRes.text(), {
//         status: gqlRes.status,
//         headers: { 'Content-Type': 'application/json' },
//     })
// }
