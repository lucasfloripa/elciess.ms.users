import { type IGasRepository } from '@/application/contracts'
import { type ILogger, type IAddGasRegisterUsecase } from '@/domain/contracts'
import { GasRegister } from '@/domain/entities'
import { type IAddGasRegisterRequestDTO } from '@/domain/ports/inbounds'
import { type IAddGasRegisterResponseDTO } from '@/domain/ports/outbounds'

export class AddGasRegisterUsecase implements IAddGasRegisterUsecase {
  constructor(
    private readonly gasRepository: IGasRepository,
    private readonly logger: ILogger
  ) {}

  async execute(
    request: IAddGasRegisterRequestDTO
  ): Promise<IAddGasRegisterResponseDTO | Error> {
    this.logger.info('Init AddGasRegisterUsecase')
    this.logger.debug('AddGasRegisterUsecase: Creating new gas register')
    const gasRegister: GasRegister = await GasRegister.create(request)

    this.logger.debug(
      'AddGasRegisterUsecase: Saving gasRegister to repository',
      {
        gasRegister
      }
    )
    await this.gasRepository.addRegister(gasRegister.toPersistence())

    this.logger.info('Completed AddGasRegisterUsecase')
    this.logger.debug('AddGasRegisterUsecase response', {
      gasRegister: gasRegister.toReturn()
    })
    return { gasRegister: gasRegister.toReturn() }
  }
}
