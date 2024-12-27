import { type ICreateUserUsecase } from '../../domain/contracts'
import { EmailInUseError } from '../../domain/errors'
import { type ICreateUserDTO } from '../../domain/ports/inbounds'
import { type ICreateUserResponse } from '../../domain/ports/outbounds'
import { logError, log } from '../../utils/log'
import { type IValidation } from '../contracts'
import {
  type IHttpResponse,
  type IController,
  htttpResponses
} from '../protocols'

export class CreateUserController implements IController {
  constructor(
    private readonly createUserUsecase: ICreateUserUsecase,
    private readonly validator: IValidation
  ) {}

  async handle(
    createUserData: ICreateUserDTO
  ): Promise<IHttpResponse<ICreateUserResponse>> {
    try {
      log('CreateUserController request:', createUserData)
      const hasInputError = this.validator.validate(createUserData)
      if (hasInputError) {
        logError('AuthUserController error:', hasInputError)
        return htttpResponses.http400(hasInputError)
      }

      const ucResponse = await this.createUserUsecase.execute(createUserData)

      if (ucResponse instanceof EmailInUseError) {
        logError('CreateUserController error:', 'Email already in use')
        return htttpResponses.http400(ucResponse)
      }

      log('CreateUserController response:', ucResponse)
      return htttpResponses.http200(ucResponse)
    } catch (error) {
      logError('CreateUserController error:', error)
      return htttpResponses.http500(error)
    }
  }
}
