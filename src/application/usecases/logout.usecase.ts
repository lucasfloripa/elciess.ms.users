import { type ILogoutUsecase } from '../../domain/contracts'
import { UserEnums } from '../../domain/enums'
import { NotFoundError } from '../../domain/errors'
import { type ILogoutResponseDTO } from '../../domain/ports/outbounds'
import { type IUserRepository } from '../contracts'

export class LogoutUsecase implements ILogoutUsecase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(userId: string): Promise<ILogoutResponseDTO | Error> {
    const didUserLogout: UserEnums = await this.userRepository.logout(userId)

    if (didUserLogout === UserEnums.USER_NOT_FOUND)
      return new NotFoundError('User not found')

    if (didUserLogout === UserEnums.ALREADY_LOGGED_OUT)
      return { message: 'User was already logged out.' }

    return { message: 'User logged out' }
  }
}
