import { type ILogger, type IGetUserUsecase } from '@/domain/contracts'
import { NotFoundError } from '@/domain/errors'
import { type IGetUserRequestDTO } from '@/domain/ports/inbounds'
import { type IGetUserResponseDTO } from '@/domain/ports/outbounds'
import { type IValidation } from '@/presentation/contracts'
import { GetUserController } from '@/presentation/controllers'
import { httpResponses } from '@/presentation/interfaces'

describe('GetUserController', () => {
  let getUserUsecase: jest.Mocked<IGetUserUsecase>
  let validator: jest.Mocked<IValidation>
  let getUserController: GetUserController
  let logger: ILogger

  beforeEach(() => {
    logger = {
      debug: jest.fn(),
      error: jest.fn(),
      info: jest.fn(),
      warn: jest.fn()
    } as unknown as jest.Mocked<ILogger>
    getUserUsecase = {
      execute: jest.fn()
    }
    validator = {
      validate: jest.fn()
    }
    getUserController = new GetUserController(getUserUsecase, validator, logger)
  })

  it('should return 200 if user data is retrieved successfully', async () => {
    const getUserData: IGetUserRequestDTO = {
      id: 'valid_user_id'
    }
    const userResponse: IGetUserResponseDTO = {
      user: {
        userId: 'valid_user_id',
        email: 'jane.doe@example.com',
        role: 'ADMIN'
      }
    }
    validator.validate.mockReturnValue(undefined)
    getUserUsecase.execute.mockResolvedValue(userResponse)

    const response = await getUserController.handle(getUserData)

    expect(response).toEqual(httpResponses.http200(userResponse))
    expect(validator.validate).toHaveBeenCalledWith(getUserData)
    expect(getUserUsecase.execute).toHaveBeenCalledWith(getUserData)
  })

  it('should return 400 if validation fails', async () => {
    const getUserData: IGetUserRequestDTO = {
      id: ''
    }
    const validationError = new Error('User ID is required')
    validator.validate.mockReturnValue(validationError)

    const response = await getUserController.handle(getUserData)

    expect(response).toEqual(httpResponses.http400(validationError))
    expect(validator.validate).toHaveBeenCalledWith(getUserData)
    expect(getUserUsecase.execute).not.toHaveBeenCalled()
  })

  it('should return 404 if user is not found', async () => {
    const getUserData: IGetUserRequestDTO = {
      id: 'non_existent_user_id'
    }
    const notFoundError = new NotFoundError('User not found')
    validator.validate.mockReturnValue(undefined)
    getUserUsecase.execute.mockResolvedValue(notFoundError)

    const response = await getUserController.handle(getUserData)

    expect(response).toEqual(httpResponses.http404(notFoundError))
    expect(validator.validate).toHaveBeenCalledWith(getUserData)
    expect(getUserUsecase.execute).toHaveBeenCalledWith(getUserData)
  })

  it('should return 500 if an unexpected error occurs', async () => {
    const getUserData: IGetUserRequestDTO = {
      id: 'any_user_id'
    }
    const unexpectedError = new Error('Internal server error')
    validator.validate.mockReturnValue(undefined)
    getUserUsecase.execute.mockRejectedValue(unexpectedError)

    const response = await getUserController.handle(getUserData)

    expect(response).toEqual(httpResponses.http500(unexpectedError))
    expect(validator.validate).toHaveBeenCalledWith(getUserData)
    expect(getUserUsecase.execute).toHaveBeenCalledWith(getUserData)
  })
})
