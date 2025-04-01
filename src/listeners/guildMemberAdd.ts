import { Colours } from "@/utils/Colours";
import { Events, EmbedBuilder, GuildMember, TextChannel } from "discord.js";
import { CHANNELS } from "@/../config.json";

export const GuildMemberAdd = {
  name: Events.GuildMemberAdd,
  async execute(member: GuildMember): Promise<void> {
    const embed: EmbedBuilder = new EmbedBuilder()
      .setColor(Colours.INFO)
      .setTitle("New Member")
      .setDescription(
        `
            Welcome to the server ${member.user.username}!\n
            **User ID:** ${member.user.id}\n
            **Member Count:** ${member.guild.memberCount}\n
            **Is Bot:** ${member.user.bot}\n
            **Is System:** ${member.user.system}`
      )
      .setThumbnail(member.user.avatarURL() ?? "")
      .setFooter({ text: "RoHelper - System Message" })
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
