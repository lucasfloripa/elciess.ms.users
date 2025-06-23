import { type LogoutStatus } from '../../domain/enums'
import {
  type ISanitezedUser,
  type IUser
} from '../../domain/interfaces/user.interfaces'

export interface IUserRepository {
  save: (user: IUser) => Promise<void>
  getUser: (filters: Partial<IUser>) => Promise<IUser | null>
  getUsers: () => Promise<IUser[] | null>
  deleteUser: (userId: string) => Promise<boolean>
  updateUser: (
    fields: Partial<ISanitezedUser>
  ) => Promise<ISanitezedUser | null>
  logout: (userId: string) => Promise<LogoutStatus>
  saveRefreshToken: (userId: string, token: string) => Promise<void>
  checkRefreshToken: (userId: string, token: string) => Promise<boolean>
}
