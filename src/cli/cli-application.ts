import { CommandParser } from './command-parser.js';
import { Command } from './commands/command.interface.js';

type CommandCollection = Record<string, Command>;

export class CliApplication {
  private commands: CommandCollection = {};

  constructor(
    private readonly defaultCommand: string = '--help',
    private readonly parser: CommandParser = new CommandParser()
  ) {

  }

  public registerCommands(commandList: Command[]): void {
    commandList.forEach((command) => {
      if (Object.hasOwn(this.commands, command.getName())) {
        throw new Error(`Command ${command.getName()} is already registered`);
      }

      this.commands[command.getName()] = command;
    });
  }

  public processCommand(args: string[]): void {
    const parsedCommand = this.parser.parse(args);
    const [commandName] = Object.keys(parsedCommand);
    const command = this.getCommand(commandName);
    const commandArgs = parsedCommand[commandName] ?? [];
    command.execute(...commandArgs);
  }

  private getCommand(commandName: string): Command {
    return this.commands[commandName] ?? this.getDefaultCommand();
  }

  private getDefaultCommand(): Command {
    return this.commands[this.defaultCommand];
  }
}
