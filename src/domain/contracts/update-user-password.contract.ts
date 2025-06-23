import { type IUpdateUserPasswordDTO } from '../ports/inbounds'
import { type IUpdateUserPasswordResponseDTO } from '../ports/outbounds'

export interface IUpdateUserPasswordUsecase {
  execute: (
    fields: IUpdateUserPasswordDTO
  ) => Promise<IUpdateUserPasswordResponseDTO | Error>
}
