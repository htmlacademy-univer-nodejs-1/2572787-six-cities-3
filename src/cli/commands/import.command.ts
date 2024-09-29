import { Command } from './command.interface.js';
import { OfferTsvFileReader } from '../../shared/libs/offer-tsv-file-reader.js';
import { OfferTsvParser } from '../../shared/libs/offer-tsv-parser.js';
import { getErrorMessage } from '../../shared/helpers/common.js';

export class ImportCommand implements Command {
  private readonly parser: OfferTsvParser = new OfferTsvParser();

  constructor() {
    this.onImportedLine = this.onImportedLine.bind(this);
    this.onCompleteImport = this.onCompleteImport.bind(this);
  }

  public getName(): string {
    return '--import';
  }

  public async execute(...args: string[]): Promise<void> {
    const [fileName] = args;
    const reader = new OfferTsvFileReader(fileName.trim());

    reader.on('readline', this.onImportedLine);
    reader.on('end', this.onCompleteImport);

    try {
      await reader.read();
    } catch (error: unknown) {
      console.error(`Can't import data from file: ${fileName}`);
      console.error(`Details: ${getErrorMessage(error)}`);
    }
  }

  private onImportedLine(importedLine: string): void {
    const offer = this.parser.parse(importedLine);
    console.info(offer);
  }

  private onCompleteImport(importedRowCount: number) {
    console.log(`Imported ${importedRowCount} rows`);
  }
}
