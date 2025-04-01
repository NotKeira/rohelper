import {
  ChatInputCommandInteraction,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  ActionRowBuilder,
  SlashCommandBuilder,
  ModalSubmitInteraction,
} from "discord.js";
import { exec } from "child_process";

export const ExecCommand = {
  data: new SlashCommandBuilder()
    .setName("exec")
    .setDescription("Execute TypeScript/JavaScript code"),
  async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    if (interaction.user.id !== "801384603704623115") {
      await interaction.reply({
        content: "You are not authorized to use this command.",
        ephemeral: true,
      });
      return;
    }

    const modal = new ModalBuilder()
      .setCustomId("execModal")
      .setTitle("Execute Code")
      .addComponents(
        new ActionRowBuilder<TextInputBuilder>().addComponents(
          new TextInputBuilder()
            .setCustomId("codeInput")
            .setLabel("TypeScript/JavaScript Code")
            .setStyle(TextInputStyle.Paragraph)
        )
      );

    await interaction.showModal(modal);
  },
  async handleModalSubmit(interaction: ModalSubmitInteraction): Promise<void> {
    if (interaction.customId !== "execModal") return;

    const code = interaction.fields.getTextInputValue("codeInput");

    exec(`node -e "${code}"`, async (error, stdout, stderr) => {
      if (error) {
        await interaction.reply({
          content: `Error: ${stderr}`,
          ephemeral: false,
        });
      } else {
        await interaction.reply({
          content: `Output: ${stdout}`,
        });
        setTimeout(async () => {
          await interaction.deleteReply();
        }, 30000);
      }
    });
  },
};
