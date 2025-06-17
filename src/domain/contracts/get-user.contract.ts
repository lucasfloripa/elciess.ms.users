import { type IUser } from '../interfaces/user.interfaces'
import { type IGetUserResponseDTO } from '../ports/outbounds'

export interface IGetUserUsecase {
  execute: (filters: Partial<IUser>) => Promise<IGetUserResponseDTO | Error>
}
