import { type IDeleteUserUsecase } from '../../domain/contracts'
import { NotFoundError } from '../../domain/errors'
import { logError, log } from '../../utils/log'
import { type IValidation } from '../contracts'
import {
  type IHttpResponse,
  type IController,
  htttpResponses
} from '../interfaces'

export class DeleteUserController implements IController {
  constructor(
    private readonly deleteUserUsecase: IDeleteUserUsecase,
    private readonly validator: IValidation
  ) {}

  async handle(userId: string): Promise<IHttpResponse<void>> {
    try {
      log('DeleteUserController request:', `userId: ${userId}`)

      const hasInputError = this.validator.validate({ userId })
      if (hasInputError) {
        logError('DeleteUserController error:', hasInputError)
        return htttpResponses.http400(hasInputError)
      }

      const ucResponse = await this.deleteUserUsecase.execute(userId)

      if (ucResponse instanceof NotFoundError) {
        logError('DeleteUserController error:', ucResponse.error)
        return htttpResponses.http404(ucResponse)
      }

      log('DeleteUserController response:', 'User deleted')
      return htttpResponses.http204()
    } catch (error) {
      logError('DeleteUserController error:', error)
      return htttpResponses.http500(error)
    }
  }
}
