#!/usr/bin/env node
import { CliApplication, HelpCommand, VersionCommand, ImportCommand } from './cli/index.js';

function bootstrap() {
  const cliApplication = new CliApplication();
  cliApplication.registerCommands([
    new HelpCommand(),
    new VersionCommand(),
    new ImportCommand()
  ]);

  cliApplication.processCommand(process.argv);
}

bootstrap();
