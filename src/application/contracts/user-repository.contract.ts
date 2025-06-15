import { type DbUser } from '../../domain/ports/outbounds'

export interface IUserRepository {
  save: (user: DbUser) => Promise<void>
  loadByEmail: (email: string) => Promise<DbUser | null>
  saveRefreshToken: (userId: string, token: string) => Promise<void>
}
