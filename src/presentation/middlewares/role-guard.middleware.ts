import { type ILogger, type IRoleGuardUsecase } from '@/domain/contracts'
import { ForbiddenError } from '@/domain/errors'
import { type IRoleGuardRequestDTO } from '@/domain/ports/inbounds'
import {
  type IHttpResponse,
  type IMiddleware,
  httpResponses
} from '@/presentation/interfaces'

export class RoleGuardMiddleware implements IMiddleware {
  constructor(
    private readonly roleGuardUsecase: IRoleGuardUsecase,
    private readonly requiredRole: string,
    private readonly logger: ILogger
  ) {}

  async handle(request: IRoleGuardRequestDTO): Promise<IHttpResponse> {
    try {
      this.logger.info('Init RoleGuardMiddleware')
      this.logger.debug('RoleGuardMiddleware request:', request)

      const ucResponse = await this.roleGuardUsecase.execute(
        request.role,
        this.requiredRole
      )

      if (ucResponse instanceof ForbiddenError) {
        this.logger.warn('RoleGuardMiddleware error:', ucResponse)
        return httpResponses.http403(ucResponse)
      }

      this.logger.info('Completed RoleGuardMiddleware')
      this.logger.debug('RoleGuardMiddleware response:', {
        message: 'Access acepted'
      })
      return httpResponses.http200({})
    } catch (error) {
      this.logger.error('RoleGuardMiddleware error:', error)
      return httpResponses.http500(error)
    }
  }
}
