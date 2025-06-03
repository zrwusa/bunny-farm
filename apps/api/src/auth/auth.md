| Question | Results  |
| ----------------------------- | ------------------------------- |
| Set `secure: true` | Local non-HTTPS browser refuses to set cookies |
| The front-end does not add `credentials: 'include'` | Cookies will not be sent automatically, and the browser will not be stored Set-Cookies|
| Missing in CORS `credentials: true` | Browser intercept response cookies |
| `origin` is used in CORS `*` | cannot be allowed credentials\:true |
