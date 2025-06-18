import { type IUpdateUserUsecase } from '../../domain/contracts'
import { NotFoundError } from '../../domain/errors'
import { type IUpdateUserDTO } from '../../domain/ports/inbounds'
import { type IUpdateUserResponseDTO } from '../../domain/ports/outbounds'
import { type IUserRepository } from '../contracts'

export class UpdateUserUsecase implements IUpdateUserUsecase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(
    updateUserData: IUpdateUserDTO
  ): Promise<IUpdateUserResponseDTO | Error> {
    const updatedUser = await this.userRepository.updateUser(updateUserData)

    if (!updatedUser) return new NotFoundError('User not found')

    return { user: updatedUser }
  }
}
