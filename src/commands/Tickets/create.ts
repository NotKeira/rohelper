import {
  ChatInputCommandInteraction,
  EmbedBuilder,
  GuildMember,
  MessageFlags,
  SlashCommandBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  ComponentType,
} from "discord.js";
import { Colours } from "@/utils/Colours";
import { TicketModel } from "@/db/models/Ticket.model";
import { createTicketChannel } from "@/utils/creator";

export const CreateCommand = {
  data: new SlashCommandBuilder()
    .setName("create")
    .setDescription("Create a new ticket")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("appeal")
        .setDescription("Create a new appeal ticket")
        .addStringOption((option) =>
          option
            .setName("reason")
            .setDescription("Reason for the appeal")
            .setRequired(false)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("general")
        .setDescription("Create a new general ticket")
        .addStringOption((option) =>
          option
            .setName("description")
            .setDescription("Description of the issue")
            .setRequired(false)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("support")
        .setDescription("Create a new support ticket")
        .addStringOption((option) =>
          option
            .setName("issue")
            .setDescription("Description of the support needed")
            .setRequired(false)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("report")
        .setDescription("Create a new report ticket")
        .addUserOption((option) =>
          option
            .setName("user")
            .setDescription("User to report")
            .setRequired(true)
        )
        .addStringOption((option) =>
          option
            .setName("reason")
            .setDescription("Reason for the report")
            .setRequired(true)
        )
    ),
  async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    if (!interaction.guild) {
      await interaction.reply({
        content: "This command can only be used in a server.",
        flags: MessageFlags.Ephemeral,
      });
      return;
    }

    const subcommand = interaction.options.getSubcommand();
    const channel = await createTicketChannel(
      interaction.client,
      interaction.guild,
      interaction.member as GuildMember
    );
    if (!channel) {
      await interaction.reply({
        content: "Failed to create a ticket channel.",
        flags: MessageFlags.Ephemeral,
      });
      return;
    }

    await interaction.reply({
      content: `Ticket created! ${channel}`,
      flags: MessageFlags.Ephemeral,
    });

    const closeButton = new ButtonBuilder()
      .setCustomId("close_ticket")
      .setLabel("Close Ticket")
      .setStyle(ButtonStyle.Danger);

    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
      closeButton
    );

    switch (subcommand) {
      case "appeal": {
        const embed = new EmbedBuilder()
          .setColor(Colours.DEFAULT)
          .setTitle("Ticket: Appeal")
          .setDescription(
            `**Reason for appeal:** ${interaction.options.getString("reason")}`
          )
          .setTimestamp();
        await channel.send({ embeds: [embed], components: [row] });
        break;
      }
      case "general": {
        const embed = new EmbedBuilder()
          .setColor(Colours.DEFAULT)
          .setTitle("Ticket: General")
          .setDescription(
            `**Description:** ${interaction.options.getString("description")}`
          )
          .setTimestamp();
        await channel.send({ embeds: [embed], components: [row] });
        break;
      }
      case "support": {
        const embed = new EmbedBuilder()
          .setColor(Colours.DEFAULT)
          .setTitle("Ticket: Support")
          .setDescription(
            `A support ticket has been created by ${interaction.user.tag}`
          )
          .setTimestamp();
        await channel.send({ embeds: [embed], components: [row] });
        break;
      }
      case "report": {
        const reportedUser = interaction.options.getUser("user");
        const reportReason = interaction.options.getString("reason");
        const embed = new EmbedBuilder()
          .setColor(Colours.DEFAULT)
          .setTitle("Ticket: Report")
          .setDescription(
            `**Reported User:** ${reportedUser}\n**Reason:** ${reportReason}`
          )
          .setTimestamp();
        await channel.send({ embeds: [embed], components: [row] });
        break;
      }
    }
    await interaction.user.send({
      content: `Your ticket has been created! ${channel}`,
    });

    const collector = channel.createMessageComponentCollector({
      componentType: ComponentType.Button,
      time: 0,
    });

    collector.on("collect", async (buttonInteraction) => {
      if (buttonInteraction.customId === "close_ticket") {
        const modal = new ModalBuilder()
          .setCustomId("close_ticket_modal")
          .setTitle("Close Ticket");

        const reasonInput = new TextInputBuilder()
          .setCustomId("close_reason")
          .setLabel("Reason for closing (optional)")
          .setStyle(TextInputStyle.Paragraph)
          .setRequired(false);

        const modalRow = new ActionRowBuilder<TextInputBuilder>().addComponents(
          reasonInput
        );
        modal.addComponents(modalRow);

        await buttonInteraction.showModal(modal);
      }
    });

    const ticket = new TicketModel(
      undefined,
      interaction.user.id,
      interaction.guild.id,
      channel.id
    );
    ticket.save().catch((error) => {
      console.error(`Failed to save ticket to the database: ${error}`);
      interaction.followUp({
        content: "Failed to save the ticket to the database.",
        flags: MessageFlags.Ephemeral,
      });
    });
  },
};
