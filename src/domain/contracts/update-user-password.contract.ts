import { type IUpdateUserPasswordRequestDTO } from '@/domain/ports/inbounds'
import { type IUpdateUserPasswordResponseDTO } from '@/domain/ports/outbounds'

export interface IUpdateUserPasswordUsecase {
  execute: (
    request: IUpdateUserPasswordRequestDTO
  ) => Promise<IUpdateUserPasswordResponseDTO | Error>
}
