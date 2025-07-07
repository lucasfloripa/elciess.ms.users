import { type ILogoutUsecase } from '@/domain/contracts'
import { NotFoundError } from '@/domain/errors'
import { type ILogoutRequestDTO } from '@/domain/ports/inbounds'
import { type ILogoutResponseDTO } from '@/domain/ports/outbounds'
import { type IValidation } from '@/presentation/contracts'
import { LogoutController } from '@/presentation/controllers'
import { httpResponses } from '@/presentation/interfaces'

describe('LogoutController', () => {
  let logoutUsecase: jest.Mocked<ILogoutUsecase>
  let validator: jest.Mocked<IValidation>
  let logoutController: LogoutController

  beforeEach(() => {
    logoutUsecase = {
      execute: jest.fn()
    }
    validator = {
      validate: jest.fn()
    }
    logoutController = new LogoutController(logoutUsecase, validator)
  })

  it('should return 200 if logout is successful', async () => {
    const requestData: ILogoutRequestDTO = {
      userId: 'valid_user_id'
    }
    const responseData: ILogoutResponseDTO = {
      message: 'User logged out successfully'
    }
    validator.validate.mockReturnValue(undefined)
    logoutUsecase.execute.mockResolvedValue(responseData)

    const response = await logoutController.handle(requestData)

    expect(response).toEqual(httpResponses.http200(responseData))
    expect(validator.validate).toHaveBeenCalledWith(requestData)
    expect(logoutUsecase.execute).toHaveBeenCalledWith(requestData.userId)
  })

  it('should return 400 if validation fails', async () => {
    const requestData: ILogoutRequestDTO = {
      userId: ''
    }
    const validationError = new Error('User ID is required')
    validator.validate.mockReturnValue(validationError)

    const response = await logoutController.handle(requestData)

    expect(response).toEqual(httpResponses.http400(validationError))
    expect(validator.validate).toHaveBeenCalledWith(requestData)
    expect(logoutUsecase.execute).not.toHaveBeenCalled()
  })

  it('should return 404 if user is not found (NotFoundError)', async () => {
    const requestData: ILogoutRequestDTO = {
      userId: 'non_existent_user_id'
    }
    const notFoundError = new NotFoundError('User not found')
    validator.validate.mockReturnValue(undefined)
    logoutUsecase.execute.mockResolvedValue(notFoundError)

    const response = await logoutController.handle(requestData)

    expect(response).toEqual(httpResponses.http404(notFoundError))
    expect(validator.validate).toHaveBeenCalledWith(requestData)
    expect(logoutUsecase.execute).toHaveBeenCalledWith(requestData.userId)
  })

  it('should return 500 if an unexpected error occurs', async () => {
    const requestData: ILogoutRequestDTO = {
      userId: 'any_user_id'
    }
    const unexpectedError = new Error('Session service unavailable')
    validator.validate.mockReturnValue(undefined)
    logoutUsecase.execute.mockRejectedValue(unexpectedError)

    const response = await logoutController.handle(requestData)

    expect(response).toEqual(httpResponses.http500(unexpectedError))
    expect(validator.validate).toHaveBeenCalledWith(requestData)
    expect(logoutUsecase.execute).toHaveBeenCalledWith(requestData.userId)
  })
})
