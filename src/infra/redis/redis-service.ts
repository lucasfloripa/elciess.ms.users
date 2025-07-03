import config from 'config'
import { type Redis } from 'ioredis'

import { type ICacheService } from '../../application/contracts'
import { type RedisConfig } from '../../main/interfaces'

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
      if (data === null) {
        return null // Chave não encontrada
      }
      return JSON.parse(data) as T
    } catch (error) {
      console.error(`[RedisCacheService] Error getting key "${key}":`, error)
      return null // Retorna null em caso de erro para não quebrar a aplicação
    }
  }

  async set<T>(key: string, value: T): Promise<boolean> {
    try {
      const stringValue = JSON.stringify(value)
      // Usamos SETEX para definir a chave com um TTL (Time To Live)
      const result = await this.client.setex(
        key,
        this.DEFAULT_CACHE_TTL,
        stringValue
      )
      return result === 'OK'
    } catch (error) {
      console.error(`[RedisCacheService] Error setting key "${key}":`, error)
      return false // Retorna false em caso de erro
    }
  }

  async del(...keys: string[]): Promise<number> {
    if (keys.length === 0) {
      return 0
    }
    try {
      return await this.client.del(...keys)
    } catch (error) {
      console.error(
        `[RedisCacheService] Error deleting keys "${keys.join(', ')}":`,
        error
      )
      return 0 // Retorna 0 em caso de erro
    }
  }

  async clear(): Promise<void> {
    try {
      await this.client.flushdb() // Cuidado! Isso apaga TODO o banco de dados Redis atual.
      console.log('[RedisCacheService] All cache cleared.')
    } catch (error) {
      console.error('[RedisCacheService] Error clearing cache:', error)
    }
  }
}
