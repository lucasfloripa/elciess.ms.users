import { type IAuthTokenRequestDTO } from '@/domain/ports/inbounds'
import { type IAuthTokenResponseDTO } from '@/domain/ports/outbounds'

export interface IAuthTokenUsecase {
  execute: (
    request: IAuthTokenRequestDTO
  ) => Promise<IAuthTokenResponseDTO | Error>
}
