import { Command } from './command.interface.js';
import chalk from 'chalk';

export class HelpCommand implements Command {
  public getName(): string {
    return '--help';
  }

  public async execute(..._args: string[]): Promise<void> {
    console.info(chalk.white(`
Программа для подготовки данных для REST API сервера.`));
    console.info(chalk.black('Пример:'));
    console.info(chalk.white('\tcli.js --<command> [--arguments]'));
    console.info(chalk.black('Команды:'));
    console.info(chalk.white(`\t--version                   # выводит номер версии
\t--help                          # печатает этот текст
\t--import <path> <db_uri> <salt> # импортирует данные из TSV
\t--generate <n> <path> <url>     # генерирует произвольное количетсво тестовых данных

<db_uri> is string in format: mongodb://[USER]:[PASSWORD]@[HOST]:[PORT]/[DB_NAME]?authSource=admin
    `));
  }
}
