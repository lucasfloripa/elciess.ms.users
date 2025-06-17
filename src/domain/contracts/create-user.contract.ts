import { type ICreateUserDTO } from '../ports/inbounds'
import { type ICreateUserResponseDTO } from '../ports/outbounds'

export interface ICreateUserUsecase {
  execute: (
    createUserData: ICreateUserDTO
  ) => Promise<ICreateUserResponseDTO | Error>
}
