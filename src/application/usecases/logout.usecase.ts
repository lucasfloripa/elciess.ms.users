import { type ILogoutUsecase } from '../../domain/contracts'
import { LogoutStatus } from '../../domain/enums'
import { NotFoundError } from '../../domain/errors'
import { type ILogoutResponseDTO } from '../../domain/ports/outbounds'
import { type IUserRepository } from '../contracts'

export class LogoutUsecase implements ILogoutUsecase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(userId: string): Promise<ILogoutResponseDTO | Error> {
    const logoutCheck: LogoutStatus = await this.userRepository.logout(userId)

    if (logoutCheck === LogoutStatus.USER_NOT_FOUND)
      return new NotFoundError('User not found')

    if (logoutCheck === LogoutStatus.ALREADY_LOGGED_OUT)
      return { message: 'User was already logged out.' }

    return { message: 'User logged out' }
  }
}
