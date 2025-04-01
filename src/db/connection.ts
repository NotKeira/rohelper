import { createPool, Pool } from "mariadb";

class Database {
  private pool: Pool;

  constructor() {
    this.pool = createPool({
      host: "localhost",
      user: "rohelper",
      password: "ETYOrVqAoq",
      database: "rohelper",
      connectionLimit: 5,
    });
  }

  async getConnection(): Promise<any> {
    return await this.pool.getConnection();
  }

  async query(sql: string, values?: any[]): Promise<any> {
    const connection: any = await this.getConnection();
    try {
      const result = await connection.query(sql, values);
      return result;
    } finally {
      connection.release();
    }
  }
}

export const db = new Database();
