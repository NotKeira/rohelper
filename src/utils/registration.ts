import { Collection, REST, Routes } from "discord.js";

import { Command } from "@/types/Command";

export async function registerCommands(
  commands: Collection<string, Command>,
  Commands: { [key: string]: Command },
  clientId: string,
  token: string
): Promise<void> {
  const rest: REST = new REST({ version: "10" }).setToken(token);
  const commandsToRegister: Array<Record<string, any>> = [];

  for (const commandName in Commands) {
    const command: Command = Commands[commandName];
    if ("data" in command && "execute" in command) {
      commands.set(command.data.name, command);
      console.log(`[Command] Registering ${command.data.name}`);
      commandsToRegister.push(command.data.toJSON());
    } else {
      console.warn(
        `[Command] The command ${commandName} is missing a required "data" or "execute" property.`
      );
    }
  }

  try {
    if (commandsToRegister.length > 0) {
      console.log("[Command] Checking for command updates...");

      const shouldCheckOldCommands: boolean =
        process.env.CHECK_OLD_COMMANDS?.toLowerCase() === "true";

      if (shouldCheckOldCommands) {
        const currentCommands: any[] = (await rest.get(
          Routes.applicationCommands(clientId)
        )) as any[];
        const commandsChanged: boolean = currentCommands.some((cmd: any) => {
          const newCommand: Record<string, any> | undefined =
            commandsToRegister.find(
              (newCmd: Record<string, any>) => newCmd.name === cmd.name
            );
          return (
            !newCommand || JSON.stringify(newCommand) !== JSON.stringify(cmd)
          );
        });

        if (commandsChanged) {
          console.log("[Command] Reloading application (/) commands...");
          const data: any[] = (await rest.put(
            Routes.applicationCommands(clientId),
            {
              body: commandsToRegister,
            }
          )) as any[];
          console.log(
            `[Command] Successfully reloaded ${data.length} application (/) commands.`
          );
        } else {
          console.log("[Command] No changes detected in commands.");
        }
      } else {
        console.log("[Command] Reloading all application (/) commands...");
        const data: any[] = (await rest.put(
          Routes.applicationCommands(clientId),
          {
            body: commandsToRegister,
          }
        )) as any[];
        console.log(
          `[Command] Successfully reloaded ${data.length} application (/) commands.`
        );
      }
    } else {
      console.warn("[Command] No commands to register.");
    }
  } catch (error: any) {
    console.error("[Command] Error registering commands:", error);
  }
}
