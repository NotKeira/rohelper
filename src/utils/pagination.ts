import {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ChatInputCommandInteraction,
  MessageComponentInteraction,
  MessageFlags,
  Message,
} from "discord.js";

export class Pagination {
  items: EmbedBuilder[];
  itemsPerPage: number;
  constructor(items: EmbedBuilder[], itemsPerPage: number) {
    this.items = items;
    this.itemsPerPage = itemsPerPage;
  }

  paginate(): EmbedBuilder[][] {
    const pages: EmbedBuilder[][] = [];
    for (let i: number = 0; i < this.items.length; i += this.itemsPerPage) {
      pages.push(this.items.slice(i, i + this.itemsPerPage));
    }
    return pages;
  }

  static async new(
    interaction:
      | ChatInputCommandInteraction
      | MessageComponentInteraction
      | Message,
    title: string,
    content: string[],
    colour: [number, number, number],
    itemsPerPage: number,
    userId?: string
  ): Promise<void> {
    const pages: EmbedBuilder[][] = new Pagination(
      content.reduce((acc: EmbedBuilder[], item: string, index: number) => {
        const pageIndex = Math.floor(index / itemsPerPage);
        if (!acc[pageIndex]) {
          acc[pageIndex] = new EmbedBuilder().setTitle(title).setColor(colour);
        }
        acc[pageIndex].setDescription(
          (acc[pageIndex].data.description || "") + `${item}\n`
        );
        acc[pageIndex].setFooter({
          text: `Page ${pageIndex + 1}/${Math.ceil(
            content.length / itemsPerPage
          )}`,
        });
        return acc;
      }, []),
      1
    ).paginate();
    let currentPage: number = 0;

    const row: ActionRowBuilder<ButtonBuilder> =
      new ActionRowBuilder<ButtonBuilder>().addComponents(
        new ButtonBuilder()
          .setCustomId("prev")
          .setLabel("Previous")
          .setStyle(ButtonStyle.Primary)
          .setDisabled(currentPage === 0),
        new ButtonBuilder()
          .setCustomId("next")
          .setLabel("Next")
          .setStyle(ButtonStyle.Primary)
          .setDisabled(currentPage === pages.length - 1)
      );

    let message: Message;

    if (interaction instanceof Message) {
      message = await interaction.reply({
        embeds: pages[currentPage],
        components: [row],
      });
    } else {
      message = (await interaction.reply({
        embeds: pages[currentPage],
        components: [row],
        flags: MessageFlags.Ephemeral,
        withResponse: true,
      })) as unknown as Message;
    }

    const collector = message.createMessageComponentCollector({
      time: 180000,
      filter: (i) => !userId || i.user.id === userId,
    });

    collector.on("collect", async (i: MessageComponentInteraction) => {
      if (i.customId === "prev" && currentPage > 0) {
        currentPage--;
      } else if (i.customId === "next" && currentPage < pages.length - 1) {
        currentPage++;
      }

      await i.update({
        embeds: pages[currentPage],
        components: [
          new ActionRowBuilder<ButtonBuilder>().addComponents(
            new ButtonBuilder()
              .setCustomId("prev")
              .setLabel("Previous")
              .setStyle(ButtonStyle.Primary)
              .setDisabled(currentPage === 0),
            new ButtonBuilder()
              .setCustomId("next")
              .setLabel("Next")
              .setStyle(ButtonStyle.Primary)
              .setDisabled(currentPage === pages.length - 1)
          ),
        ],
      });
    });

    collector.on("end", async () => {
      try {
        await message.delete();
        console.log("[Command] Collector Timeout");
      } catch (error) {
        console.log("[Command] Collector Timeout");
      }
    });
  }
}
