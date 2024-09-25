import { Command } from './command.interface.js';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import chalk from 'chalk';

type PackageJsonConfig = {
  version: string
}

function isPackageJsonConfig(value: unknown): value is PackageJsonConfig {
  return (
    typeof value === 'object'
    && value !== null
    && !Array.isArray(value)
    && Object.hasOwn(value, 'version')
  );
}

export class VersionCommand implements Command {
  constructor(
    private readonly filePath: string = './package.json'
  ) {

  }

  public getName(): string {
    return '--version';
  }

  public async execute(..._args: string[]): Promise<void> {
    try {
      const version = this.readVersion();
      console.info(chalk.bgBlue(`${version}`));
    } catch (error: unknown) {
      console.error(`Failed to read version from ${this.filePath}`);

      if (error instanceof Error) {
        console.error(`Details: ${error.message}`);
      }
    }
  }

  private readVersion() {
    const fileContent = readFileSync(resolve(this.filePath), 'utf-8');
    const parsedJson: unknown = JSON.parse(fileContent);

    if (!isPackageJsonConfig(parsedJson)) {
      throw new Error('Failed to parse json content.');
    }

    return parsedJson.version;
  }
}
