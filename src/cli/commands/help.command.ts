import { Command } from './command.interface.js';
import chalk from 'chalk';

export class HelpCommand implements Command {
  public getName(): string {
    return '--help';
  }

  public async execute(..._args: string[]): Promise<void> {
    console.info(chalk.white(`
Программа для подготовки данных для REST API сервера.`))
    console.info(chalk.black(`Пример:`));
    console.info(chalk.white(`  cli.js --<command> [--arguments]`));
    console.info(chalk.black(`Команды:`));
    console.info(chalk.white(`  --version                   # выводит номер версии
  --help                      # печатает этот текст
  --import <path>             # импортирует данные из TSV
  --generate <n> <path> <url> # генериурет произвольное количетсво тестовых данных
    `));
  }
}
