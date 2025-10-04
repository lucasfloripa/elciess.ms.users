import { type IAddGasRegisterRequestDTO } from '@/domain/ports/inbounds'
import { type IAddGasRegisterResponseDTO } from '@/domain/ports/outbounds'

export interface IAddGasRegisterUsecase {
  execute: (
    data: IAddGasRegisterRequestDTO
  ) => Promise<IAddGasRegisterResponseDTO | Error>
}
