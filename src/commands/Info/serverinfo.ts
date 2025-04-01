import {
  ChatInputCommandInteraction,
  MessageFlags,
  SlashCommandBuilder,
} from "discord.js";
import { Pagination } from "@/utils/pagination"; // Add this import

export const ServerInfoCommand = {
  data: new SlashCommandBuilder()
    .setName("serverinfo")
    .setDescription("Displays server information")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("channels")
        .setDescription("Displays server channels and their IDs")
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("roles")
        .setDescription("Displays server roles and their IDs")
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("members")
        .setDescription("Displays server members and their IDs")
    ),
  async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    const subcommand = interaction.options.getSubcommand();
    if (!interaction.guild) {
      await interaction.reply({
        content: "This command can only be used in a server.",
        flags: MessageFlags.Ephemeral,
      });
      return;
    }
    if (!interaction.guild.available) {
      await interaction.reply({
        content: "The server is not available.",
        flags: MessageFlags.Ephemeral,
      });
      return;
    }
    let items: string[] = [];
    if (subcommand === "channels") {
      items = interaction.guild.channels.cache.map(
        (channel) => `${channel.id} \| ${channel.name}`
      );
    } else if (subcommand === "roles") {
      items = interaction.guild.roles.cache.map(
        (role) => `${role.id} \| ${role.name}`
      );
    } else if (subcommand === "members") {
      items = interaction.guild.members.cache.map(
        (member) => `${member.id} \| ${member.user.tag}`
      );
    }

    const itemsPerPage = 10;
    await Pagination.new(
      interaction,
      `Server ${subcommand.charAt(0).toUpperCase() + subcommand.slice(1)}`,
      items,
      [0, 0, 255],
      itemsPerPage
    );
  },
};
