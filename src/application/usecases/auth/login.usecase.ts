import {
  type ICacheService,
  type ITokenService,
  type IUserRepository
} from '@/application/contracts'
import { type ILogger, type ILoginUsecase } from '@/domain/contracts'
import { ForbiddenError, UnauthorizedError } from '@/domain/errors'
import { type IUser } from '@/domain/interfaces/user.interfaces'
import { type ILoginRequestDTO } from '@/domain/ports/inbounds'
import { type ILoginResponseDTO } from '@/domain/ports/outbounds'
import { Password } from '@/domain/value-objects'

export class LoginUsecase implements ILoginUsecase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly tokenService: ITokenService,
    private readonly cacheService: ICacheService,
    private readonly logger: ILogger
  ) {}

  SEVEN_DAYS_IN_SECONDS = 7 * 24 * 60 * 60

  async execute(
    requestDTO: ILoginRequestDTO
  ): Promise<ILoginResponseDTO | Error> {
    this.logger.info('Init LoginUsecase')

    const { email, password } = requestDTO

    this.logger.debug('LoginUsecase: Checking if user exists', {
      email
    })
    const userExists: IUser | null = await this.userRepository.getUser({
      email
    })
    if (!userExists) {
      this.logger.warn('LoginUsecase: User not found')
      return new UnauthorizedError('User not found')
    }

    this.logger.debug('LoginUsecase: Comparing passwords', {
      password,
      confirmPassword: userExists.password
    })
    const passwordMatch: boolean = await Password.comparePassword(
      password,
      userExists.password
    )
    if (!passwordMatch) {
      this.logger.warn('LoginUsecase: Invalid password provided')
      return new ForbiddenError('Invalid password')
    }

    this.logger.debug('LoginUsecase: Generating access token', {
      userId: userExists.userId
    })
    const accessToken: string = await this.tokenService.generateAccessToken({
      userId: userExists.userId,
      role: userExists.role
    })

    this.logger.debug('LoginUsecase: Generating refresh token', {
      userId: userExists.userId
    })
    const refreshToken: string = await this.tokenService.generateRefreshToken({
      userId: userExists.userId,
      role: userExists.role
    })

    this.logger.debug('LoginUsecase: Caching refresh token', {
      userId: userExists.userId,
      refreshToken
    })
    await this.cacheService.set(
      `refreshToken:${userExists.userId}`,
      refreshToken,
      this.SEVEN_DAYS_IN_SECONDS
    )

    this.logger.info('Completed LoginUsecase')
    this.logger.debug('LoginUsecase response', {
      userId: userExists.userId,
      hasAccessToken: !!accessToken,
      hasRefreshToken: !!refreshToken
    })
    return {
      accessToken,
      refreshTokenCookie: {
        value: refreshToken,
        maxAge: this.SEVEN_DAYS_IN_SECONDS
      }
    }
  }
}
