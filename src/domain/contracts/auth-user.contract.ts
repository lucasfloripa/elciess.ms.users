import { type IAuthUserRequestDTO } from '@/domain/ports/inbounds'
import { type IAuthUserResponseDTO } from '@/domain/ports/outbounds'

export interface IAuthUserUsecase {
  execute: (
    request: IAuthUserRequestDTO
  ) => Promise<IAuthUserResponseDTO | Error>
}
