import { Command } from './command.interface.js';

export class GenerateCommand implements Command {
  public getName(): string {
    return '--generate';
  }

  public execute(...args: string[]): void {
    const [count, path, url] = args;
    const offerCount = Number.parseInt(count);
  }
}
