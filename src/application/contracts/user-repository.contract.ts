import {
  type ISanitezedUser,
  type IUser
} from '../../domain/interfaces/user.interfaces'

export interface IUserRepository {
  save: (user: IUser) => Promise<void>
  getUser: (filters: Partial<IUser>) => Promise<IUser | null>
  updateUser: (
    fields: Partial<ISanitezedUser>
  ) => Promise<ISanitezedUser | null>
  saveRefreshToken: (userId: string, token: string) => Promise<void>
  checkRefreshToken: (userId: string, token: string) => Promise<boolean>
}
