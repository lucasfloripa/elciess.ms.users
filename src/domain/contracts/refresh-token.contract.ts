import { type IRefreshTokenResponseDTO } from '../ports/outbounds'

export interface IRefreshTokenUsecase {
  execute: (refreshToken: string) => Promise<IRefreshTokenResponseDTO | Error>
}
