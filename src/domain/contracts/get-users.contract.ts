import { type IGetUsersResponseDTO } from '../ports/outbounds'

export interface IGetUsersUsecase {
  execute: () => Promise<IGetUsersResponseDTO | Error>
}
