import { Logger as PinoInstance, pino } from 'pino';
import { Logger } from './logger.interface.js';
import { getCurrentDirectoryPath } from '../../helpers/file-system.js';
import { resolve } from 'node:path';
import { injectable } from 'inversify';

@injectable()
export class PinoLogger implements Logger {
  private readonly logger: PinoInstance;

  constructor() {
    const modulePath = getCurrentDirectoryPath();
    const logFilePath = 'logs/rest.log';
    const destination = resolve(modulePath, '../../../', logFilePath);

    const multiTransport = pino.transport({
      targets: [
        {
          target: 'pino/file',
          options: { destination },
          level: 'debug'
        },
        {
          target: 'pino/file',
          options: {},
          level: 'info'
        }
      ]
    });

    this.logger = pino({}, multiTransport);
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
