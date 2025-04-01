import { Message } from "discord.js";

export class PortfolioCommand {
  public static readonly name: string = "portfolio";
  public static readonly description: string =
    "Tag for portfolio-related messages";
  public static readonly options: any[] = [];
  constructor() {}

  public static async execute(message: Message): Promise<void> {
    const response =
      "Go to <#792658203359707156> and use </post portfolio:1353425973810429965> or check <#1282406149307764736>.";
    if (message.reference?.messageId) {
      const referencedMessage = await message.channel.messages.fetch(
        message.reference.messageId
      );
      await referencedMessage.reply(response);
    } else {
      await message.reply(response);
    }
  }
}
