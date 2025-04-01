import { db } from "../connection";

export interface User {
  discordId: string;
}

export class UserModel implements User {
  discordId: string;

  constructor(discordId: string) {
    this.discordId = discordId;
  }

  static async getOne(key: string, value: any): Promise<UserModel | null> {
    const result = await db.query(`SELECT * FROM accounts WHERE ${key} = ?`, [
      value,
    ]);
    if (result.length === 0) {
      return null;
    }
    const { discordId } = result[0];
    return new UserModel(discordId);
  }

  static async getAll(): Promise<UserModel[]> {
    const result = await db.query("SELECT * FROM accounts");
    return result.map((row: { discordId: string }) => {
      const { discordId } = row;
      return new UserModel(discordId);
    });
  }

  async save(): Promise<void> {
    const discordSearch = await db.query(
      "SELECT * FROM accounts WHERE discordId = ?",
      [this.discordId]
    );
    if (discordSearch.length === 0) {
      const result = await db.query(
        "INSERT INTO accounts (discordId) VALUES (?, ?)",
        [this.discordId]
      );
      return result;
    } else {
      const id = discordSearch[0].id;
      await db.query("UPDATE accounts SET discordId = ? WHERE id = ?", [
        this.discordId,
        id,
      ]);
    }
  }
}
