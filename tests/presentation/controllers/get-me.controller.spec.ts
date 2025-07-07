import { type IGetMeUsecase } from '@/domain/contracts'
import { NotFoundError } from '@/domain/errors'
import { type IGetMeRequestDTO } from '@/domain/ports/inbounds'
import { type IGetMeResponseDTO } from '@/domain/ports/outbounds'
import { type IValidation } from '@/presentation/contracts'
import { GetMeController } from '@/presentation/controllers'
import { httpResponses } from '@/presentation/interfaces'

describe('GetMeController', () => {
  let getMeUsecase: jest.Mocked<IGetMeUsecase>
  let validator: jest.Mocked<IValidation>
  let getMeController: GetMeController

  beforeEach(() => {
    getMeUsecase = {
      execute: jest.fn()
    }
    validator = {
      validate: jest.fn()
    }
    getMeController = new GetMeController(getMeUsecase, validator)
  })

  it('should return 200 if user data is retrieved successfully', async () => {
    const getMeData: IGetMeRequestDTO = {
      userId: 'valid_user_id'
    }
    const userResponse: IGetMeResponseDTO = {
      user: {
        userId: 'valid_user_id',
        email: 'john.doe@example.com',
        role: 'DEFAULT'
      }
    }
    validator.validate.mockReturnValue(undefined)
    getMeUsecase.execute.mockResolvedValue(userResponse)

    const response = await getMeController.handle(getMeData)

    expect(response).toEqual(httpResponses.http200(userResponse))
    expect(validator.validate).toHaveBeenCalledWith(getMeData)
    expect(getMeUsecase.execute).toHaveBeenCalledWith(getMeData.userId)
  })

  it('should return 400 if validation fails', async () => {
    const getMeData: IGetMeRequestDTO = {
      userId: ''
    }
    const validationError = new Error('User ID is required')
    validator.validate.mockReturnValue(validationError)

    const response = await getMeController.handle(getMeData)

    expect(response).toEqual(httpResponses.http400(validationError))
    expect(validator.validate).toHaveBeenCalledWith(getMeData)
    expect(getMeUsecase.execute).not.toHaveBeenCalled()
  })

  it('should return 404 if user is not found', async () => {
    const getMeData: IGetMeRequestDTO = {
      userId: 'non_existent_user_id'
    }
    const notFoundError = new NotFoundError('User not found')
    validator.validate.mockReturnValue(undefined)
    getMeUsecase.execute.mockResolvedValue(notFoundError)

    const response = await getMeController.handle(getMeData)

    expect(response).toEqual(httpResponses.http404(notFoundError))
    expect(validator.validate).toHaveBeenCalledWith(getMeData)
    expect(getMeUsecase.execute).toHaveBeenCalledWith(getMeData.userId)
  })

  it('should return 500 if an unexpected error occurs', async () => {
    const getMeData: IGetMeRequestDTO = {
      userId: 'any_user_id'
    }
    const unexpectedError = new Error('Internal server error')
    validator.validate.mockReturnValue(undefined)
    getMeUsecase.execute.mockRejectedValue(unexpectedError)

    const response = await getMeController.handle(getMeData)

    expect(response).toEqual(httpResponses.http500(unexpectedError))
    expect(validator.validate).toHaveBeenCalledWith(getMeData)
    expect(getMeUsecase.execute).toHaveBeenCalledWith(getMeData.userId)
  })
})
