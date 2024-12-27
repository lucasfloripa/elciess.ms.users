import { type IUserCredentialsDTO } from '../ports/inbounds'
import { type IAuthUserResponse } from '../ports/outbounds'

export interface IAuthUserUsecase {
  execute: (
    credentials: IUserCredentialsDTO
  ) => Promise<IAuthUserResponse | Error>
}
