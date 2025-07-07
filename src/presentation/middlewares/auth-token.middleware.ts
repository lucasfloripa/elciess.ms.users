import { type ILogger, type IAuthTokenUsecase } from '@/domain/contracts'
import { UnauthorizedError } from '@/domain/errors'
import { type IAuthTokenRequestDTO } from '@/domain/ports/inbounds'
import {
  type IHttpResponse,
  type IMiddleware,
  httpResponses
} from '@/presentation/interfaces'

export class AuthTokenMiddleware implements IMiddleware {
  constructor(
    private readonly authTokenUsecase: IAuthTokenUsecase,
    private readonly logger: ILogger
  ) {}

  async handle(request: IAuthTokenRequestDTO): Promise<IHttpResponse> {
    try {
      this.logger.info('Init AuthTokenMiddleware')
      this.logger.debug('AuthTokenMiddleware request:', request)
      const { accessToken } = request

      if (!accessToken) {
        this.logger.warn('AuthTokenMiddleware error:', {
          message: 'Missing accessToken'
        })
        return httpResponses.http401(
          new UnauthorizedError('Missing accessToken')
        )
      }

      const ucResponse = await this.authTokenUsecase.execute({
        accessToken
      })

      if (ucResponse instanceof UnauthorizedError) {
        this.logger.warn('AuthTokenMiddleware error:', ucResponse)
        return httpResponses.http401(ucResponse)
      }

      this.logger.info('Completed AuthTokenMiddleware')
      this.logger.debug('AuthTokenMiddleware response:', ucResponse)
      return httpResponses.http200(ucResponse)
    } catch (error) {
      this.logger.error('AuthTokenMiddleware error:', error)
      return httpResponses.http500(error)
    }
  }
}
