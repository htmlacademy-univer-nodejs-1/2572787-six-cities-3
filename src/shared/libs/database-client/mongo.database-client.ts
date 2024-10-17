import * as Mongoose from 'mongoose';
import { inject, injectable } from 'inversify';
import { DatabaseClient } from "./database-client.interface.js";
import { Component } from '../../models/index.js';
import { Logger } from '../logger/logger.interface.js';
import { setTimeout } from 'node:timers/promises';

const RETRY_COUNT = 5;
const RETRY_TIMEOUT = 1000;

@injectable()
export class MongoDatabaseClient implements DatabaseClient {
  private mongoose: typeof Mongoose;
  private isConnected: boolean;

  constructor(
    @inject(Component.Looger) private readonly logger: Logger
  ) {
    this.isConnected = false;
  }

  public isConnectToDatabase(): boolean {
    return this.isConnected;
  }

  public async connect(uri: string): Promise<void> {
    this.logger.info('Trying to connect to MongoDB');

    let attempt = 0;
    while (attempt < RETRY_COUNT) {
      try {
        this.mongoose = await Mongoose.connect(uri);
        this.isConnected = true;
        this.logger.info('Database connection established');
        return;
      } catch (error: unknown) {
        attempt++;
        this.logger.error(`Failed to connect to the database. Attempt ${attempt}`, error as Error);
        await setTimeout(RETRY_TIMEOUT);
      }
    }

    throw new Error(`Unable to establish database connection after ${RETRY_COUNT} attempts`);
  }

  public async disconnect(): Promise<void> {
    if (!this.isConnectToDatabase()) {
      throw new Error('Not connected to database');
    }

    await this.mongoose.disconnect?.();
    this.isConnected = false;
    this.logger.info('Database connection closed');
  }
}
