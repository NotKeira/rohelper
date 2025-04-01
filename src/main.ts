import "@/logger";
import { Client, Collection, IntentsBitField } from "discord.js";
import { Commands } from "@/commands";
import * as Events from "@/listeners";
import { registerCommands } from "@/utils/registration";
import { Command } from "@/types";
import dotenv from "dotenv";
dotenv.config();

interface Event {
  name: string;
  once?: boolean;
  execute: (...args: unknown[]) => void;
}

const client: Client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
  ],
});

export const commands: Collection<string, Command> = new Collection<
  string,
  Command
>();
const token: string | undefined = process.env.TOKEN as string;
const clientId: string = process.env.CLIENT_ID as string;
if (!token)
  throw new Error("Bot token is not defined in environment variables");
if (!clientId)
  throw new Error("Client ID is not defined in environment variables");

(async () => {
  await registerCommands(commands, Commands, clientId, token);
})();

for (const eventName in Events) {
  if (Object.prototype.hasOwnProperty.call(Events, eventName)) {
    const event: Event = (Events as unknown as { [key: string]: Event })[
      eventName
    ];
    if (event.once) {
      client.once(event.name, (...args: any) => event.execute(...args));
    } else {
      client.on(event.name, (...args: any) => event.execute(...args));
    }
    console.log(`[Event] Registered Event - ${eventName}`);
  }
}

try {
  await client.login(token);
  console.log("[Event] Client logged in successfully.");
} catch (error) {
  console.error(error);
}
