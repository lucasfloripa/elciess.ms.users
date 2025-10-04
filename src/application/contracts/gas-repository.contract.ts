import { type IGasRegister } from '@/domain/interfaces'

export interface IGasRepository {
  addRegister: (data: IGasRegister) => Promise<void>
}
