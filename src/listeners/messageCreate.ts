import { Events, Message } from "discord.js";
import { ChatCommands } from "@/commands/chat";

export const MessageCreate = {
  name: Events.MessageCreate,
  once: false,
  async execute(message: Message) {
    if (message.guild) {
      if (message.content.startsWith("!") || message.content.startsWith(".")) {
        for (const command of ChatCommands) {
          if (
            (command.aliases &&
              command.aliases.some((alias) =>
                message.content.includes(alias)
              )) ||
            message.content.includes(command.name)
          ) {
            await command.execute(message);
            return;
          }
        }
      }
      // const response = await openai.chat.completions.create({
      //   model: "gpt-4o",
      //   messages: [{role:"developer",content:`Analyze the following message and determine the appropriate response based on the context:\n\n"${message.content}"\n\nResponses:\n1. Go to #cmds and use </post job> or check #dev-portfolios.\n2. Go to #cmds and use </post portfolio> or check #hire-developers.\n3. Please visit #roblox-scripting for scripting-related discussions.`}],
      //   max_tokens: 50,
      // });

      // const reply = response.choices[0].message.content;
      // await message.reply(reply);

      // const ticketChannel = await TicketModel.getByUserId(
      //   message.author.id,
      //   message.guild.id
      // )
      //   .then((ticket) => {
      //     if (!ticket) return null;
      //     return ticket;
      //   })
      //   .catch((error) => {
      //     console.error("Error fetching ticket:", error);
      //     return null;
      //   });

      // if (!ticketChannel) return;
      // if (!ticketChannel.ticketId) return;
      // if (ticketChannel.channelId !== message.channel.id) return;

      // const attachments = message.attachments.map((attachment) => ({
      //   url: attachment.url,
      //   filename: attachment.name,
      // }));
      // const newMessage = new MessageModel(
      //   message.id,
      //   ticketChannel.ticketId,
      //   attachments,
      //   undefined,
      //   message.guild?.id
      // );

      // await newMessage.save();

      // console.log(`Message from ${message.author.tag} saved to the database.`);
    }
  },
};
