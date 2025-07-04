import { type IGetUsersUsecase } from '@/domain/contracts'
import { NotFoundError } from '@/domain/errors'
import { type IGetUsersResponseDTO } from '@/domain/ports/outbounds'
import {
  type IHttpResponse,
  type IController,
  htttpResponses
} from '@/presentation/interfaces'
import { logError, log } from '@/utils/log'

export class GetUsersController implements IController {
  constructor(private readonly getUsersUsecase: IGetUsersUsecase) {}

  async handle(): Promise<IHttpResponse<IGetUsersResponseDTO>> {
    try {
      log('GetUsersController request:', '')
      const ucResponse = await this.getUsersUsecase.execute()

      if (ucResponse instanceof NotFoundError) {
        logError('GetUsersController error:', ucResponse.error)
        return htttpResponses.http404(ucResponse)
      }

      log('GetUsersController response:', ucResponse)
      return htttpResponses.http200(ucResponse)
    } catch (error) {
      logError('GetUsersController error:', error)
      return htttpResponses.http500(error)
    }
  }
}
