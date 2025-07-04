import { type UserEnums } from '@/domain/enums'
import { type IUser } from '@/domain/interfaces'

export interface IUserRepository {
  save: (user: IUser) => Promise<void>
  getUser: (filters: Partial<IUser>) => Promise<IUser | null>
  getUsers: () => Promise<IUser[] | null>
  deleteUser: (userId: string) => Promise<boolean>
  updateUserPassword: (
    userId: string,
    newPassword: string
  ) => Promise<UserEnums>
  logout: (userId: string) => Promise<UserEnums>
  saveRefreshToken: (userId: string, token: string) => Promise<void>
}
