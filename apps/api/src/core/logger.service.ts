import { Injectable, LoggerService as NestLoggerService } from '@nestjs/common';
import { createLogger, format, transports } from 'winston';
import chalk from 'chalk';

@Injectable()
export class LoggerService implements NestLoggerService {
  private readonly logger;

  constructor() {
    this.logger = createLogger({
      level: 'debug', // Can be configured with env
      format: format.combine(
        format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        format.printf(({ level, message, timestamp }) => {
          return `[${timestamp}] [${level.toUpperCase()}] ${message}`;
        }),
      ),
      transports: [
        new transports.Console({
          format: format.printf(({ level, message, timestamp }) => {
            const levelColor =
              {
                error: chalk.red,
                warn: chalk.yellow,
                info: chalk.green,
                debug: chalk.blue,
                verbose: chalk.cyan,
              }[level] || chalk.white;

            return (
              chalk.gray(`[${timestamp}]`) +
              ' ' +
              levelColor(`[${level.toUpperCase()}]`) +
              ' ' +
              message
            );
          }),
        }),
        new transports.File({ filename: 'logs/error.log', level: 'error' }),
        new transports.File({ filename: 'logs/combined.log' }),
      ],
    });
  }

  log(message: string) {
    this.logger.info(message);
  }

  error(message: string, trace?: string) {
    this.logger.error(`${message} ${trace || ''}`);
  }

  warn(message: string) {
    this.logger.warn(message);
  }

  debug(message: string) {
    this.logger.debug(message);
  }

  verbose(message: string) {
    this.logger.verbose(message);
  }
}
