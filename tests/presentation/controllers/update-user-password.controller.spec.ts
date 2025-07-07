import {
  type ILogger,
  type IUpdateUserPasswordUsecase
} from '@/domain/contracts'
import { ConflictError, NotFoundError } from '@/domain/errors'
import { type IUpdateUserPasswordRequestDTO } from '@/domain/ports/inbounds'
import { type IUpdateUserPasswordResponseDTO } from '@/domain/ports/outbounds'
import { type IValidation } from '@/presentation/contracts'
import { UpdateUserPasswordController } from '@/presentation/controllers'
import { httpResponses } from '@/presentation/interfaces'

describe('UpdateUserPasswordController', () => {
  let updateUserPasswordUsecase: jest.Mocked<IUpdateUserPasswordUsecase>
  let validator: jest.Mocked<IValidation>
  let updateUserPasswordController: UpdateUserPasswordController
  let logger: ILogger

  beforeEach(() => {
    logger = {
      debug: jest.fn(),
      error: jest.fn(),
      info: jest.fn(),
      warn: jest.fn()
    } as unknown as jest.Mocked<ILogger>
    updateUserPasswordUsecase = {
      execute: jest.fn()
    }
    validator = {
      validate: jest.fn()
    }
    updateUserPasswordController = new UpdateUserPasswordController(
      updateUserPasswordUsecase,
      validator,
      logger
    )
  })

  it('should return 200 if user password is updated successfully', async () => {
    const requestData: IUpdateUserPasswordRequestDTO = {
      userId: 'valid_user_id',
      password: 'old_password',
      newPassword: 'new_password',
      confirmPassword: 'new_password'
    }
    const responseData: IUpdateUserPasswordResponseDTO = {
      message: 'Password Changed'
    }
    validator.validate.mockReturnValue(undefined)
    updateUserPasswordUsecase.execute.mockResolvedValue(responseData)

    const response = await updateUserPasswordController.handle(requestData)

    expect(response).toEqual(httpResponses.http200(responseData))
    expect(validator.validate).toHaveBeenCalledWith(requestData)
    expect(updateUserPasswordUsecase.execute).toHaveBeenCalledWith(requestData)
  })

  it('should return 400 if validation fails', async () => {
    const requestData: IUpdateUserPasswordRequestDTO = {
      userId: 'valid_user_id',
      password: 'old_password',
      newPassword: 'new_password',
      confirmPassword: 'wrong_confirmation'
    }
    const validationError = new Error(
      'New password and confirmation do not match'
    )
    validator.validate.mockReturnValue(validationError)

    const response = await updateUserPasswordController.handle(requestData)

    expect(response).toEqual(httpResponses.http400(validationError))
    expect(validator.validate).toHaveBeenCalledWith(requestData)
    expect(updateUserPasswordUsecase.execute).not.toHaveBeenCalled()
  })

  it('should return 404 if user is not found', async () => {
    const requestData: IUpdateUserPasswordRequestDTO = {
      userId: 'non_existent_user_id',
      password: 'old_password',
      newPassword: 'new_password',
      confirmPassword: 'new_password'
    }
    const notFoundError = new NotFoundError('User not found')
    validator.validate.mockReturnValue(undefined)
    updateUserPasswordUsecase.execute.mockResolvedValue(notFoundError)

    const response = await updateUserPasswordController.handle(requestData)

    expect(response).toEqual(httpResponses.http404(notFoundError))
    expect(validator.validate).toHaveBeenCalledWith(requestData)
    expect(updateUserPasswordUsecase.execute).toHaveBeenCalledWith(requestData)
  })

  it('should return 409 if old password is incorrect (ConflictError)', async () => {
    const requestData: IUpdateUserPasswordRequestDTO = {
      userId: 'valid_user_id',
      password: 'wrong_old_password',
      newPassword: 'new_password',
      confirmPassword: 'new_password'
    }
    const conflictError = new ConflictError('Incorrect old password')
    validator.validate.mockReturnValue(undefined)
    updateUserPasswordUsecase.execute.mockResolvedValue(conflictError)

    const response = await updateUserPasswordController.handle(requestData)

    expect(response).toEqual(httpResponses.http409(conflictError))
    expect(validator.validate).toHaveBeenCalledWith(requestData)
    expect(updateUserPasswordUsecase.execute).toHaveBeenCalledWith(requestData)
  })

  it('should return 500 if an unexpected error occurs', async () => {
    const requestData: IUpdateUserPasswordRequestDTO = {
      userId: 'any_user_id',
      password: 'any_password',
      newPassword: 'new_password',
      confirmPassword: 'new_password'
    }
    const unexpectedError = new Error('Database connection error')
    validator.validate.mockReturnValue(undefined)
    updateUserPasswordUsecase.execute.mockRejectedValue(unexpectedError)

    const response = await updateUserPasswordController.handle(requestData)

    expect(response).toEqual(httpResponses.http500(unexpectedError))
    expect(validator.validate).toHaveBeenCalledWith(requestData)
    expect(updateUserPasswordUsecase.execute).toHaveBeenCalledWith(requestData)
  })
})
