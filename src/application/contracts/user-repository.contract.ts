import { type IUser } from '../../domain/ports/outbounds'

export interface IUserRepository {
  save: (user: IUser) => Promise<void>
  loadByEmail: (email: string) => Promise<IUser | null>
  saveRefreshToken: (userId: string, token: string) => Promise<void>
  checkRefreshToken: (userId: string, token: string) => Promise<boolean>
}
