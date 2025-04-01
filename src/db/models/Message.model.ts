import { db } from "../connection";
import { AttachmentModel } from "./Attachment.model";
import { EmbedModel } from "./Embed.model";

export interface Message {
  messageId: string;
  ticketId: string;
  attachments?: AttachmentModel[];
  embeds?: EmbedModel[];
  serverId?: string; // Add serverId
}

export class MessageModel implements Message {
  messageId: string;
  ticketId: string;
  attachments?: AttachmentModel[];
  embeds?: EmbedModel[];
  serverId?: string; // Add serverId

  constructor(
    messageId: string,
    ticketId: string,
    attachments?: AttachmentModel[],
    embeds?: EmbedModel[],
    serverId?: string // Add serverId
  ) {
    this.messageId = messageId;
    this.ticketId = ticketId;
    this.attachments = attachments;
    this.embeds = embeds;
    this.serverId = serverId; // Add serverId
  }

  static async getByTicketId(ticketId: string): Promise<MessageModel[]> {
    const result = await db.query("SELECT * FROM messages WHERE ticketId = ?", [
      ticketId,
    ]);
    return result.map(
      (row: {
        messageId: string;
        ticketId: string;
        attachments?: string;
        embeds?: string;
        serverId?: string; // Add serverId
      }) => {
        const { messageId, attachments, embeds, serverId } = row;
        return new MessageModel(
          messageId,
          ticketId,
          attachments
            ? JSON.parse(attachments).map((a: any) => new AttachmentModel(a))
            : [],
          embeds ? JSON.parse(embeds).map((e: any) => new EmbedModel(e)) : [],
          serverId // Add serverId
        );
      }
    );
  }

  async save(): Promise<void> {
    const messageSearch = await db.query(
      "SELECT * FROM messages WHERE messageId = ?",
      [this.messageId]
    );
    if (messageSearch.length === 0) {
      await db.query(
        "INSERT INTO messages (messageId, ticketId, attachments, embeds, serverId) VALUES (?, ?, ?, ?, ?)",
        [
          this.messageId,
          this.ticketId,
          JSON.stringify(this.attachments),
          JSON.stringify(this.embeds),
          this.serverId, // Add serverId
        ]
      );
    } else {
      await db.query(
        "UPDATE messages SET ticketId = ?, attachments = ?, embeds = ?, serverId = ? WHERE messageId = ?",
        [
          this.ticketId,
          JSON.stringify(this.attachments),
          JSON.stringify(this.embeds),
          this.serverId, // Add serverId
          this.messageId,
        ]
      );
    }
  }
}
