import { Client } from 'pg'

export const PostgresHelper = {
  client: null as unknown as Client,
  async connect (): Promise<void> {
    this.client = new Client({
      host: process.env.POSTGRES_HOST,
      port: Number(process.env.POSTGRES_PORT),
      database: process.env.POSTGRES_DB,
      user: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD
    })
    this.client.connect()
  },
  async disconnect (): Promise<void> {
    await this.client.end()
    this.client = null
  },
  async query (query: string, params?: any): Promise<any> {
    if (this.client === null) this.connect()
    return this.client.query(query, params)
  }
}
