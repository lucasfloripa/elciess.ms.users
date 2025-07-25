import { type ILogger, type IPasswordResetUsecase } from '@/domain/contracts'
import { NotFoundError } from '@/domain/errors'
import { type IPasswordResetRequestDTO } from '@/domain/ports/inbounds'
import { type IPasswordResetResponseDTO } from '@/domain/ports/outbounds'
import { type IValidation } from '@/presentation/contracts'
import { PasswordResetController } from '@/presentation/controllers'
import { httpResponses } from '@/presentation/interfaces'

describe('PasswordResetController', () => {
  let passwordResetUsecase: jest.Mocked<IPasswordResetUsecase>
  let validator: jest.Mocked<IValidation>
  let passwordResetController: PasswordResetController
  let logger: ILogger

  beforeEach(() => {
    logger = {
      debug: jest.fn(),
      error: jest.fn(),
      info: jest.fn(),
      warn: jest.fn()
    } as unknown as jest.Mocked<ILogger>
    passwordResetUsecase = {
      execute: jest.fn()
    }
    validator = {
      validate: jest.fn()
    }
    passwordResetController = new PasswordResetController(
      passwordResetUsecase,
      validator,
      logger
    )
  })

  it('should return 200 if password reset email is sent successfully', async () => {
    const requestData: IPasswordResetRequestDTO = {
      email: 'valid_email@mail.com'
    }
    const responseData: IPasswordResetResponseDTO = {
      message: 'Password reset email sent'
    }
    validator.validate.mockReturnValue(undefined)
    passwordResetUsecase.execute.mockResolvedValue(responseData)

    const response = await passwordResetController.handle(requestData)

    expect(response).toEqual(httpResponses.http200(responseData))
    expect(validator.validate).toHaveBeenCalledWith(requestData)
    expect(passwordResetUsecase.execute).toHaveBeenCalledWith(requestData.email)
  })

  it('should return 400 if validation fails', async () => {
    const requestData: IPasswordResetRequestDTO = {
      email: 'invalid_email'
    }
    const validationError = new Error('Invalid email format')
    validator.validate.mockReturnValue(validationError)

    const response = await passwordResetController.handle(requestData)

    expect(response).toEqual(httpResponses.http400(validationError))
    expect(validator.validate).toHaveBeenCalledWith(requestData)
    expect(passwordResetUsecase.execute).not.toHaveBeenCalled()
  })

  it('should return 404 if email is not found (NotFoundError)', async () => {
    const requestData: IPasswordResetRequestDTO = {
      email: 'non_existent_email@mail.com'
    }
    const notFoundError = new NotFoundError('Email not found')
    validator.validate.mockReturnValue(undefined)
    passwordResetUsecase.execute.mockResolvedValue(notFoundError)

    const response = await passwordResetController.handle(requestData)

    expect(response).toEqual(httpResponses.http404(notFoundError))
    expect(validator.validate).toHaveBeenCalledWith(requestData)
    expect(passwordResetUsecase.execute).toHaveBeenCalledWith(requestData.email)
  })

  it('should return 500 if an unexpected error occurs', async () => {
    const requestData: IPasswordResetRequestDTO = {
      email: 'any_email@mail.com'
    }
    const unexpectedError = new Error('Email service unavailable')
    validator.validate.mockReturnValue(undefined)
    passwordResetUsecase.execute.mockRejectedValue(unexpectedError)

    const response = await passwordResetController.handle(requestData)

    expect(response).toEqual(httpResponses.http500(unexpectedError))
    expect(validator.validate).toHaveBeenCalledWith(requestData)
    expect(passwordResetUsecase.execute).toHaveBeenCalledWith(requestData.email)
  })
})
