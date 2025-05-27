Guard/Interceptor primarily handles cross-cutting concerns such as authentication failures (401), rate limiting (429), and payload size limits (413).

Controller/Resolver deals with routing-level errors: method not allowed (405), content negotiation failures (406), redirects (3xx), and upstream gateway/service unavailable errors (5xx).

Service is dedicated to business logic: resource not found (404), forbidden actions (403), resource conflicts (409), complex business validation failures (422), etc.

Validation (Pipe/DTO) is responsible for request parameter and schema validation, throwing 400 or 422 when parameters or formats are invalid.


| Exception Type                       | HTTP Status Code | Semantics                                                           | Guard/Interceptor | Controller/Resolver | Service | Validation |
| ------------------------------------ | ---------------- | ------------------------------------------------------------------- | ----------------- | ------------------- | ------- | ---------- |
| **BadRequestException**              | 400              | Client parameters are incorrect or request format is invalid        | ✖                 | ✔                   | ✔       | ✔          |
| **UnauthorizedException**            | 401              | Authentication failed (not logged in or invalid token)              | ✔                 | ✔                   | ✖       | ✖          |
| **ForbiddenException**               | 403              | Logged in but lack business permission to perform this operation    | ✔                 | ✖                   | ✔       | ✖          |
| **NotFoundException**                | 404              | The requested resource does not exist                               | ✖                 | ✖                   | ✔       | ✖          |
| **MethodNotAllowedException**        | 405              | HTTP method not allowed                                             | ✖                 | ✔                   | ✖       | ✖          |
| **NotAcceptableException**           | 406              | No acceptable representation available                              | ✖                 | ✔                   | ✖       | ✖          |
| **ConflictException**                | 409              | Resource conflict (e.g., unique key violation, duplicate operation) | ✖                 | ✖                   | ✔       | ✖          |
| **GoneException**                    | 410              | Resource has been permanently removed                               | ✖                 | ✔                   | ✖       | ✖          |
| **PreconditionFailedException**      | 412              | One or more request preconditions failed                            | ✖                 | ✔                   | ✖       | ✖          |
| **PayloadTooLargeException**         | 413              | Request payload is too large                                        | ✔                 | ✖                   | ✖       | ✖          |
| **UnprocessableEntityException**     | 422              | Semantically correct but business cannot process the request        | ✖                 | ✖                   | ✔       | ✔          |
| **TooManyRequestsException**         | 429              | Rate limit exceeded                                                 | ✔                 | ✔                   | ✖       | ✖          |
| **UpgradeRequiredException**         | 426              | Client should switch to a different protocol                        | ✖                 | ✔                   | ✖       | ✖          |
| **InternalServerErrorException**     | 500              | Uncaught system exception                                           | ✖                 | ✖                   | ✖       | ✖          |
| **NotImplementedException**          | 501              | Functionality not implemented                                       | ✖                 | ✔                   | ✖       | ✖          |
| **BadGatewayException**              | 502              | Invalid response received from upstream server                      | ✖                 | ✔                   | ✖       | ✖          |
| **ServiceUnavailableException**      | 503              | Service is temporarily unavailable                                  | ✖                 | ✔                   | ✖       | ✖          |
| **GatewayTimeoutException**          | 504              | Upstream server request timed out                                   | ✖                 | ✔                   | ✖       | ✖          |
| **HttpVersionNotSupportedException** | 505              | HTTP version not supported                                          | ✖                 | ✔                   | ✖       | ✖          |
| **MovedPermanentlyException**        | 301              | Resource has been permanently moved                                 | ✖                 | ✔                   | ✖       | ✖          |
| **FoundException**                   | 302              | Resource has been temporarily moved                                 | ✖                 | ✔                   | ✖       | ✖          |
| **TemporaryRedirectException**       | 307              | Temporary redirect                                                  | ✖                 | ✔                   | ✖       | ✖          |
| **PermanentRedirectException**       | 308              | Permanent redirect                                                  | ✖                 | ✔                   | ✖       | ✖          |




In practice: We suggest-

Leave 401 to Guard to make the judgment of "is it logged in or not / Token legal";

Leave 403 to Service to do "Does my logged-in user have business permissions to do this operation?"

Leave typical resource/parameter verification such as 404 and 400 in the Service and throw it out.

In this way, your Service only focuses on "permissions, data verification, existence checking in business processes"; Guard only cares about "certification" - the responsibilities are clearer and easier to unit test and reuse.