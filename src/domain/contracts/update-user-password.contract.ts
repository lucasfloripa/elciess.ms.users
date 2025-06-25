import { type IUpdateUserPasswordRequestDTO } from '../ports/inbounds'
import { type IUpdateUserPasswordResponseDTO } from '../ports/outbounds'

export interface IUpdateUserPasswordUsecase {
  execute: (
    request: IUpdateUserPasswordRequestDTO
  ) => Promise<IUpdateUserPasswordResponseDTO | Error>
}
