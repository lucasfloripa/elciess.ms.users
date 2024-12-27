import { MongoClient, type Db, type Collection } from 'mongodb'

export class MongoHelper {
  private static instance: MongoHelper
  private client: MongoClient | null = null
  private db: Db | null = null

  private constructor() {}

  public static getInstance(): MongoHelper {
    if (!MongoHelper.instance) {
      MongoHelper.instance = new MongoHelper()
    }
    return MongoHelper.instance
  }

  async connect(uri: string, dbName: string): Promise<void> {
    try {
      if (!this.client) {
        this.client = new MongoClient(uri, {
          maxPoolSize: 10,
          minPoolSize: 2,
          connectTimeoutMS: 30000,
          socketTimeoutMS: 45000
        })
        await this.client.connect()
        this.db = this.client.db(dbName)
      }
    } catch (error) {
      setTimeout(() => {
        this.connect(uri, dbName).catch(console.error)
      }, 5000)
    }
  }

  async disconnect(): Promise<void> {
    if (this.client) {
      await this.client.close()
      this.client = null
      this.db = null
    }
  }

  async getCollection(name: string): Promise<Collection> {
    if (!this.db) {
      throw new Error('Database not connected')
    }
    return this.db.collection(name)
  }
}
