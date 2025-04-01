import { Events, EmbedBuilder, GuildMember, TextChannel } from "discord.js";
import { CHANNELS } from "@/../config.json";
import { Colours } from "@/utils/Colours";

export const GuildMemberRemove = {
  name: Events.GuildMemberRemove,
  async execute(member: GuildMember): Promise<void> {
    const embed: EmbedBuilder = new EmbedBuilder()
      .setColor(Colours.INFO)
      .setTitle("User Left")
      .setDescription(
        `
            **User ID:** ${member.user.id}\n
            **Member Count:** ${member.guild.memberCount}\n
            **Is Bot:** ${member.user.bot}\n
            **Is System:** ${member.user.system}`
      )
      .setThumbnail(member.user.avatarURL() ?? "")
      .setFooter({ text: "Cobolt - System Message" })
      .setTimestamp();

    const channel: TextChannel | null = (await member.client.channels.fetch(
      CHANNELS.JOIN_LEAVE.toString()
    )) as TextChannel;

    if (!channel) {
      console.warn("Channel not found");
      return;
    }

    await channel.send({ embeds: [embed] });
  },
};
