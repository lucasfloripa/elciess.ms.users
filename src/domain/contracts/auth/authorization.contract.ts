import { type IAuthorizationRequestDTO } from '@/domain/ports/inbounds'
import { type IAuthorizationResponseDTO } from '@/domain/ports/outbounds'

export interface IAuthorizationUsecase {
  execute: (
    request: IAuthorizationRequestDTO
  ) => Promise<IAuthorizationResponseDTO | Error>
}
