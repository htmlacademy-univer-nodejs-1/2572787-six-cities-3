import got from 'got';
import { Command } from './command.interface.js';
import { MockServerData } from '../../shared/models/mock-server-data.model.js';
import { error } from 'node:console';

export class GenerateCommand implements Command {
  private mockServerData: MockServerData;

  public getName(): string {
    return '--generate';
  }

  public async execute(...args: string[]): Promise<void> {
    const [count, path, url] = args;
    const offerCount = Number.parseInt(count);

    try {
      await this.load(url);
    } catch (error: unknown) {
      console.error('Can\'t generate data');

      if (error instanceof Error) {
        console.error(`Details: ${error.message}`)
      }
    }
  }

  private async load(url: string): Promise<void> {
    try {
      this.mockServerData = await got.get(url).json();
    } catch (error: unknown) {
      if (!(error instanceof Error)) {
        throw new Error(`Can't load data from ${url}`);
      }

      throw new Error(`Can't load data from ${url}: ${error.message}`);
    }
  }
}
