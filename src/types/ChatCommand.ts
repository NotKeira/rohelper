import { Message } from "discord.js";

export type ChatCommand = {
    name: string;
    aliases?: string[];
    description: string;
    options?: any[];
    execute(message: Message): Promise<void>;
    };