import { type IRefreshTokenUsecase } from '../../domain/contracts'
import { ForbiddenError, UnauthorizedError } from '../../domain/errors'
import { type IRefreshTokenResponseDTO } from '../../domain/ports/outbounds'
import { type IUserRepository, type ITokenService } from '../contracts'

export class RefreshTokenUsecase implements IRefreshTokenUsecase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly tokenService: ITokenService
  ) {}

  async execute(
    refreshToken: string
  ): Promise<IRefreshTokenResponseDTO | Error> {
    const isUserIdAuthorized: string =
      await this.tokenService.verifyRefreshToken(refreshToken)

    if (isUserIdAuthorized === 'JsonWebTokenError')
      return new UnauthorizedError('Invalid format token')

    if (isUserIdAuthorized === 'TokenExpiredError')
      return new UnauthorizedError('Expired token')

    const userHasPermission: boolean =
      await this.userRepository.checkRefreshToken(
        isUserIdAuthorized,
        refreshToken
      )

    if (!userHasPermission) return new ForbiddenError('Invalid refresh token')

    const newAccessToken: string =
      await this.tokenService.generateAccessToken(isUserIdAuthorized)

    const newRefreshToken: string =
      await this.tokenService.generateRefreshToken(isUserIdAuthorized)

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken
    }
  }
}
