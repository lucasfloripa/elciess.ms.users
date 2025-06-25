import { type IUser } from '../interfaces/user.interfaces'
import { type IUpdateUserResponseDTO } from '../ports/outbounds'

export interface IUpdateUserUsecase {
  execute: (request: Partial<IUser>) => Promise<IUpdateUserResponseDTO | Error>
}
