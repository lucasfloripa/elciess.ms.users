import { type IUpdateUserPasswordUsecase } from '../../domain/contracts'
import { UserEnums } from '../../domain/enums'
import { ConflictError, NotFoundError } from '../../domain/errors'
import { type IUpdateUserPasswordDTO } from '../../domain/ports/inbounds'
import { type IUpdateUserPasswordResponseDTO } from '../../domain/ports/outbounds'
import { Password } from '../../domain/value-objects'
import { type IUserRepository } from '../contracts'

export class UpdateUserPasswordUsecase implements IUpdateUserPasswordUsecase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(
    data: IUpdateUserPasswordDTO
  ): Promise<IUpdateUserPasswordResponseDTO | Error> {
    const { userId, password, newPassword } = data

    if (password === newPassword)
      return new ConflictError('Actual password equals newPassword')

    const hashedPassword = await Password.create(password)

    const updatePasswordCheck = await this.userRepository.updateUserPassword(
      userId,
      hashedPassword.value()
    )

    if (updatePasswordCheck === UserEnums.USER_NOT_FOUND)
      return new NotFoundError('User not found')

    return { message: 'Password has updated' }
  }
}
