import { type ILogger, type IAddGasRegisterUsecase } from '@/domain/contracts'
import { InvalidDateFormatError } from '@/domain/errors'
import { type IAddGasRegisterRequestDTO } from '@/domain/ports/inbounds'
import { type IAddGasRegisterResponseDTO } from '@/domain/ports/outbounds'
import { type IValidation } from '@/presentation/contracts'
import { AddGasRegisterController } from '@/presentation/controllers'
import { httpResponses } from '@/presentation/interfaces'

describe('AddGasRegisterController', () => {
  let addGasRegisterUsecase: jest.Mocked<IAddGasRegisterUsecase>
  let validator: jest.Mocked<IValidation>
  let addGasRegisterController: AddGasRegisterController
  let logger: ILogger

  beforeEach(() => {
    logger = {
      debug: jest.fn(),
      error: jest.fn(),
      info: jest.fn(),
      warn: jest.fn()
    } as unknown as jest.Mocked<ILogger>
    addGasRegisterUsecase = {
      execute: jest.fn()
    }
    validator = {
      validate: jest.fn()
    }
    addGasRegisterController = new AddGasRegisterController(
      addGasRegisterUsecase,
      validator,
      logger
    )
  })

  it('should return 201 if user is created successfully', async () => {
    const addGasRegisterData: IAddGasRegisterRequestDTO = {
      actualKm: '123',
      date: '1990-08-08',
      price: 6.35
    }

    const newGasRegister: IAddGasRegisterResponseDTO = {
      gasRegister: {
        actualKm: '123',
        date: new Date('1990-08-08' + 'T00:00:00.000Z'),
        price: 6.35
      }
    }

    validator.validate.mockReturnValue(undefined)
    addGasRegisterUsecase.execute.mockResolvedValue(newGasRegister)

    const response = await addGasRegisterController.handle(addGasRegisterData)

    expect(response).toEqual(httpResponses.http201(newGasRegister))
    expect(validator.validate).toHaveBeenCalledWith(addGasRegisterData)
    expect(addGasRegisterUsecase.execute).toHaveBeenCalledWith(
      addGasRegisterData
    )
  })

  it('should return 400 if validation fails', async () => {
    const addGasRegisterData: IAddGasRegisterRequestDTO = {
      actualKm: '123',
      date: '',
      price: 6.35
    }

    const validationError = new InvalidDateFormatError()
    validator.validate.mockReturnValue(validationError)

    const response = await addGasRegisterController.handle(addGasRegisterData)

    expect(response).toEqual(httpResponses.http400(validationError))
    expect(validator.validate).toHaveBeenCalledWith(addGasRegisterData)
    expect(addGasRegisterUsecase.execute).not.toHaveBeenCalled()
  })

  it('should return 500 if an unexpected error accurs', async () => {
    const addGasRegisterData: IAddGasRegisterRequestDTO = {
      actualKm: '123',
      date: '1990-08-08',
      price: 6.35
    }
    const error = new Error('Some error')
    validator.validate.mockReturnValue(undefined)
    addGasRegisterUsecase.execute.mockRejectedValue(error)

    const response = await addGasRegisterController.handle(addGasRegisterData)

    expect(response).toEqual(httpResponses.http500(error))
    expect(validator.validate).toHaveBeenCalledWith(addGasRegisterData)
    expect(addGasRegisterUsecase.execute).toHaveBeenCalledWith(
      addGasRegisterData
    )
  })
})
