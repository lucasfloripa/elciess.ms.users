import { type IDeleteUserUsecase } from '@/domain/contracts'
import { NotFoundError } from '@/domain/errors'
import { type IDeleteUserRequestDTO } from '@/domain/ports/inbounds'
import { type IValidation } from '@/presentation/contracts'
import {
  type IHttpResponse,
  type IController,
  htttpResponses
} from '@/presentation/interfaces'
import { logError, log } from '@/utils/log'

export class DeleteUserController implements IController {
  constructor(
    private readonly deleteUserUsecase: IDeleteUserUsecase,
    private readonly validator: IValidation
  ) {}

  async handle(request: IDeleteUserRequestDTO): Promise<IHttpResponse<void>> {
    try {
      log('DeleteUserController request:', request)
      const hasInputError = this.validator.validate(request)

      if (hasInputError) {
        logError('DeleteUserController error:', hasInputError)
        return htttpResponses.http400(hasInputError)
      }

      const ucResponse = await this.deleteUserUsecase.execute(request.id)

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
