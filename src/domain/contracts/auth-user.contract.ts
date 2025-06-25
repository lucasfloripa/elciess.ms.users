import { type IAuthUserRequestDTO } from '../ports/inbounds'
import { type IAuthUserResponseDTO } from '../ports/outbounds'

export interface IAuthUserUsecase {
  execute: (
    request: IAuthUserRequestDTO
  ) => Promise<IAuthUserResponseDTO | Error>
}
