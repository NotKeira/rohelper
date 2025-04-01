import {
  ChatInputCommandInteraction,
  EmbedBuilder,
  SlashCommandBuilder,
} from "discord.js";
import { Colours } from "@/utils/Colours";

class Statistics {
  uptime: number;

  constructor() {
    this.uptime = process.uptime();
  }

  getUptime() {
    const [d, h, m, s] = [
      Math.floor(this.uptime / 86400),
      Math.floor(this.uptime / 3600) % 24,
      Math.floor(this.uptime / 60) % 60,
      Math.floor(this.uptime % 60),
    ];
    return `${d > 0 ? `${d} days, ` : ""}${h > 0 ? `${h} hours, ` : ""}${
      m > 0 ? `${m} minutes, ` : ""
    }${s} seconds`;
  }
}

export const StatsCommand = {
  data: new SlashCommandBuilder()
    .setName("stats")
    .setDescription("Displays the bot's uptime, memory usage, CPU load, and other performance statistics."),
  async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    const stats: Statistics = new Statistics();
    const uptimeString: string = stats.getUptime();
    const apiLatency: number = Date.now() - interaction.createdTimestamp;
    const websocketLatency: number = interaction.client.ws.ping;

    let total: { [key: string]: number } = {
      members: 0,
      humans: 0,
      bots: 0,
    };

    for (const guild of interaction.client.guilds.cache.values()) {
      await guild.members.fetch();
      total.members += guild.memberCount;
      total.humans += guild.members.cache.filter(
        (member) => !member.user.bot
      ).size;
      total.bots += guild.members.cache.filter(
        (member) => member.user.bot
      ).size;
    }

    const memoryUsage: number = Math.round(
      process.memoryUsage().heapUsed / 1024 / 1024
    );
    const startTime: string = new Date(
      interaction.client.readyAt
    ).toUTCString();

    const embed: EmbedBuilder = new EmbedBuilder()
      .setDescription(
        `**Uptime:** \`${uptimeString}\`\n
        **API Latency:** \`${apiLatency}ms\`\n
        **Websocket Latency:** \`${websocketLatency}ms\`\n
        **Node.js Version:** \`${process.version}\`\n
        **Discord.js Version:** \`v14.18.0\`\n
        **Memory Usage:** \`${memoryUsage} MiB\`\n
        **Start Time:** \`${startTime}\`\n
        **Members:** \`${total.members}\` (Humans: ${total.humans} | Bots: ${total.bots})`
      )
      .setTimestamp()
      .setColor(Colours.INFO);

    await interaction.reply({ embeds: [embed] });
    setTimeout(async () => {
      await interaction.deleteReply();
    }, 20000);
  },
};
