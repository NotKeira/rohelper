export interface Embed {
  title: string;
  description: string;
  color: string;
}

export class EmbedModel implements Embed {
  title: string;
  description: string;
  color: string;

  constructor({
    title,
    description,
    color,
  }: {
    title: string;
    description: string;
    color: string;
  }) {
    this.title = title;
    this.description = description;
    this.color = color;
  }
}
