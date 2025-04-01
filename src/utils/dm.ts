import { EmbedBuilder, GuildMember } from "discord.js";

export async function sendDM(
  member: GuildMember,
  message: { content?: string; embeds?: EmbedBuilder[] }
): Promise<void> {
  try {
    await member.send(message);
  } catch (error) {
    console.error(`Could not DM ${member.id}`);
  }
}
