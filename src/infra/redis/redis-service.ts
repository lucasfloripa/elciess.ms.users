import config from 'config'
import { type Redis } from 'ioredis'

import { type ICacheService } from '@/application/contracts'
import { type RedisConfig } from '@/main/interfaces'

import { RedisHelper } from './redis-helper'

export class RedisService implements ICacheService {
  private readonly client: Redis
  private readonly DEFAULT_CACHE_TTL: number

  constructor() {
    this.client = RedisHelper.getInstance().getClient()
    const redisConfig = config.get<RedisConfig>('redisConfig')
    this.DEFAULT_CACHE_TTL = redisConfig.redisTtl
  }

  async get<T>(key: string): Promise<T | null> {
    try {
      const data = await this.client.get(key)
      if (data === null) return null
      return JSON.parse(data) as T
    } catch (error) {
      console.error('Erro no get do redis rabbitmq', error)
      return null
    }
  }

  async set<T>(key: string, value: T): Promise<boolean> {
    try {
      const stringValue = JSON.stringify(value)
      const result = await this.client.setex(
        key,
        this.DEFAULT_CACHE_TTL,
        stringValue
      )
      return result === 'OK'
    } catch (error) {
      console.error('Erro no set do redis rabbitmq', error)
      return false
    }
  }

  async del(...keys: string[]): Promise<number> {
    if (keys.length === 0) {
      return 0
    }
    try {
      return await this.client.del(...keys)
    } catch (error) {
      console.error('Erro no delete do redis rabbitmq', error)
      return 0
    }
  }

  async clear(): Promise<void> {
    await this.client.flushdb()
  }
}
