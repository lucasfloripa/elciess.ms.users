import { type IUpdateUserUsecase } from '../../domain/contracts'
import { NotFoundError } from '../../domain/errors'
import { type ISanitezedUser } from '../../domain/interfaces'
import { type IUpdateUserRequestDTO } from '../../domain/ports/inbounds'
import { type IUpdateUserResponseDTO } from '../../domain/ports/outbounds'
import { type IUserRepository } from '../contracts'

export class UpdateUserUsecase implements IUpdateUserUsecase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(
    request: IUpdateUserRequestDTO
  ): Promise<IUpdateUserResponseDTO | Error> {
    const updatedUser: ISanitezedUser | null =
      await this.userRepository.updateUser(request)

    if (!updatedUser) return new NotFoundError('User not found')

    return { user: updatedUser }
  }
}
