import { Command } from "@/types";

import { StatsCommand } from "./Info/stats";
// import { CreateCommand } from "./Tickets/create";
import { PostCommand } from "./Posts/post";
import { ExecCommand } from "./Info/exec";
import { ServerInfoCommand } from "./Info/serverinfo";

export const Commands: { [key: string]: Command } = {
  StatsCommand,
  // CreateCommand,
  PostCommand,
  ExecCommand,
  ServerInfoCommand,
};
