import { type IAuthTokenRequestDTO } from '../ports/inbounds'
import { type IAuthTokenResponseDTO } from '../ports/outbounds'

export interface IAuthTokenUsecase {
  execute: (
    request: IAuthTokenRequestDTO
  ) => Promise<IAuthTokenResponseDTO | Error>
}
