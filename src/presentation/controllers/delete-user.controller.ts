import { type ILogger, type IDeleteUserUsecase } from '@/domain/contracts'
import { NotFoundError } from '@/domain/errors'
import { type IDeleteUserRequestDTO } from '@/domain/ports/inbounds'
import { type IValidation } from '@/presentation/contracts'
import {
  type IHttpResponse,
  type IController,
  httpResponses
} from '@/presentation/interfaces'

export class DeleteUserController implements IController {
  constructor(
    private readonly deleteUserUsecase: IDeleteUserUsecase,
    private readonly validator: IValidation,
    private readonly logger: ILogger
  ) {}

  async handle(request: IDeleteUserRequestDTO): Promise<IHttpResponse<void>> {
    try {
      this.logger.info('Init DeleteUserController')
      this.logger.debug('DeleteUserController request:', request)
      const hasInputError = this.validator.validate(request)

      if (hasInputError) {
        this.logger.warn('DeleteUserController error:', hasInputError)
        return httpResponses.http400(hasInputError)
      }

      const ucResponse = await this.deleteUserUsecase.execute(request.id)

      if (ucResponse instanceof NotFoundError) {
        this.logger.warn('DeleteUserController error:', ucResponse)
        return httpResponses.http404(ucResponse)
      }

      this.logger.info('Completed DeleteUserController')
      this.logger.debug('DeleteUserController response:', {
        message: 'User deleted'
      })
      return httpResponses.http204()
    } catch (error) {
      this.logger.error('DeleteUserController error:', error)
      return httpResponses.http500(error)
    }
  }
}
