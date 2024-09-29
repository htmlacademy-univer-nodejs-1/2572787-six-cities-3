import { Command } from './command.interface.js';
import { OfferTsvFileReader } from '../../shared/libs/offer-tsv-file-reader.js';

export class ImportCommand implements Command {
  public getName(): string {
    return '--import';
  }

  public async execute(...args: string[]): Promise<void> {
    const [fileName] = args;
    const fileReader = new OfferTsvFileReader(fileName.trim());

    try {
      fileReader.read();
      console.log(fileReader.toArray());
    } catch (error: unknown) {
      console.error(`Can't import data from file: ${fileName}`);

      if (error instanceof Error) {
        console.error(`Details: ${error.message}`);
      }
    }
  }
}
