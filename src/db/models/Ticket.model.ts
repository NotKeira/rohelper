import { db } from "../connection";
import { MessageModel } from "./Message.model";

export interface Ticket {
  ticketId?: string;
  userId: string;
  serverId: string;
  channelId: string;
  messages?: MessageModel[];
}

export class TicketModel implements Ticket {
  ticketId?: string;
  userId: string;
  serverId: string;
  channelId: string;
  messages?: MessageModel[];

  constructor(
    ticketId: string | undefined,
    userId: string,
    serverId: string,
    channelId: string,
    messages?: MessageModel[]
  ) {
    this.ticketId = ticketId;
    this.userId = userId;
    this.serverId = serverId;
    this.channelId = channelId;
    this.messages = messages;
  }

  static async getByUserId(
    userId: string,
    serverId: string
  ): Promise<TicketModel | null> {
    const result = await db.query(
      "SELECT * FROM tickets WHERE discordId = ? AND serverId = ?",
      [userId, serverId]
    );
    if (result.length === 0) {/*  */
      return null;
    }
    const ticket = result[0];
    const messages = await MessageModel.getByTicketId(ticket.ticketId);
    return new TicketModel(
      ticket.ticketId,
      ticket.userId,
      ticket.serverId,
      ticket.channelId,
      messages
    );
  }

  async save(): Promise<void> {
    if (!this.ticketId) {
      const result = await db.query(
        "INSERT INTO tickets (discordId, serverId, channelId) VALUES (?, ?, ?)",
        [this.userId, this.serverId, this.channelId]
      );
      this.ticketId = result.insertId; // Get the auto-incremented ticketId
    } else {
      await db.query(
        "UPDATE tickets SET discordId = ?, serverId = ?, channelId = ? WHERE ticketId = ?",
        [this.userId, this.serverId, this.channelId, this.ticketId]
      );
    }

    if (this.messages) {
      for (const message of this.messages) {
        await message.save();
      }
    }
  }
}
