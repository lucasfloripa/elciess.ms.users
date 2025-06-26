import { type IGetUserUsecase } from '../../domain/contracts'
import { NotFoundError } from '../../domain/errors'
import {
  type ISanitezedUser,
  type IUser
} from '../../domain/interfaces/user.interfaces'
import { type IGetUserRequestDTO } from '../../domain/ports/inbounds'
import { type IGetUserResponseDTO } from '../../domain/ports/outbounds'
import { type IUserRepository } from '../contracts'

export class GetUserUsecase implements IGetUserUsecase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(
    request: IGetUserRequestDTO
  ): Promise<IGetUserResponseDTO | Error> {
    const dbUser: IUser | null = await this.userRepository.getUser({
      userId: request.id
    })

    if (!dbUser) return new NotFoundError('User not found')

    const { password, ...sanitezedUser } = dbUser

    const user: ISanitezedUser = sanitezedUser

    return { user }
  }
}
