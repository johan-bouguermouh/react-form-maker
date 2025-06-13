import {
  Command,
  CommandManagerInterface,
  CommandResult,
  NamedCommand,
} from './commandManager.interface';

export class CommandManager<
  TContext extends Record<string, unknown> = Record<string, unknown>,
> implements CommandManagerInterface<TContext>
{
  private commands: NamedCommand<TContext>[] = [];
  private context: TContext;

  constructor(initialContext: Partial<TContext> = {}) {
    this.context = initialContext as TContext;
  }

  addCommand(name: string, command: Command<TContext>): void {
    if (this.commands.some((c) => c.name === name)) {
      throw new Error(`Une commande avec le nom "${name}" existe déjà.`);
    }
    this.commands.push({ name, command });
  }

  addCommands(namedCommands: NamedCommand<TContext>[]): void {
    namedCommands.forEach(({ name, command }) =>
      this.addCommand(name, command),
    );
  }

  setContext(partialContext: Partial<TContext>): void {
    Object.assign(this.context, partialContext);
  }

  async execute(): Promise<boolean> {
    for (const { name, command } of this.commands) {
      const result = await command(this.context);

      if (!result.success) {
        console.error(`Command "${name}" failed:`, result);
        return false;
      }

      if (result.data) {
        Object.assign(this.context, result.data);
      }
    }
    return true;
  }

  reset(): void {
    this.commands = [];
    this.context = {} as TContext;
  }

  getContext(): Readonly<TContext> {
    return { ...this.context };
  }

  getCommands(): Readonly<NamedCommand<TContext>[]> {
    return [...this.commands];
  }

  async executeOnly(name: string): Promise<CommandResult | null> {
    const command = this.commands.find((c) => c.name === name);
    if (!command) {
      console.warn(`Aucune commande trouvée avec le nom "${name}".`);
      return null;
    }
    const result = await command.command(this.context);
    if (result.data) {
      Object.assign(this.context, result.data);
    }
    return result;
  }

  async executeAfter(name: string): Promise<boolean> {
    const index = this.commands.findIndex((c) => c.name === name);
    if (index === -1) {
      console.warn(`Aucune commande trouvée avec le nom "${name}".`);
      return false;
    }
    const commandsToExecute = this.commands.slice(index + 1);
    return this.executeSubset(commandsToExecute);
  }

  async executeSubset(commands: NamedCommand<TContext>[]): Promise<boolean> {
    for (const { name, command } of commands) {
      const result = await command(this.context);

      if (!result.success) {
        console.error(`Command "${name}" failed:`, result);
        return false;
      }

      if (result.data) {
        Object.assign(this.context, result.data);
      }
    }
    return true;
  }
}
