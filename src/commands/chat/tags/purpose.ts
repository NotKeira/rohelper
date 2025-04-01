import { Message } from "discord.js";
import { ChatCommand } from "@/types/ChatCommand";

export const PurposeCommand: ChatCommand = {
  name: "purpose",
  aliases: ["purpose"],
  description: "Explains the purpose of the server.",
  async execute(message: Message): Promise<void> {
    const response =
      "This server is for helping people program and with Roblox Studio in general. " +
      "It is not for exploits or cheating. " +
      "The server allows hiring and portfolio posts but only through the correct channels " +
      "(using the </post portfolio:1353425973810429965> or </post job:1353425973810429965> command).";
    if (message.reference?.messageId) {
      const referencedMessage = await message.channel.messages.fetch(
        message.reference.messageId
      );
      await referencedMessage.reply(response);
    } else {
      await message.reply(response);
    }
  },
};
