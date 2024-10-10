import { Logger as PinoInstance, pino } from 'pino';
import { Logger } from './logger.interface.js';

export class PinoLogger implements Logger {
  private readonly logger: PinoInstance;

  constructor() {
    this.logger = pino();
  }

  info(message: string, ...details: unknown[]): void {
    this.logger.info(message, ...details);
  }

  warn(message: string, ...details: unknown[]): void {
    this.logger.warn(message, ...details);
  }

  error(message: string, error: Error, ...details: unknown[]): void {
    this.logger.error(error, message, ...details);
  }

  debug(message: string, ...details: unknown[]): void {
    this.logger.debug(message, ...details);
  }
}
