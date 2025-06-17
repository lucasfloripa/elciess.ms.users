import { type IGetUserUsecase } from '../../domain/contracts'
import { NotFoundError } from '../../domain/errors'
import { type IUser } from '../../domain/interfaces/user.interfaces'
import { type IGetUserDTO } from '../../domain/ports/inbounds'
import { logError, log } from '../../utils/log'
import { type IValidation } from '../contracts'
import {
  type IHttpResponse,
  type IController,
  htttpResponses
} from '../interfaces'

export class GetUserController implements IController {
  constructor(
    private readonly getUserUsecase: IGetUserUsecase,
    private readonly validator: IValidation
  ) {}

  async handle(filter: IGetUserDTO): Promise<IHttpResponse<IUser>> {
    try {
      log('GetUserController request:', filter)

      const hasInputError = this.validator.validate(filter)
      if (hasInputError) {
        logError('GetUserController error:', hasInputError)
        return htttpResponses.http400(hasInputError)
      }

      const ucResponse = await this.getUserUsecase.execute(filter)

      if (ucResponse instanceof NotFoundError) {
        logError('GetUserController error:', ucResponse.error)
        return htttpResponses.http404(ucResponse)
      }

      log('GetUserController response:', ucResponse)
      return htttpResponses.http200(ucResponse)
    } catch (error) {
      logError('GetUserController error:', error)
      return htttpResponses.http500(error)
    }
  }
}
