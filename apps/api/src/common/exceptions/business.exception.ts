export abstract class BusinessException extends Error {
  abstract code: string; // Semantic error codes, such as USER_NOT_FOUND
  readonly statusCode: number;

  protected constructor(message: string, statusCode = 400) {
    super(message);
    this.name = new.target.name;
    this.statusCode = statusCode;
  }
}

export class UserNotFoundException extends BusinessException {
  code = 'USER_NOT_FOUND';

  constructor(userId: string) {
    super(`User with ID ${userId} not found`, 404);
  }
}

export class InsufficientBalanceException extends BusinessException {
  code = 'INSUFFICIENT_BALANCE';
  constructor(current: number, required: number) {
    super(`Balance ${current} is insufficient, need ${required}`, 400);
  }
}
