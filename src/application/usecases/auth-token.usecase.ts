import { type IAuthTokenUsecase } from '../../domain/contracts'
import { UnauthorizedError } from '../../domain/errors'
import { type IUserTokenInfos } from '../../domain/interfaces'
import { type IAuthTokenRequestDTO } from '../../domain/ports/inbounds'
import { type IAuthTokenResponseDTO } from '../../domain/ports/outbounds'
import { type ITokenService } from '../contracts'

export class AuthTokenUsecase implements IAuthTokenUsecase {
  constructor(private readonly tokenService: ITokenService) {}

  async execute(
    request: IAuthTokenRequestDTO
  ): Promise<IAuthTokenResponseDTO | Error> {
    const { accessToken } = request

    const userTokenInfos: IUserTokenInfos | string =
      await this.tokenService.verifyAccessToken(accessToken)

    if (userTokenInfos === 'JsonWebTokenError')
      return new UnauthorizedError('Invalid format token')

    if (userTokenInfos === 'TokenExpiredError')
      return new UnauthorizedError('Expired token')

    const payload = userTokenInfos as IUserTokenInfos

    return {
      userId: payload.userId,
      role: payload.role
    }
  }
}
