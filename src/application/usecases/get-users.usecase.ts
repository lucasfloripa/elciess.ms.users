import { type IUserRepository } from '@/application/contracts'
import { type IGetUsersUsecase } from '@/domain/contracts'
import { NotFoundError } from '@/domain/errors'
import {
  type ISanitezedUser,
  type IUser
} from '@/domain/interfaces/user.interfaces'
import { type IGetUsersResponseDTO } from '@/domain/ports/outbounds'

export class GetUsersUsecase implements IGetUsersUsecase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(): Promise<IGetUsersResponseDTO | Error> {
    const dbUsers: IUser[] | null = await this.userRepository.getUsers()

    if (!dbUsers) return new NotFoundError('No user found')

    const users: ISanitezedUser[] = dbUsers.map((dbUser: IUser) => ({
      userId: dbUser.userId,
      email: dbUser.email,
      refreshToken: dbUser.refreshToken,
      role: dbUser.role
    }))

    return { users }
  }
}
