import * as shortUuid from 'short-uuid'

import { GasRegister } from '@/domain/entities/gas-register.entity'
import { type IGasRegister } from '@/domain/interfaces'
import { type IAddGasRegisterRequestDTO } from '@/domain/ports/inbounds'

jest.mock('short-uuid')

describe('GasRegister Entity', () => {
  const mockShortUuid = shortUuid as jest.Mocked<typeof shortUuid>

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('create', () => {
    it('should create a GasRegister with generated ID and parsed date', async () => {
      const input: IAddGasRegisterRequestDTO = {
        price: 5.2,
        date: '2025-10-02',
        actualKm: '12345'
      }
      const generatedId = 'generated-gas-id'

      mockShortUuid.generate.mockReturnValue(generatedId as shortUuid.SUUID)

      const gasRegister = await GasRegister.create(input)

      expect(mockShortUuid.generate).toHaveBeenCalled()
      expect(gasRegister).toEqual(
        new GasRegister(
          generatedId,
          input.price,
          new Date(input.date + 'T00:00:00.000Z'),
          input.actualKm
        )
      )
    })
  })

  describe('toReturn', () => {
    it('should return sanitized GasRegister data without gasId', () => {
      const gasRegister = new GasRegister(
        'gas-id',
        6.0,
        new Date('2025-10-02T00:00:00.000Z'),
        '15000'
      )

      expect(gasRegister.toReturn()).toEqual({
        price: 6.0,
        date: new Date('2025-10-02T00:00:00.000Z'),
        actualKm: '15000'
      })
    })
  })

  describe('toPersistence', () => {
    it('should return GasRegister data for persistence with gasId', () => {
      const gasRegister = new GasRegister(
        'gas-id',
        6.0,
        new Date('2025-10-02T00:00:00.000Z'),
        '15000'
      )

      expect(gasRegister.toPersistence()).toEqual<IGasRegister>({
        gasId: 'gas-id',
        price: 6.0,
        date: new Date('2025-10-02T00:00:00.000Z'),
        actualKm: '15000'
      })
    })
  })
})
