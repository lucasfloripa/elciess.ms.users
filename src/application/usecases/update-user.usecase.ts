import { type IUpdateUserUsecase } from '../../domain/contracts'
import { EmailInUseError, NotFoundError } from '../../domain/errors'
import { type IUser, type ISanitezedUser } from '../../domain/interfaces'
import { type IUpdateUserRequestDTO } from '../../domain/ports/inbounds'
import { type IUpdateUserResponseDTO } from '../../domain/ports/outbounds'
import { type IUserRepository } from '../contracts'

export class UpdateUserUsecase implements IUpdateUserUsecase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(
    request: IUpdateUserRequestDTO
  ): Promise<IUpdateUserResponseDTO | Error> {
    const userExists: IUser | null = await this.userRepository.getUser({
      email: request.email
    })

    if (userExists) return new EmailInUseError()

    const updatedUser: ISanitezedUser | null =
      await this.userRepository.updateUser(request)

    if (!updatedUser) return new NotFoundError('User not found')

    return { user: updatedUser }
  }
}
