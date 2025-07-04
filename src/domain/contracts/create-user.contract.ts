import { type ICreateUserRequestDTO } from '@/domain/ports/inbounds'
import { type ICreateUserResponseDTO } from '@/domain/ports/outbounds'

export interface ICreateUserUsecase {
  execute: (
    request: ICreateUserRequestDTO
  ) => Promise<ICreateUserResponseDTO | Error>
}
