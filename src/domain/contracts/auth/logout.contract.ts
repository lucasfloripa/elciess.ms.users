import { type ILogoutResponseDTO } from '@/domain/ports/outbounds'

export interface ILogoutUsecase {
  execute: (userId: string) => Promise<ILogoutResponseDTO | Error>
}
