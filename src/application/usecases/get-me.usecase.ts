import { type IGetMeUsecase } from '../../domain/contracts'
import { NotFoundError } from '../../domain/errors'
import {
  type ISanitezedUser,
  type IUser
} from '../../domain/interfaces/user.interfaces'
import { type IGetMeResponseDTO } from '../../domain/ports/outbounds'
import { type IUserRepository } from '../contracts'

export class GetMeUsecase implements IGetMeUsecase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(userId: string): Promise<IGetMeResponseDTO | Error> {
    const dbUser: IUser | null = await this.userRepository.getUser({ userId })

    if (!dbUser) return new NotFoundError('User not found')

    const { password, ...sanitezedUser } = dbUser

    const user: ISanitezedUser = sanitezedUser

    return { user }
  }
}
