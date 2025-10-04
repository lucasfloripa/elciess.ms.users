import * as shortUuid from 'short-uuid'

import { type IAddGasRegisterRequestDTO } from '@/domain/ports/inbounds'

import { type IGasRegister } from '../interfaces'

export class GasRegister {
  constructor(
    readonly gasId: string,
    readonly price: number,
    readonly date: Date,
    readonly actualKm: string
  ) {}

  static async create(input: IAddGasRegisterRequestDTO): Promise<GasRegister> {
    const { actualKm, date, price } = input
    const gasId = this._generateId()
    const parsedDate = new Date(date + 'T00:00:00.000Z')
    return new GasRegister(gasId, price, parsedDate, actualKm)
  }

  private static _generateId(): string {
    return shortUuid.generate()
  }

  toReturn(): Omit<IGasRegister, 'gasId'> {
    return {
      actualKm: this.actualKm,
      date: this.date,
      price: this.price
    }
  }

  toPersistence(): IGasRegister {
    return {
      gasId: this.gasId,
      actualKm: this.actualKm,
      date: this.date,
      price: this.price
    }
  }
}
