import { type ICreateUserRequestDTO } from '../ports/inbounds'
import { type ICreateUserResponseDTO } from '../ports/outbounds'

export interface ICreateUserUsecase {
  execute: (
    createUserData: ICreateUserRequestDTO
  ) => Promise<ICreateUserResponseDTO | Error>
}
