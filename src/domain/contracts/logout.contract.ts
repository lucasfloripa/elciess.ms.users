import { type ILogoutResponseDTO } from '../ports/outbounds'

export interface ILogoutUsecase {
  execute: (userId: string) => Promise<ILogoutResponseDTO | Error>
}
