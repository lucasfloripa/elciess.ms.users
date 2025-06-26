import { type IGetUserRequestDTO } from '../ports/inbounds'
import { type IGetUserResponseDTO } from '../ports/outbounds'

export interface IGetUserUsecase {
  execute: (request: IGetUserRequestDTO) => Promise<IGetUserResponseDTO | Error>
}
