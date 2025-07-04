import { type IGetUsersResponseDTO } from '@/domain/ports/outbounds'

export interface IGetUsersUsecase {
  execute: () => Promise<IGetUsersResponseDTO | Error>
}
