import { type ILogger, type IAuthorizationUsecase } from '@/domain/contracts'
import {
  ForbiddenError,
  UnauthorizedError,
  MissingParamError
} from '@/domain/errors'
import { type IAuthorizationRequestDTO } from '@/domain/ports/inbounds'
import {
  type IHttpResponse,
  type IMiddleware,
  httpResponses
} from '@/presentation/interfaces'

export class AuthorizationMiddleware implements IMiddleware {
  constructor(
    private readonly authorizationUsecase: IAuthorizationUsecase,
    private readonly logger: ILogger
  ) {}

  async handle(request: IAuthorizationRequestDTO): Promise<IHttpResponse> {
    try {
      this.logger.info('Init AuthorizationMiddleware')
      this.logger.debug('AuthorizationMiddleware request:', request)

      const { userId, role, action, resource } = request

      if (!userId) {
        this.logger.warn('AuthorizationMiddleware error: Missing userId')
        return httpResponses.http401(
          new UnauthorizedError('Unauthenticated user')
        )
      }

      if (!action) {
        this.logger.warn('AuthorizationMiddleware error: Missing action')
        return httpResponses.http400(
          new MissingParamError('Missing authorization action')
        )
      }

      const ucResponse = await this.authorizationUsecase.execute({
        userId,
        role,
        action,
        resource
      })

      if (ucResponse instanceof ForbiddenError) {
        this.logger.warn('AuthorizationMiddleware forbidden:', ucResponse)
        return httpResponses.http403(ucResponse)
      }

      this.logger.info('Completed AuthorizationMiddleware')
      return httpResponses.http200({})
    } catch (error) {
      this.logger.error('AuthorizationMiddleware error:', error)
      return httpResponses.http500(error)
    }
  }
}
