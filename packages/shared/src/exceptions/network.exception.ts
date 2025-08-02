/**
 * Represents a client-side network error, such as a failed fetch request
 * due to timeout, DNS failure, or server unreachable.
 *
 * This is not a server-thrown HTTP exception, and should not be treated as one.
 * It's intended to represent networking issues during API communication.
 *
 * @example
 * throw new NetworkError('Unable to reach server');
 */
export class NetworkError extends Error {
  readonly name = 'NetworkError';
  readonly cause?: unknown;

  constructor(message: string = 'Network error occurred', cause?: unknown) {
    super(message);
    this.cause = cause;

    // Maintains proper stack trace for where this error was thrown (only works in V8 engines like Chrome & Node.js)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, NetworkError);
    }
  }
}
