import { type ILogger, type IAuthRoleUsecase } from '@/domain/contracts'
import { ForbiddenError } from '@/domain/errors'
import { type IAuthRoleRequestDTO } from '@/domain/ports/inbounds'
import {
  type IHttpResponse,
  type IMiddleware,
  httpResponses
} from '@/presentation/interfaces'

export class AuthRoleMiddleware implements IMiddleware {
  constructor(
    private readonly authRoleUsecase: IAuthRoleUsecase,
    private readonly requiredRole: string,
    private readonly logger: ILogger
  ) {}

  async handle(request: IAuthRoleRequestDTO): Promise<IHttpResponse> {
    try {
      this.logger.info('Init AuthRoleMiddleware')
      this.logger.debug('AuthRoleMiddleware request:', request)

      const ucResponse = await this.authRoleUsecase.execute(
        request.role,
        this.requiredRole
      )

      if (ucResponse instanceof ForbiddenError) {
        this.logger.warn('AuthRoleMiddleware error:', ucResponse)
        return httpResponses.http401(ucResponse)
      }

      this.logger.info('Completed AuthRoleMiddleware')
      this.logger.debug('AuthRoleMiddleware response:', {
        message: 'Access acepted'
      })
      return httpResponses.http200({})
    } catch (error) {
      this.logger.error('AuthRoleMiddleware error:', error)
      return httpResponses.http500(error)
    }
  }
}
