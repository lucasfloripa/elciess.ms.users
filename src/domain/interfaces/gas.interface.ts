export interface IGasRegister {
  gasId: string
  date: Date
  price: number
  actualKm: string
}

export interface ISanitezedGasRegister {
  date: Date
  price: number
  actualKm: string
}
