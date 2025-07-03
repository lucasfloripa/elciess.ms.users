// src/infra/redis/redis-helper.ts
import config from 'config'
import Redis, { type RedisOptions } from 'ioredis'

import { type RedisConfig } from '../../main/interfaces'

export class RedisHelper {
  private static instance: RedisHelper
  private readonly client: Redis

  private constructor() {
    const redisConfig = config.get<RedisConfig>('redisConfig')
    const options: RedisOptions = {
      host: redisConfig.redisHost,
      port: Number(redisConfig.redisPort),
      password: redisConfig.redisPassword,
      db: Number(redisConfig.redisDb),
      retryStrategy: (times) => Math.min(times * 50, 2000)
    }

    this.client = new Redis(options)

    this.client.on('error', (err) => {
      console.error('❌ Redis error', err)
    })
  }

  public static getInstance(): RedisHelper {
    if (!RedisHelper.instance) {
      RedisHelper.instance = new RedisHelper()
    }
    return RedisHelper.instance
  }

  public getClient(): Redis {
    return this.client
  }

  public async disconnect(): Promise<void> {
    await this.client.quit()
    console.log('🛑 Redis disconnected')
  }
}
