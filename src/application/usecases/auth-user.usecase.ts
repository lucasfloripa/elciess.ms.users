import { type IAuthUserUsecase } from '../../domain/contracts'
import { ForbiddenError, UnauthorizedError } from '../../domain/errors'
import { type IUser } from '../../domain/interfaces/user.interfaces'
import { type IUserCredentialsDTO } from '../../domain/ports/inbounds'
import { type IAuthUserResponseDTO } from '../../domain/ports/outbounds'
import { Password } from '../../domain/value-objects'
import { type ITokenService, type IUserRepository } from '../contracts'

export class AuthUserUsecase implements IAuthUserUsecase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly tokenService: ITokenService
  ) {}

  async execute(
    credentials: IUserCredentialsDTO
  ): Promise<IAuthUserResponseDTO | Error> {
    const { email, password } = credentials

    const userExists: IUser | null = await this.userRepository.getUser({
      email
    })
    if (!userExists) return new UnauthorizedError('User not found')

    const passwordMatch: boolean = await Password.comparePassword(
      password,
      userExists.password
    )
    if (!passwordMatch) return new ForbiddenError('Invalid password')

    const accessToken: string = await this.tokenService.generateAccessToken(
      userExists.userId
    )
    const refreshToken: string = await this.tokenService.generateRefreshToken(
      userExists.userId
    )

    await this.userRepository.saveRefreshToken(userExists.userId, refreshToken)
    return { accessToken, refreshToken }
  }
}
