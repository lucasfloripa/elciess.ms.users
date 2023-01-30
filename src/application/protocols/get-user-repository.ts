import { User } from 'domain/models'

export interface GetUserRepository {
  get: (userId: string) => Promise<User | null>
}
