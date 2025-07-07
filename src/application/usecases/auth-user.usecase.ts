import {
  type ITokenService,
  type IUserRepository
} from '@/application/contracts'
import { type ILogger, type IAuthUserUsecase } from '@/domain/contracts'
import { ForbiddenError, UnauthorizedError } from '@/domain/errors'
import { type IUser } from '@/domain/interfaces/user.interfaces'
import { type IAuthUserRequestDTO } from '@/domain/ports/inbounds'
import { type IAuthUserResponseDTO } from '@/domain/ports/outbounds'
import { Password } from '@/domain/value-objects'

export class AuthUserUsecase implements IAuthUserUsecase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly tokenService: ITokenService,
    private readonly logger: ILogger
  ) {}

  async execute(
    request: IAuthUserRequestDTO
  ): Promise<IAuthUserResponseDTO | Error> {
    this.logger.info('Init AuthUserUsecase')
    this.logger.debug('AuthUserUsecase request', { email: request.email })

    const { email, password } = request

    this.logger.debug('AuthUserUsecase: Checking if user exists', {
      email
    })
    const userExists: IUser | null = await this.userRepository.getUser({
      email
    })
    if (!userExists) {
      this.logger.warn('AuthUserUsecase: User not found')
      return new UnauthorizedError('User not found')
    }

    this.logger.debug('AuthUserUsecase: Comparing passwords', {
      password,
      confirmPassword: userExists.password
    })
    const passwordMatch: boolean = await Password.comparePassword(
      password,
      userExists.password
    )
    if (!passwordMatch) {
      this.logger.warn('AuthUserUsecase: Invalid password provided')
      return new ForbiddenError('Invalid password')
    }

    this.logger.debug('AuthUserUsecase: Generating access token', {
      userId: userExists.userId
    })
    const accessToken: string = await this.tokenService.generateAccessToken({
      userId: userExists.userId,
      role: userExists.role
    })

    this.logger.debug('AuthUserUsecase: Generating refresh token', {
      userId: userExists.userId
    })
    const refreshToken: string = await this.tokenService.generateRefreshToken({
      userId: userExists.userId,
      role: userExists.role
    })

    this.logger.debug('AuthUserUsecase: Saving refresh token', {
      refreshToken
    })
    await this.userRepository.saveRefreshToken(userExists.userId, refreshToken)

    this.logger.info('Completed AuthUserUsecase')
    this.logger.debug('AuthUserUsecase response', {
      userId: userExists.userId,
      hasAccessToken: !!accessToken,
      hasRefreshToken: !!refreshToken
    })
    return { accessToken, refreshToken }
  }
}
