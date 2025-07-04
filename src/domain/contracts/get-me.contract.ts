import { type IGetMeResponseDTO } from '@/domain/ports/outbounds'

export interface IGetMeUsecase {
  execute: (userId: string) => Promise<IGetMeResponseDTO | Error>
}
