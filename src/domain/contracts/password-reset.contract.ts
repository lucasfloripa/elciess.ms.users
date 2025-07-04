import { type IPasswordResetResponseDTO } from '@/domain/ports/outbounds'

export interface IPasswordResetUsecase {
  execute: (email: string) => Promise<IPasswordResetResponseDTO | Error>
}
