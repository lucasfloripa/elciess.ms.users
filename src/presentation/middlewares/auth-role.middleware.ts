import { type IAuthRoleUsecase } from '../../domain/contracts'
import { ForbiddenError } from '../../domain/errors'
import { type IAuthRoleRequestDTO } from '../../domain/ports/inbounds'
import { logError, log } from '../../utils/log'
import {
  type IHttpResponse,
  type IMiddleware,
  htttpResponses
} from '../interfaces'

export class AuthRoleMiddleware implements IMiddleware {
  constructor(
    private readonly authRoleUsecase: IAuthRoleUsecase,
    private readonly requiredRole: string
  ) {}

  async handle(request: IAuthRoleRequestDTO): Promise<IHttpResponse> {
    try {
      log('AuthRoleMiddleware request:', request)

      const ucResponse = await this.authRoleUsecase.execute(
        request.role,
        this.requiredRole
      )

      if (ucResponse instanceof ForbiddenError) {
        logError('AuthRoleMiddleware error:', ucResponse.error)
        return htttpResponses.http401(ucResponse)
      }

      log('AuthRoleMiddleware response:', 'Access acepted')
      return htttpResponses.http200({})
    } catch (error) {
      logError('AuthRoleMiddleware error:', error)
      return htttpResponses.http500(error)
    }
  }
}
