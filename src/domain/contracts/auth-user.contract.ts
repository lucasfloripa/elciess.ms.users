import { type IAuthUserRequestDTO } from '../ports/inbounds'
import { type IAuthUserResponseDTO } from '../ports/outbounds'

export interface IAuthUserUsecase {
  execute: (
    credentials: IAuthUserRequestDTO
  ) => Promise<IAuthUserResponseDTO | Error>
}
