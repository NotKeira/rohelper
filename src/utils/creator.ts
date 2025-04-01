import {
  Client,
  Guild,
  PermissionsBitField,
  GuildMember,
  TextChannel,
  ChannelType,
} from "discord.js";

async function createTicketChannel(
  client: Client,
  guild: Guild,
  member: GuildMember
): Promise<TextChannel> {
  if (!guild || !member || !member.user || !client || !client.user) {
    throw new Error("Invalid parameters provided.");
  }
  const channelName = `ticket-${member.nickname || member.user.username}`;
  const everyoneRole = guild.roles.everyone;

  const channel = await guild.channels.create({
    name: channelName,
    type: ChannelType.GuildText,
    permissionOverwrites: [
      {
        id: everyoneRole.id,
        deny: [PermissionsBitField.Flags.ViewChannel],
      },
      {
        id: client?.user.id,
        allow: [
          PermissionsBitField.Flags.ViewChannel,
          PermissionsBitField.Flags.SendMessages,
          PermissionsBitField.Flags.EmbedLinks,
          PermissionsBitField.Flags.AttachFiles,
          PermissionsBitField.Flags.AddReactions,
          PermissionsBitField.Flags.ManageChannels,
        ],
      },
      {
        id: member.id,
        allow: [
          PermissionsBitField.Flags.ViewChannel,
          PermissionsBitField.Flags.SendMessages,
          PermissionsBitField.Flags.EmbedLinks,
          PermissionsBitField.Flags.AttachFiles,
        ],
      },
      {
        id: process.env.STAFF_ID as string,
        allow: [
          PermissionsBitField.Flags.ViewChannel,
          PermissionsBitField.Flags.SendMessages,
          PermissionsBitField.Flags.EmbedLinks,
          PermissionsBitField.Flags.AttachFiles,
          PermissionsBitField.Flags.ManageMessages,
          PermissionsBitField.Flags.ManageChannels,
        ],
      }
    ],
  });

  return channel;
}

export { createTicketChannel };
