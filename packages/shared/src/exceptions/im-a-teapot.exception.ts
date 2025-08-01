import { HttpStatus } from '../enums';
import { HttpException, HttpExceptionOptions } from './http.exception';

/**
 * Defines an HTTP exception for *ImATeapotException* type errors.
 *
 * Any attempt to brew coffee with a teapot should result in the error code
 * "418 I'm a teapot". The resulting entity body MAY be short and stout.
 *
 * @see [Built-in HTTP exceptions](https://docs.nestjs.com/exception-filters#built-in-http-exceptions)
 *
 * @publicApi
 */
export class ImATeapotException extends HttpException {
  /**
   * Instantiate an `ImATeapotException` Exception.
   *
   * @example
   * `throw new ImATeapotException()`
   *
   * @usageNotes
   * The HTTP response status code will be 418.
   * - The `objectOrError` argument defines the JSON response body or the message string.
   * - The `descriptionOrOptions` argument contains either a short description of the HTTP error or an options object used to provide an underlying error cause.
   *
   * By default, the JSON response body contains two properties:
   * - `statusCode`: this will be the value 418.
   * - `message`: the string `"I'm a Teapot"` by default; override this by supplying
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
    descriptionOrOptions: string | HttpExceptionOptions = `I'm a teapot`,
  ) {
    const { description, httpExceptionOptions } =
      HttpException.extractDescriptionAndOptionsFrom(descriptionOrOptions);

    super(
      HttpException.createBody(
        objectOrError,
        description!,
        HttpStatus.I_AM_A_TEAPOT,
      ),
      HttpStatus.I_AM_A_TEAPOT,
      httpExceptionOptions,
    );
  }
}
