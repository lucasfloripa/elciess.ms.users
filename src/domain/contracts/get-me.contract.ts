import { type IGetMeResponseDTO } from '../ports/outbounds'

export interface IGetMeUsecase {
  execute: (userId: string) => Promise<IGetMeResponseDTO | Error>
}
