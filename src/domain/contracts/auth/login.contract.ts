import { type ILoginRequestDTO } from '@/domain/ports/inbounds'
import { type ILoginResponseDTO } from '@/domain/ports/outbounds'

export interface ILoginUsecase {
  execute: (request: ILoginRequestDTO) => Promise<ILoginResponseDTO | Error>
}
