import { Message, EmbedBuilder } from "discord.js";
import { ChatCommand } from "@/types/ChatCommand";
import { ChatCommands } from "@/commands/chat";
import { Pagination } from "@/utils/pagination";
import { Colours } from "@/utils/Colours";

export const TagsCommand: ChatCommand = {
  name: "tags",
  aliases: ["tags"],
  description:
    "Lists all tags, their aliases, and their descriptions/purposes.",
  async execute(message: Message): Promise<void> {
    const items = ChatCommands.map((command) => {
      const aliases = command.aliases ? command.aliases.join(", ") : "None";
      return `**${command.name}**\nAliases: ${aliases}\nDescription: ${command.description}`;
    });

    const itemsPerPage = 2;

    await Pagination.new(
      message,
      "Server Tags",
      items,
      Colours.INFO,
      itemsPerPage,
      message.author.id // Restrict access to the user who ran the command
    );
  },
};
