import {
  ChatInputCommandInteraction,
  EmbedBuilder,
  GuildMember,
  SlashCommandBuilder,
  TextChannel,
  MessageFlags,
  ActionRowBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  Role,
} from "discord.js";
import { Colours } from "@/utils/Colours";
import { generateKey } from "@/utils/generator";
import { handleApprovalProcess } from "@/utils/handlers/approval";
import { PostModel } from "@/db/models/Post.model";

export const PostCommand = {
  data: new SlashCommandBuilder()
    .setName("post")
    .setDescription("Post a job offer or portfolio in the server")
    .addSubcommand((subcommand) =>
      subcommand.setName("job").setDescription("Post a job offer")
    )
    .addSubcommand((subcommand) =>
      subcommand.setName("portfolio").setDescription("Post a portfolio")
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("admin")
        .setDescription("Approve or reject a post by ID")
        .addStringOption((option) =>
          option
            .setName("id")
            .setDescription("ID of the post")
            .setRequired(true)
            .setAutocomplete(true)
        )
        .addStringOption((option) =>
          option
            .setName("decision")
            .setDescription("Approve or Reject")
            .setRequired(true)
            .addChoices(
              { name: "Approve", value: "approve" },
              { name: "Reject", value: "reject" }
            )
        )
    ),
  async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    const subcommand = interaction.options.getSubcommand();
    const member = interaction.member as GuildMember;
    if (subcommand === "admin") {
      if (
        !member?.roles.cache.some(
          (role: Role) => role.id === process.env.STAFF_ID
        )
      ) {
        await interaction.reply({
          content: "You do not have permission to use this command.",
          flags: MessageFlags.Ephemeral,
        });
      }
      const decision = interaction.options.getString("decision");
      const postId = interaction.options.getString("id");

      const post = await PostModel.getById(postId as string);
      if (!post) {
        await interaction.reply({
          content: `Post with ID \`${postId}\` not found.`,
          flags: MessageFlags.Ephemeral,
        });
        return;
      }

      const guild = interaction.guild;
      if (!guild) {
        await interaction.reply({
          content: "This command can only be used in a server.",
          flags: MessageFlags.Ephemeral,
        });
        return;
      }

      const logChannel = guild.channels.cache.find(
        (channel) =>
          channel.id === process.env.LOGS_CHANNEL_ID && channel.isTextBased()
      ) as TextChannel;

      if (!logChannel) {
        await interaction.reply({
          content: "Log channel not found.",
          flags: MessageFlags.Ephemeral,
        });
        return;
      }

      if (decision === "approve") {
        post.status = "approved";
        await post.save();

        const targetChannel = guild.channels.cache.find(
          (channel) =>
            channel.id ===
              (post.subcommand === "job"
                ? process.env.JOB_ID
                : process.env.PORTFOLIO_ID) && channel.isTextBased()
        ) as TextChannel;

        if (!targetChannel) {
          await interaction.reply({
            content: "Target channel not found.",
            flags: MessageFlags.Ephemeral,
          });
          return;
        }

        const embed = new EmbedBuilder()
          .setColor(Colours.SUCCESS)
          .setTitle(
            `${
              post.subcommand.charAt(0).toUpperCase() + post.subcommand.slice(1)
            } | ${post.information.title}`
          )
          .setDescription(post.information.formattedDescription)
          .setFooter({ text: `Approved by ${interaction.user.tag}` })
          .setTimestamp();

        await targetChannel.send({
          content: `<@${post.information.userId}>`,
          embeds: [embed],
        });
        await logChannel.send({ embeds: [embed] });

        // Delete the approval message
        if (post.staffPostId) {
          const staffMessage = await logChannel.messages
            .fetch(post.staffPostId)
            .catch(() => null);
          if (staffMessage) await staffMessage.delete();
        }

        await interaction.reply({
          content: `Post \`${post.id}\` approved and posted successfully.`,
          flags: MessageFlags.Ephemeral,
        });
      } else if (decision === "reject") {
        post.status = "rejected";
        await post.save();

        const embed = new EmbedBuilder()
          .setColor(Colours.ERROR)
          .setTitle(
            `${
              post.subcommand.charAt(0).toUpperCase() + post.subcommand.slice(1)
            } Rejected`
          )
          .setDescription(post.information.formattedDescription)
          .setFooter({ text: `Rejected by ${interaction.user.tag}` })
          .setTimestamp();

        await logChannel.send({ embeds: [embed] });

        // Delete the approval message
        if (post.staffPostId) {
          const staffMessage = await logChannel.messages
            .fetch(post.staffPostId)
            .catch(() => null);
          if (staffMessage) await staffMessage.delete();
        }

        await interaction.reply({
          content: `Post \`${post.id}\` rejected.`,
          flags: MessageFlags.Ephemeral,
        });
      }
      return;
    }

    if (
      member.roles.cache.some((role) => role.id === process.env.BLACKLIST_ROLE)
    ) {
      await interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setTitle("Permission Denied")
            .setDescription(
              "You've been blacklisted from posting.\nTo appeal use </tickets appeal:12345>"
            )
            .setColor(Colours.ERROR),
        ],
      });
      return;
    }

    const guild = interaction.guild;
    if (!guild) {
      await interaction.reply({
        content: "This command can only be used in a server.",
        flags: MessageFlags.Ephemeral,
      });
      return;
    }

    const modal = new ModalBuilder()
      .setCustomId(`${subcommand}Modal`)
      .setTitle(
        `${subcommand.charAt(0).toUpperCase() + subcommand.slice(1)} Details`
      );
    const inputs = [
      new TextInputBuilder()
        .setCustomId(`${subcommand}Title`)
        .setLabel(
          `${subcommand.charAt(0).toUpperCase() + subcommand.slice(1)} Title`
        )
        .setStyle(TextInputStyle.Short)
        .setRequired(true),
      new TextInputBuilder()
        .setCustomId(`${subcommand}Description`)
        .setLabel(
          `${
            subcommand.charAt(0).toUpperCase() + subcommand.slice(1)
          } Description`
        )
        .setStyle(TextInputStyle.Paragraph)
        .setRequired(true),
    ];

    if (subcommand === "job") {
      inputs.push(
        new TextInputBuilder()
          .setCustomId("jobRequirements")
          .setLabel("Job Requirements")
          .setStyle(TextInputStyle.Paragraph)
          .setRequired(true),
        new TextInputBuilder()
          .setCustomId("jobSalary")
          .setLabel("Job Payment")
          .setStyle(TextInputStyle.Short)
          .setRequired(true)
      );
    } else {
      inputs.push(
        new TextInputBuilder()
          .setCustomId("portfolioLink")
          .setLabel("Portfolio Reference Links")
          .setPlaceholder("e.g. https://example.com, https://example2.com")
          .setStyle(TextInputStyle.Paragraph)
          .setRequired(false)
      );
    }

    modal.addComponents(
      inputs.map((input) =>
        new ActionRowBuilder<TextInputBuilder>().addComponents(input)
      )
    );
    await interaction.showModal(modal);

    const submitted = await interaction.awaitModalSubmit({
      filter: (i) =>
        i.customId === `${subcommand}Modal` &&
        i.user.id === interaction.user.id,
      time: 600000,
    });

    const information: {
      title: string;
      description: string;
      requirements?: string;
      salary?: string;
      links?: string;
      formattedDescription: string;
      userId: string;
    } = {
      title: submitted.fields.getTextInputValue(`${subcommand}Title`),
      description: submitted.fields.getTextInputValue(
        `${subcommand}Description`
      ),
      requirements:
        subcommand === "job"
          ? submitted.fields.getTextInputValue("jobRequirements")
          : undefined,
      salary:
        subcommand === "job"
          ? submitted.fields.getTextInputValue("jobSalary")
          : undefined,
      formattedDescription: "",
      userId: interaction.user.id,
    };

    let formattedDescription = `**Description:**\n${information.description}`;
    if (subcommand === "job") {
      formattedDescription += `\n\n**Requirements:**\n${information.requirements}\n\n**Payment:**\n${information.salary}`;
    } else if (subcommand === "portfolio") {
      const links = submitted.fields
        .getTextInputValue("portfolioLink")
        .split(",")
        .map((link) => `- ${link.trim()}`)
        .join("\n");
      formattedDescription += `\n\n**Portfolio Links:**\n${links}`;
    }

    information.formattedDescription = formattedDescription;

    await submitted.reply({
      content: `Your ${subcommand} has been recieved.`,
      flags: MessageFlags.Ephemeral,
    });

    const uniqueId = generateKey();
    if (!information.formattedDescription) {
      await interaction.followUp({
        content: "Failed to generate formatted description.",
        flags: MessageFlags.Ephemeral,
      });
      return;
    }
    const post = new PostModel(
      uniqueId.toString(),
      subcommand,
      information,
      "pending"
    );
    await post.save();

    const staffChannel = guild.channels.cache.find(
      (channel) =>
        channel.id === process.env.STAFF_CHANNEL_ID &&
        channel.isTextBased() &&
        channel
          .permissionsFor(guild.members.me as GuildMember)
          .has("SendMessages")
    ) as TextChannel;

    if (!staffChannel) {
      await interaction.followUp({
        content: "Staff approvals channel not found.",
        flags: MessageFlags.Ephemeral,
      });
      return;
    }

    await handleApprovalProcess(interaction, staffChannel, post);
  },
};
