import { type ICreateUserUsecase } from '../../domain/contracts'
import { EmailInUseError } from '../../domain/errors'
import { type ICreateUserRequestDTO } from '../../domain/ports/inbounds'
import { type ICreateUserResponseDTO } from '../../domain/ports/outbounds'
import { logError, log } from '../../utils/log'
import { type IValidation } from '../contracts'
import {
  type IHttpResponse,
  type IController,
  htttpResponses
} from '../interfaces'

export class CreateUserController implements IController {
  constructor(
    private readonly createUserUsecase: ICreateUserUsecase,
    private readonly validator: IValidation
  ) {}

  async handle(
    request: ICreateUserRequestDTO
  ): Promise<IHttpResponse<ICreateUserResponseDTO>> {
    try {
      log('CreateUserController request:', request)
      const hasInputError = this.validator.validate(request)

      if (hasInputError) {
        logError('CreateUserController error:', hasInputError)
        return htttpResponses.http400(hasInputError)
      }

      const ucResponse = await this.createUserUsecase.execute(request)

      if (ucResponse instanceof EmailInUseError) {
        logError('CreateUserController error:', ucResponse.error)
        return htttpResponses.http400(ucResponse)
      }

      log('CreateUserController response:', ucResponse)
      return htttpResponses.http201(ucResponse)
    } catch (error) {
      logError('CreateUserController error:', error)
      return htttpResponses.http500(error)
    }
  }
}
