export interface Attachment {
  url: string;
  filename: string;
}

export class AttachmentModel implements Attachment {
  url: string;
  filename: string;

  constructor({ url, filename }: { url: string; filename: string }) {
    this.url = url;
    this.filename = filename;
  }
}
