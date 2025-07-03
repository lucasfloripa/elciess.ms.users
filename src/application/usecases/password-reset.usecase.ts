import { type IPasswordResetUsecase } from '../../domain/contracts'
import { NotFoundError } from '../../domain/errors'
import { type IUser } from '../../domain/interfaces'
import { type IPasswordResetResponseDTO } from '../../domain/ports/outbounds'
import { type IMessagerService, type IUserRepository } from '../contracts'

export class PasswordResetUsecase implements IPasswordResetUsecase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly messagerService: IMessagerService
  ) {}

  async execute(email: string): Promise<IPasswordResetResponseDTO | Error> {
    const dbUser: IUser | null = await this.userRepository.getUser({
      email
    })

    if (!dbUser) return new NotFoundError('User not found')

    await this.messagerService.sendMessage(
      'user.notifications',
      'user.password_reset',
      email
    )

    return { message: 'Passord reseted' }
  }
}
