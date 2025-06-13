/**
 * **Gestionnaire de commandes**
 *
 * ---
 *
 * Un gestionnaire de commandes permet d'exécuter une série de commandes de manière progressive. Les commandes sont exécutées dans
 * l'ordre où elles ont été ajoutées, et peuvent partager des données via un contexte global.
 *
 * ---
 *
 * #### Exemple d'utilisation
 * ```ts
 * const manager = new CommandManager();
 *
 * manager.addCommand('greet', async (context) => {
 *   console.log('Hello', context.user.name);
 *   return { success: true };
 * });
 *
 * manager.addCommand('farewell', async (context) => {
 *   console.log('Goodbye', context.user.name);
 *   return { success: true };
 * });
 *
 * manager.setContext({ user: { name: 'John Doe' } });
 *
 * const result = await manager.execute();
 * console.log('All commands executed successfully:', result);
 * ```
 */

export type CommandResult<T = unknown> = {
  success: boolean;
  data?: T;
};

export type Command<TContext = Record<string, unknown>> = (
  context: TContext,
) => Promise<CommandResult>;

export interface NamedCommand<TContext = Record<string, unknown>> {
  name: string;
  command: Command<TContext>;
}

export interface CommandManagerInterface<
  TContext extends Record<string, unknown> = Record<string, unknown>,
> {
  /**
   * **Ajouter une commande**
   *
   * Ajoute une commande à la liste des commandes à exécuter. Une commande doit être identifiée par un nom unique.
   *
   * #### Exemple
   * ```ts
   * manager.addCommand('init', async (context) => {
   *   console.log('Initialisation du contexte');
   *   return { success: true };
   * });
   * ```
   *
   * @param name - Le nom unique de la commande.
   * @param command - La fonction asynchrone représentant la commande.
   */
  addCommand(name: string, command: Command<TContext>): void;

  /**
   * **Ajouter plusieurs commandes**
   *
   * Ajoute une liste de commandes nommées.
   *
   * #### Exemple
   * ```ts
   * manager.addCommands([
   *   { name: 'step1', command: async (context) => ({ success: true }) },
   *   { name: 'step2', command: async (context) => ({ success: true }) },
   * ]);
   * ```
   *
   * @param commands - La liste des commandes à ajouter.
   */
  addCommands(commands: NamedCommand<TContext>[]): void;

  /**
   * **Définir ou mettre à jour le contexte**
   *
   * Ajoute ou met à jour les données du contexte global partagé entre les commandes.
   *
   * #### Exemple
   * ```ts
   * manager.setContext({ user: { id: 123, name: 'Jane' } });
   * ```
   *
   * @param partialContext - Un objet contenant les données à fusionner avec le contexte actuel.
   */
  setContext(partialContext: Partial<TContext>): void;

  /**
   * **Exécuter toutes les commandes**
   *
   * Exécute les commandes dans l'ordre où elles ont été ajoutées. Si une commande échoue, l'exécution s'arrête.
   *
   * #### Exemple
   * ```ts
   * const result = await manager.execute();
   * console.log(result ? 'Success' : 'Failure');
   * ```
   *
   * @returns `true` si toutes les commandes ont réussi, `false` sinon.
   */
  execute(): Promise<boolean>;

  /**
   * **Réinitialiser le gestionnaire**
   *
   * Supprime toutes les commandes et réinitialise le contexte.
   *
   * #### Exemple
   * ```ts
   * manager.reset();
   * ```
   */
  reset(): void;

  /**
   * **Obtenir le contexte actuel**
   *
   * Retourne une copie immuable du contexte global.
   *
   * #### Exemple
   * ```ts
   * const currentContext = manager.getContext();
   * console.log(currentContext);
   * ```
   *
   * @returns Une copie du contexte global actuel.
   */
  getContext(): Readonly<TContext>;

  /**
   * **Obtenir la liste des commandes**
   *
   * Retourne une copie immuable des commandes enregistrées.
   *
   * #### Exemple
   * ```ts
   * const commands = manager.getCommands();
   * console.log(commands);
   * ```
   *
   * @returns Une liste immuable des commandes enregistrées.
   */
  getCommands(): Readonly<NamedCommand<TContext>[]>;

  /**
   * **Exécuter une commande spécifique**
   *
   * Exécute uniquement une commande identifiée par son nom.
   *
   * #### Exemple
   * ```ts
   * const result = await manager.executeOnly('greet');
   * console.log(result);
   * ```
   *
   * @param name - Le nom de la commande à exécuter.
   * @returns Le résultat de la commande, ou `null` si elle n'existe pas.
   */
  executeOnly(name: string): Promise<CommandResult | null>;

  /**
   * **Exécuter les commandes suivantes**
   *
   * Exécute toutes les commandes qui se trouvent après une commande donnée.
   *
   * #### Exemple
   * ```ts
   * const success = await manager.executeAfter('step1');
   * console.log(success);
   * ```
   *
   * @param name - Le nom de la commande après laquelle commencer.
   * @returns `true` si toutes les commandes restantes ont réussi, `false` sinon.
   */
  executeAfter(name: string): Promise<boolean>;

  /**
   * **Exécuter un sous-ensemble de commandes**
   *
   * Exécute une liste spécifique de commandes.
   *
   * #### Exemple
   * ```ts
   * const subset = manager.getCommands().slice(1, 3);
   * const success = await manager.executeSubset(subset);
   * console.log(success);
   * ```
   *
   * @param commands - La liste des commandes à exécuter.
   * @returns `true` si toutes les commandes ont réussi, `false` sinon.
   */
  executeSubset(commands: NamedCommand<TContext>[]): Promise<boolean>;
}
