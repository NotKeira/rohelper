import { Events, Client, ActivityType } from "discord.js";
import { updateCache } from "./interactionCreate";

export const Ready = {
  name: Events.ClientReady,
  once: true,
  async execute(client: Client): Promise<void> {
    const info: string[] = [
      `Client is Ready`,
      `Logged in as ${client.user?.tag}`,
      `Guilds: ${client.guilds.cache.size}`,
      `Users: ${client.users.cache.size}`,
      `Channels: ${client.channels.cache.size}`,
    ];

    for (const line of info) {
      console.log(`[ReadyEvent] ${line}`);
    }
    client.user?.setActivity({
      name: "your posts",
      type: ActivityType.Watching,
    });
    await updateCache();
  },
};
