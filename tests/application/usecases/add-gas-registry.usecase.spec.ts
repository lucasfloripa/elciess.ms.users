import { type IGasRepository } from '@/application/contracts'
import { AddGasRegisterUsecase } from '@/application/usecases'
import { type ILogger } from '@/domain/contracts'
import { GasRegister } from '@/domain/entities'
import { type IAddGasRegisterRequestDTO } from '@/domain/ports/inbounds'

// Mock da entidade para evitar lógica interna real
jest.mock('@/domain/entities/gas-register.entity')

describe('AddGasRegisterUsecase', () => {
  let addGasRegisterUsecase: AddGasRegisterUsecase
  let gasRepository: jest.Mocked<IGasRepository>
  let logger: ILogger

  beforeEach(() => {
    logger = {
      debug: jest.fn(),
      error: jest.fn(),
      info: jest.fn(),
      warn: jest.fn()
    } as unknown as jest.Mocked<ILogger>

    gasRepository = {
      addRegister: jest.fn()
    } as unknown as jest.Mocked<IGasRepository>

    addGasRegisterUsecase = new AddGasRegisterUsecase(gasRepository, logger)
  })

  it('should create and save a gas register successfully', async () => {
    const createGasRegisterData: IAddGasRegisterRequestDTO = {
      date: '2025-10-04',
      actualKm: '123',
      price: 6.25
    }

    const mockGasRegister = {
      toPersistence: jest.fn().mockReturnValue({
        ...createGasRegisterData,
        gasRegisterId: 'gas-id-1'
      }),
      toReturn: jest.fn().mockReturnValue({
        id: 'gas-id-1',
        ...createGasRegisterData
      })
    } as unknown as GasRegister

    jest.spyOn(GasRegister, 'create').mockResolvedValueOnce(mockGasRegister)

    const result = await addGasRegisterUsecase.execute(createGasRegisterData)

    expect(GasRegister.create).toHaveBeenCalledWith(createGasRegisterData)
    expect(gasRepository.addRegister).toHaveBeenCalledWith(
      mockGasRegister.toPersistence()
    )
    expect(result).toEqual({ gasRegister: mockGasRegister.toReturn() })
    expect(logger.info).toHaveBeenCalledWith('Init AddGasRegisterUsecase')
    expect(logger.info).toHaveBeenCalledWith('Completed AddGasRegisterUsecase')
  })

  it('should log and throw error if GasRegister.create fails', async () => {
    const createGasRegisterData: IAddGasRegisterRequestDTO = {
      date: '2025-10-04',
      actualKm: '123',
      price: 6.25
    }

    const mockError = new Error('Invalid gas register data')

    jest.spyOn(GasRegister, 'create').mockRejectedValueOnce(mockError)

    await expect(
      addGasRegisterUsecase.execute(createGasRegisterData)
    ).rejects.toThrow(mockError)

    expect(GasRegister.create).toHaveBeenCalledWith(createGasRegisterData)
    expect(gasRepository.addRegister).not.toHaveBeenCalled()
  })
})
