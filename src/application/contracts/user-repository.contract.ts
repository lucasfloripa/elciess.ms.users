import { type User } from '../../domain/entities'

export interface IUserRepository {
  save: (user: User) => Promise<void>
  loadByEmail: (email: string) => Promise<User | null>
}
