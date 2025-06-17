import { type IUserCredentialsDTO } from '../ports/inbounds'
import { type IAuthUserResponseDTO } from '../ports/outbounds'

export interface IAuthUserUsecase {
  execute: (
    credentials: IUserCredentialsDTO
  ) => Promise<IAuthUserResponseDTO | Error>
}
