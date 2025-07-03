import { type IPasswordResetResponseDTO } from '../ports/outbounds'

export interface IPasswordResetUsecase {
  execute: (email: string) => Promise<IPasswordResetResponseDTO | Error>
}
