import { type ILogoutUsecase } from '../../domain/contracts'
import { NotFoundError } from '../../domain/errors'
import { type ILogoutDTO } from '../../domain/ports/inbounds'
import { logError, log } from '../../utils/log'
import { type IValidation } from '../contracts'
import {
  type IHttpResponse,
  type IController,
  htttpResponses
} from '../interfaces'

export class LogoutController implements IController {
  constructor(
    private readonly logoutUsecase: ILogoutUsecase,
    private readonly validator: IValidation
  ) {}

  async handle(data: ILogoutDTO): Promise<IHttpResponse<string>> {
    try {
      const { userId } = data

      log('LogoutController request:', userId)

      const hasInputError = this.validator.validate(data)
      if (hasInputError) {
        logError('LogoutController error:', hasInputError)
        return htttpResponses.http400(hasInputError)
      }

      const ucResponse = await this.logoutUsecase.execute(userId)

      if (ucResponse instanceof NotFoundError) {
        logError('LogoutController error:', ucResponse.error)
        return htttpResponses.http404(ucResponse)
      }

      log('LogoutController response:', ucResponse)
      return htttpResponses.http200(ucResponse)
    } catch (error) {
      logError('LogoutController error:', error)
      return htttpResponses.http500(error)
    }
  }
}
