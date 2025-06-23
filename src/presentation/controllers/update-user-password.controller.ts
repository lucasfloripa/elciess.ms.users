import { type IUpdateUserPasswordUsecase } from '../../domain/contracts'
import { ConflictError, NotFoundError } from '../../domain/errors'
import { type IUpdateUserPasswordDTO } from '../../domain/ports/inbounds'
import { type ICreateUserResponseDTO } from '../../domain/ports/outbounds'
import { logError, log } from '../../utils/log'
import { type IValidation } from '../contracts'
import {
  type IHttpResponse,
  type IController,
  htttpResponses
} from '../interfaces'

export class UpdateUserPasswordController implements IController {
  constructor(
    private readonly updateUserPasswordUsecase: IUpdateUserPasswordUsecase,
    private readonly validator: IValidation
  ) {}

  async handle(
    data: IUpdateUserPasswordDTO
  ): Promise<IHttpResponse<ICreateUserResponseDTO>> {
    try {
      log('updateUserPasswordController request:', data)

      const hasInputError = this.validator.validate(data)
      if (hasInputError) {
        logError('updateUserPasswordController error:', hasInputError)
        return htttpResponses.http400(hasInputError)
      }

      const ucResponse = await this.updateUserPasswordUsecase.execute(data)

      if (ucResponse instanceof NotFoundError) {
        logError('updateUserPasswordController error:', ucResponse.error)
        return htttpResponses.http404(ucResponse)
      }

      if (ucResponse instanceof ConflictError) {
        logError('updateUserPasswordController error:', ucResponse.error)
        return htttpResponses.http409(ucResponse)
      }

      log('updateUserPasswordController response:', ucResponse)
      return htttpResponses.http200(ucResponse)
    } catch (error) {
      logError('updateUserPasswordController error:', error)
      return htttpResponses.http500(error)
    }
  }
}
