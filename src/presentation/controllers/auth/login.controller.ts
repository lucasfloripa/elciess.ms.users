import { type ILogger, type ILoginUsecase } from '@/domain/contracts'
import { UnauthorizedError, ForbiddenError } from '@/domain/errors'
import { type ILoginRequestDTO } from '@/domain/ports/inbounds'
import { type ILoginResponseDTO } from '@/domain/ports/outbounds'
import { type IValidation } from '@/presentation/contracts'
import {
  type IHttpResponse,
  type IController,
  httpResponses
} from '@/presentation/interfaces'

export class LoginController implements IController {
  constructor(
    private readonly loginUsecase: ILoginUsecase,
    private readonly validator: IValidation,
    private readonly logger: ILogger
  ) {}

  async handle(
    request: ILoginRequestDTO
  ): Promise<IHttpResponse<ILoginResponseDTO>> {
    try {
      this.logger.info('Init LoginController')
      this.logger.debug('LoginController request', request)

      const hasInputError = this.validator.validate(request)
      if (hasInputError) {
        this.logger.warn('LoginController error:', hasInputError)
        return httpResponses.http400(hasInputError)
      }

      const requestDTO: ILoginRequestDTO = {
        email: request.email,
        password: request.password
      }

      const ucResponse = await this.loginUsecase.execute(requestDTO)

      if (ucResponse instanceof UnauthorizedError) {
        this.logger.warn('LoginController error:', ucResponse)
        return httpResponses.http401(ucResponse)
      }

      if (ucResponse instanceof ForbiddenError) {
        this.logger.warn('LoginController error:', ucResponse)
        return httpResponses.http403(ucResponse)
      }

      this.logger.info('Completed LoginController')
      this.logger.debug('LoginController response', ucResponse)
      return httpResponses.http200(ucResponse)
    } catch (error) {
      this.logger.error('LoginController error:', error)
      return httpResponses.http500(error)
    }
  }
}
