import { db } from "../connection";
import { Post, PostInformation } from "@/types/Post";

export class PostModel implements Post {
  id: string;
  subcommand: string;
  information: PostInformation;
  status: "pending" | "approved" | "rejected";
  staffPostId?: string;

  constructor(
    id: string,
    subcommand: string,
    information: PostInformation,
    status: "pending" | "approved" | "rejected",
    staffPostId?: string
  ) {
    this.id = id;
    this.subcommand = subcommand;
    this.information = information;
    this.status = status;
    this.staffPostId = staffPostId;
  }

  static async getPendingPosts(): Promise<PostModel[]> {
    const result = await db.query(
      "SELECT * FROM posts WHERE status = 'pending'"
    );
    return result.map((post: any) => {
      try {
        const parsedInformation =
          typeof post.information === "string"
            ? JSON.parse(post.information)
            : post.information;
        return new PostModel(
          post.id,
          post.subcommand,
          parsedInformation,
          post.status,
          post.staffPostId
        );
      } catch (error) {
        console.error(
          `Failed to parse information for post ID ${post.id}:`,
          post.information,
          error
        );
        throw new SyntaxError(
          `Invalid JSON in the \"information\" field for post ID ${post.id}`
        );
      }
    });
  }
  static async getById(id: string): Promise<PostModel | null> {
    const result = await db.query("SELECT * FROM posts WHERE id = ?", [id]);
    if (result.length === 0) {
      return null;
    }
    const post = result[0];
    try {
      const parsedInformation =
        typeof post.information === "string"
          ? JSON.parse(post.information)
          : post.information;
      return new PostModel(
        post.id,
        post.subcommand,
        parsedInformation,
        post.status,
        post.staffPostId
      );
    } catch (error) {
      console.error(
        `Failed to parse information for post ID ${post.id}:`,
        post.information,
        error
      );
      throw new SyntaxError(
        `Invalid JSON in the \"information\" field for post ID ${post.id}`
      );
    }
  }

  async save(): Promise<void> {
    try {
      const serializedInformation = JSON.stringify(this.information);
      const existingPost = await db.query("SELECT * FROM posts WHERE id = ?", [
        this.id,
      ]);
      if (existingPost.length === 0) {
        await db.query(
          "INSERT INTO posts (id, subcommand, information, status, staffPostId) VALUES (?, ?, ?, ?, ?)",
          [
            this.id,
            this.subcommand,
            serializedInformation,
            this.status,
            this.staffPostId,
          ]
        );
      } else {
        await db.query(
          "UPDATE posts SET subcommand = ?, information = ?, status = ?, staffPostId = ? WHERE id = ?",
          [
            this.subcommand,
            serializedInformation,
            this.status,
            this.staffPostId,
            this.id,
          ]
        );
      }
    } catch (error) {
      console.error(`Failed to save post ID ${this.id}:`, error);
      throw error;
    }
  }
}
