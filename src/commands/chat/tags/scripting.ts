import { Message } from "discord.js";

export class ScriptingCommand {
  public static readonly name: string = "scripting";
  public static readonly aliases: string[] = [
    "code",
    "program",
    "lua",
    "roblox",
    "script",
  ];
  public static readonly description: string =
    "Tag for scripting-related discussions";
  public static readonly options: any[] = [];
  constructor() {}

  public static async execute(message: Message): Promise<void> {
    const response =
      "Please visit <#1087989695234969633> for scripting-related discussions.";
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
