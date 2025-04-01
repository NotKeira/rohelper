import { PortfolioCommand } from "./tags/portfolio";
import { JobCommand } from "./tags/job";
import { ScriptingCommand } from "./tags/scripting";
import { PurposeCommand } from "./tags/purpose";
import { TagsCommand } from "./tags/tags";
import { ChatCommand } from "@/types/ChatCommand";

export const ChatCommands: ChatCommand[] = [
  PortfolioCommand,
  JobCommand,
  ScriptingCommand,
  PurposeCommand,
  TagsCommand,
];
