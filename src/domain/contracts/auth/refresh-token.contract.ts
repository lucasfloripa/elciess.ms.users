import { type IRefreshTokenResponseDTO } from '@/domain/ports/outbounds'

export interface IRefreshTokenUsecase {
  execute: (refreshToken: string) => Promise<IRefreshTokenResponseDTO | Error>
}
