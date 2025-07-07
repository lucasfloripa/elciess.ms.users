import { type ITokenService } from '@/application/contracts'
import { type IRefreshTokenUsecase, type ILogger } from '@/domain/contracts'
import { UnauthorizedError } from '@/domain/errors'
import { type IUserTokenInfos } from '@/domain/interfaces'
import { type IRefreshTokenResponseDTO } from '@/domain/ports/outbounds'

export class RefreshTokenUsecase implements IRefreshTokenUsecase {
  constructor(
    private readonly tokenService: ITokenService,
    private readonly logger: ILogger
  ) {}

  async execute(
    refreshToken: string
  ): Promise<IRefreshTokenResponseDTO | Error> {
    this.logger.info('Init RefreshTokenUsecase')
    this.logger.debug('RefreshTokenUsecase: Attempting to refresh token')

    const userTokenInfos: IUserTokenInfos | string =
      await this.tokenService.verifyRefreshToken(refreshToken)

    if (userTokenInfos === 'JsonWebTokenError') {
      this.logger.warn('RefreshTokenUsecase: Invalid refresh token format')
      return new UnauthorizedError('Invalid format token')
    }

    if (userTokenInfos === 'TokenExpiredError') {
      this.logger.warn('RefreshTokenUsecase: Expired refresh token')
      return new UnauthorizedError('Expired token')
    }

    const payload = userTokenInfos as IUserTokenInfos
    this.logger.debug('RefreshTokenUsecase: Token payload extracted', {
      userId: payload.userId,
      role: payload.role
    })

    this.logger.debug('RefreshTokenUsecase: Generating new access token')
    const newAccessToken =
      await this.tokenService.generateAccessToken<IUserTokenInfos>(payload)

    this.logger.debug('RefreshTokenUsecase: Generating new refresh token')
    const newRefreshToken =
      await this.tokenService.generateRefreshToken<IUserTokenInfos>(payload)

    this.logger.info('Completed RefreshTokenUsecase')
    this.logger.debug('RefreshTokenUsecase response', {
      userId: payload.userId,
      hasNewAccessToken: !!newAccessToken,
      hasNewRefreshToken: !!newRefreshToken
    })
    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken
    }
  }
}
