import { HttpStatus } from '../enums';
import { HttpException, HttpExceptionOptions } from './http.exception';

/**
 * Defines an HTTP exception for *Payload Too Large* type errors.
 *
 * @see [Built-in HTTP exceptions](https://docs.nestjs.com/exception-filters#built-in-http-exceptions)
 *
 * @publicApi
 */
export class PayloadTooLargeException extends HttpException {
  /**
   * Instantiate a `PayloadTooLargeException` Exception.
   *
   * @example
   * `throw new PayloadTooLargeException()`
   *
   * @usageNotes
   * The HTTP response status code will be 413.
   * - The `objectOrError` argument defines the JSON response body or the message string.
   * - The `descriptionOrOptions` argument contains either a short description of the HTTP error or an options object used to provide an underlying error cause.
   *
   * By default, the JSON response body contains two properties:
   * - `statusCode`: this will be the value 413.
   * - `message`: the string `'Payload Too Large'` by default; override this by supplying
   * a string in the `objectOrError` parameter.
   *
   * If the parameter `objectOrError` is a string, the response body will contain an
   * additional property, `error`, with a short description of the HTTP error. To override the
   * entire JSON response body, pass an object instead. Nest will serialize the object
   * and return it as the JSON response body.
   *
   * @param objectOrError string or object describing the error condition.
   * @param descriptionOrOptions either a short description of the HTTP error or an options object used to provide an underlying error cause
   */
  constructor(
    objectOrError?: any,
    descriptionOrOptions: string | HttpExceptionOptions = 'Payload Too Large',
  ) {
    const { description, httpExceptionOptions } =
      HttpException.extractDescriptionAndOptionsFrom(descriptionOrOptions);

    super(
      HttpException.createBody(
        objectOrError,
        description!,
        HttpStatus.PAYLOAD_TOO_LARGE,
      ),
      HttpStatus.PAYLOAD_TOO_LARGE,
      httpExceptionOptions,
    );
  }
}
