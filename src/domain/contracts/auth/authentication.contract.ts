import { type IAuthenticationRequestDTO } from '@/domain/ports/inbounds'
import { type IAuthenticationResponseDTO } from '@/domain/ports/outbounds'

export interface IAuthenticationUsecase {
  execute: (
    request: IAuthenticationRequestDTO
  ) => Promise<IAuthenticationResponseDTO | Error>
}
