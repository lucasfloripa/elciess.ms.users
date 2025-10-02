import { type ILogger, type IGetUsersUsecase } from '@/domain/contracts'
import { NotFoundError } from '@/domain/errors'
import { type IGetUsersResponseDTO } from '@/domain/ports/outbounds'
import {
  type IHttpResponse,
  type IController,
  httpResponses
} from '@/presentation/interfaces'

export class GetUsersController implements IController {
  constructor(
    private readonly getUsersUsecase: IGetUsersUsecase,
    private readonly logger: ILogger
  ) {}

  async handle(): Promise<IHttpResponse<IGetUsersResponseDTO>> {
    try {
      this.logger.info('Init GetUsersController')
      this.logger.debug('GetUsersController request:', { message: '' })
      const ucResponse = await this.getUsersUsecase.execute()

      if (ucResponse instanceof NotFoundError) {
        this.logger.warn('GetUsersController error:', ucResponse)
        return httpResponses.http404(ucResponse)
      }

      this.logger.info('Completed GetUsersController')
      this.logger.debug('GetUsersController response:', ucResponse)
      return httpResponses.http200(ucResponse)
    } catch (error) {
      this.logger.error('GetUsersController error:', error)
      return httpResponses.http500(error)
    }
  }
}
