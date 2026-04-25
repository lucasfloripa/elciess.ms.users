import { MongoClient, type Db, type Collection } from 'mongodb'

export class MongoHelper {
  private static instance: MongoHelper

  private client: MongoClient | null = null
  private db: Db | null = null
  private connecting: boolean = false

  private constructor() {}

  public static getInstance(): MongoHelper {
    if (!MongoHelper.instance) {
      MongoHelper.instance = new MongoHelper()
    }
    return MongoHelper.instance
  }

  public async connect(uri: string, dbName: string): Promise<void> {
    // já conectado → não faz nada
    if (this.client && this.db) return

    // evita múltiplas conexões simultâneas
    if (this.connecting) return

    this.connecting = true

    try {
      const client = new MongoClient(uri, {
        maxPoolSize: 10,
        minPoolSize: 2,
        connectTimeoutMS: 5000,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 20000
      })

      await client.connect()

      this.client = client
      this.db = client.db(dbName)

      console.log('✅ Mongo conectado com sucesso')
    } catch (error) {
      console.error('❌ Erro ao conectar no MongoDB:', error)

      // garante que estado não fica quebrado
      this.client = null
      this.db = null

      throw error
    } finally {
      this.connecting = false
    }
  }

  public async disconnect(): Promise<void> {
    if (!this.client) return

    try {
      await this.client.close()
      console.log('🔌 Mongo desconectado')
    } catch (error) {
      console.error('Erro ao desconectar Mongo:', error)
    } finally {
      this.client = null
      this.db = null
    }
  }

  public getDb(): Db {
    if (!this.db) {
      throw new Error('Database not connected')
    }
    return this.db
  }

  public getCollection<T extends Document = any>(name: string): Collection<T> {
    if (!this.db) {
      throw new Error('Database not connected')
    }
    return this.db.collection<T>(name)
  }
}
