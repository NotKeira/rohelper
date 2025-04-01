import {
  Events,
  Interaction,
  CommandInteraction,
  TextChannel,
  MessageFlags,
} from "discord.js";
import { commands } from "@/main";
import { PostModel } from "@/db/models/Post.model";
import { Post } from "@/types/Post";

let cachedChoices: { name: string; value: string }[] = [];
let lastCacheUpdate = 0;

export async function updateCache(): Promise<void> {
  const now = Date.now();
  if (now - lastCacheUpdate > 3000) {
    // Update cache every 3 seconds
    console.log("[Event] Attempting to update autocomplete cache.");
    try {
      const pendingPosts = await PostModel.getPendingPosts();
      cachedChoices = pendingPosts.map((post: Post) => ({
        name: `${post.subcommand} | ${post.information.title}`,
        value: post.id,
      }));
      lastCacheUpdate = now;
      console.log("[Event] Autocomplete cache updated successfully.");
    } catch (error) {
      console.error("Error updating autocomplete cache:", error);
    }
  }
}

export const InteractionCreate = {
  async execute(interaction: Interaction): Promise<void> {
    if (interaction.isAutocomplete()) {
      const focusedOption = interaction.options.getFocused(true);
      if (focusedOption.name === "id") {
        await interaction.respond(cachedChoices);
      }
    } else if (interaction.isModalSubmit()) {
      if (interaction.customId === "close_ticket_modal") {
        const reason =
          interaction.fields.getTextInputValue("close_reason") ||
          "No reason provided";
        const channel: TextChannel = interaction.channel as TextChannel;
        if (channel) {
          await channel.send(
            `Ticket closed by ${interaction.user.tag}. Reason: ${reason}`
          );
          await channel.delete();
        }
      }
    } else if (interaction.isChatInputCommand()) {
      const command = commands.get(interaction.commandName);

      if (!command) {
        console.error(
          `No command matching ${interaction.commandName} was found.`
        );
        return;
      }

      try {
        await (
          command as {
            execute: (interaction: CommandInteraction) => Promise<void>;
          }
        ).execute(interaction);
      } catch (error) {
        console.error(error);
        if (interaction.replied || interaction.deferred) {
          await interaction.followUp({
            content: "There was an error while executing this command!",
            flags: MessageFlags.Ephemeral,
          });
        } else {
          await interaction.reply({
            content: "There was an error while executing this command!",
            flags: MessageFlags.Ephemeral,
          });
        }
      }
    }
  },
  name: Events.InteractionCreate,
};
