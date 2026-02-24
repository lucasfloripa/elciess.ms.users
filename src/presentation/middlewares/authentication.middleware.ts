import { type ILogger, type IAuthenticationUsecase } from '@/domain/contracts'
import { UnauthorizedError } from '@/domain/errors'
import { type IAuthenticationRequestDTO } from '@/domain/ports/inbounds'
import {
  type IHttpResponse,
  type IMiddleware,
  httpResponses
} from '@/presentation/interfaces'

export class AuthenticationMiddleware implements IMiddleware {
  constructor(
    private readonly authenticationUsecase: IAuthenticationUsecase,
    private readonly logger: ILogger
  ) {}

  async handle(request: IAuthenticationRequestDTO): Promise<IHttpResponse> {
    try {
      this.logger.info('Init AuthenticationMiddleware')
      this.logger.debug('AuthenticationMiddleware request:', request)
      const { accessToken } = request

      if (!accessToken) {
        this.logger.warn('AuthenticationMiddleware error:', {
          message: 'Missing accessToken'
        })
        return httpResponses.http401(
          new UnauthorizedError('Missing accessToken')
        )
      }

      const ucResponse = await this.authenticationUsecase.execute({
        accessToken
      })

      if (ucResponse instanceof UnauthorizedError) {
        this.logger.warn('AuthenticationMiddleware error:', ucResponse)
        return httpResponses.http401(ucResponse)
      }

      this.logger.info('Completed AuthenticationMiddleware')
      this.logger.debug('AuthenticationMiddleware response:', ucResponse)
      return httpResponses.http200(ucResponse)
    } catch (error) {
      this.logger.error('AuthenticationMiddleware error:', error)
      return httpResponses.http500(error)
    }
  }
}
