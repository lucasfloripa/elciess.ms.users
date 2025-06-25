import { type IUpdateUserUsecase } from '../../domain/contracts'
import { EmailInUseError, NotFoundError } from '../../domain/errors'
import { type IUpdateUserRequestDTO } from '../../domain/ports/inbounds'
import { type IUpdateUserResponseDTO } from '../../domain/ports/outbounds'
import { logError, log } from '../../utils/log'
import { type IValidation } from '../contracts'
import {
  type IHttpResponse,
  type IController,
  htttpResponses
} from '../interfaces'

export class UpdateUserController implements IController {
  constructor(
    private readonly updateUserUsecase: IUpdateUserUsecase,
    private readonly validator: IValidation
  ) {}

  async handle(
    request: IUpdateUserRequestDTO
  ): Promise<IHttpResponse<IUpdateUserResponseDTO>> {
    try {
      log('UpdateUserController request:', request)
      const hasInputError = this.validator.validate(request)

      if (hasInputError) {
        logError('UpdateUserController error:', hasInputError)
        return htttpResponses.http400(hasInputError)
      }

      const ucResponse = await this.updateUserUsecase.execute(request)

      if (ucResponse instanceof EmailInUseError) {
        logError('CreateUserController error:', ucResponse.error)
        return htttpResponses.http400(ucResponse)
      }

      if (ucResponse instanceof NotFoundError) {
        logError('UpdateUserController error:', ucResponse.error)
        return htttpResponses.http404(ucResponse)
      }

      log('UpdateUserController response:', ucResponse)
      return htttpResponses.http200(ucResponse)
    } catch (error) {
      logError('UpdateUserController error:', error)
      return htttpResponses.http500(error)
    }
  }
}
