import { type IAuthTokenUsecase } from '../../domain/contracts'
import { UnauthorizedError } from '../../domain/errors'
import { type IAuthTokenRequestDTO } from '../../domain/ports/inbounds'
import { logError, log } from '../../utils/log'
import {
  type IHttpResponse,
  type IMiddleware,
  htttpResponses
} from '../interfaces'

export class AuthTokenMiddleware implements IMiddleware {
  constructor(private readonly authTokenUsecase: IAuthTokenUsecase) {}

  async handle(request: IAuthTokenRequestDTO): Promise<IHttpResponse> {
    try {
      log('AuthTokenMiddleware request:', request)
      const { accessToken } = request

      if (!accessToken) {
        logError('AuthTokenMiddleware error:', 'Missing accessToken')
        return htttpResponses.http401(
          new UnauthorizedError('Missing accessToken')
        )
      }

      const ucResponse = await this.authTokenUsecase.execute({
        accessToken
      })

      if (ucResponse instanceof UnauthorizedError) {
        logError('AuthTokenMiddleware error:', ucResponse.error)
        return htttpResponses.http401(ucResponse)
      }

      log('AuthTokenMiddleware response:', ucResponse)
      return htttpResponses.http200(ucResponse)
    } catch (error) {
      logError('AuthTokenMiddleware error:', error)
      return htttpResponses.http500(error)
    }
  }
}
