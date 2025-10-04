import { type ILogger, type IAddGasRegisterUsecase } from '@/domain/contracts'
import { type IAddGasRegisterRequestDTO } from '@/domain/ports/inbounds'
import { type IAddGasRegisterResponseDTO } from '@/domain/ports/outbounds'
import { type IValidation } from '@/presentation/contracts'
import {
  type IHttpResponse,
  type IController,
  httpResponses
} from '@/presentation/interfaces'

export class AddGasRegisterController implements IController {
  constructor(
    private readonly addGasRegisterUsecase: IAddGasRegisterUsecase,
    private readonly validator: IValidation,
    private readonly logger: ILogger
  ) {}

  async handle(
    request: IAddGasRegisterRequestDTO
  ): Promise<IHttpResponse<IAddGasRegisterResponseDTO>> {
    try {
      this.logger.info('Init AddGasRegisterController')
      this.logger.debug('AddGasRegisterController request', request)
      const hasInputError = this.validator.validate(request)

      if (hasInputError) {
        this.logger.warn('AddGasRegisterController error:', hasInputError)
        return httpResponses.http400(hasInputError)
      }

      const ucResponse = await this.addGasRegisterUsecase.execute(request)

      this.logger.info('AddGasRegisterController Completed')
      this.logger.debug('AddGasRegisterController response:', ucResponse)
      return httpResponses.http201(ucResponse)
    } catch (error) {
      this.logger.error('AddGasRegisterController error:', error)
      return httpResponses.http500(error)
    }
  }
}
