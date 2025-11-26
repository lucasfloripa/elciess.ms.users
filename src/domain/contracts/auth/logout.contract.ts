import { type ILogoutResponseDTO } from '@/domain/ports/outbounds'

export interface ILogoutUsecase {
  execute: () => Promise<ILogoutResponseDTO | Error>
}
