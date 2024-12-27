import { type ICreateUserDTO } from '../ports/inbounds'
import { type ICreateUserResponse } from '../ports/outbounds'

export interface ICreateUserUsecase {
  execute: (
    createUserData: ICreateUserDTO
  ) => Promise<ICreateUserResponse | Error>
}
