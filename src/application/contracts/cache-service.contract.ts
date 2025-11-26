export interface ICacheService {
  get: <T>(key: string) => Promise<T | null>
  set: <T>(key: string, value: T, ttl: number) => Promise<boolean>
  del: (...keys: string[]) => Promise<number>
  clear: () => Promise<void>
}
