import got from 'got';
import { Command } from './command.interface.js';
import { MockServerData } from '../../shared/models/index.js';
import { OfferTsvGenerator, TsvFileWriter } from '../../shared/libs/offer-generator/index.js';
import { getErrorMessage } from '../../shared/helpers/index.js';

export class GenerateCommand implements Command {
  private mockServerData: MockServerData;

  public getName(): string {
    return '--generate';
  }

  public async execute(...args: string[]): Promise<void> {
    const [count, path, url] = args;
    const offerCount = Number.parseInt(count, 10);

    try {
      await this.load(url);
      await this.write(path, offerCount);
      console.info(`File ${path} was created.`);
    } catch (error: unknown) {
      console.error('Can\'t generate data');
      console.error(`Details: ${getErrorMessage(error)}`);
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

  private async write(path: string, offerCount: number): Promise<void> {
    const generator = new OfferTsvGenerator(this.mockServerData);
    const writer = new TsvFileWriter(path);

    for (let i = 0; i < offerCount; i++) {
      const row = generator.generate();
      await writer.write(row);
    }
  }
}
