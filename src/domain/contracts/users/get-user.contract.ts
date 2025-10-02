import { type IGetUserRequestDTO } from '@/domain/ports/inbounds'
import { type IGetUserResponseDTO } from '@/domain/ports/outbounds'

export interface IGetUserUsecase {
  execute: (request: IGetUserRequestDTO) => Promise<IGetUserResponseDTO | Error>
}
