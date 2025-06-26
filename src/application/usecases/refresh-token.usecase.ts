import { type IRefreshTokenUsecase } from '../../domain/contracts'
import { UnauthorizedError } from '../../domain/errors'
import { type IUserTokenInfos } from '../../domain/interfaces'
import { type IRefreshTokenResponseDTO } from '../../domain/ports/outbounds'
import { type ITokenService } from '../contracts'

export class RefreshTokenUsecase implements IRefreshTokenUsecase {
  constructor(private readonly tokenService: ITokenService) {}

  async execute(
    refreshToken: string
  ): Promise<IRefreshTokenResponseDTO | Error> {
    const userTokenInfos: IUserTokenInfos | string =
      await this.tokenService.verifyRefreshToken(refreshToken)
    if (userTokenInfos === 'JsonWebTokenError')
      return new UnauthorizedError('Invalid format token')

    if (userTokenInfos === 'TokenExpiredError')
      return new UnauthorizedError('Expired token')

    const payload = userTokenInfos as IUserTokenInfos

    const newAccessToken =
      await this.tokenService.generateAccessToken<IUserTokenInfos>(payload)

    const newRefreshToken =
      await this.tokenService.generateRefreshToken<IUserTokenInfos>(payload)

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken
    }
  }
}
