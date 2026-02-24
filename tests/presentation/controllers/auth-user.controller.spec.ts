import { type ILogger, type ILoginUsecase } from '@/domain/contracts'
import { UnauthorizedError, ForbiddenError } from '@/domain/errors'
import { type ILoginRequestDTO } from '@/domain/ports/inbounds'
import { type ILoginResponseDTO } from '@/domain/ports/outbounds'
import { type IValidation } from '@/presentation/contracts'
import { LoginController } from '@/presentation/controllers'
import { httpResponses } from '@/presentation/interfaces'

describe('LoginController', () => {
  let loginUsecase: jest.Mocked<ILoginUsecase>
  let validator: jest.Mocked<IValidation>
  let authUserController: LoginController
  let logger: ILogger

  beforeEach(() => {
    logger = {
      debug: jest.fn(),
      error: jest.fn(),
      info: jest.fn(),
      warn: jest.fn()
    } as unknown as jest.Mocked<ILogger>
    loginUsecase = {
      execute: jest.fn()
    }
    validator = {
      validate: jest.fn()
    }
    authUserController = new LoginController(loginUsecase, validator, logger)
  })

  it('should return 200 if user is authenticated successfully', async () => {
    const credentials: ILoginRequestDTO = {
      email: 'valid_email@mail.com',
      password: 'valid_password'
    }
    const tokens: ILoginResponseDTO = {
      accessToken: 'valid_token',
      refreshTokenCookie: {
        maxAge: 3600,
        value: 'valid_refresh_token'
      }
    }
    validator.validate.mockReturnValue(undefined)
    loginUsecase.execute.mockResolvedValue(tokens)

    const response = await authUserController.handle(credentials)

    expect(response).toEqual(httpResponses.http200(tokens))
    expect(validator.validate).toHaveBeenCalledWith(credentials)
    expect(loginUsecase.execute).toHaveBeenCalledWith(credentials)
  })

  it('should return 400 if validation fails', async () => {
    const credentials: ILoginRequestDTO = {
      email: 'invalid_email',
      password: 'valid_password'
    }
    const validationError = new Error('Validation error')
    validator.validate.mockReturnValue(validationError)

    const response = await authUserController.handle(credentials)

    expect(response).toEqual(httpResponses.http400(validationError))
    expect(validator.validate).toHaveBeenCalledWith(credentials)
    expect(loginUsecase.execute).not.toHaveBeenCalled()
  })

  it('should return 401 if user is not found', async () => {
    const credentials: ILoginRequestDTO = {
      email: 'valid_email@mail.com',
      password: 'valid_password'
    }
    const error = new UnauthorizedError('User not found')
    validator.validate.mockReturnValue(undefined)
    loginUsecase.execute.mockResolvedValue(error)

    const response = await authUserController.handle(credentials)

    expect(response).toEqual(httpResponses.http401(error))
    expect(validator.validate).toHaveBeenCalledWith(credentials)
    expect(loginUsecase.execute).toHaveBeenCalledWith(credentials)
  })

  it('should return 403 if invalid password is provided', async () => {
    const credentials: ILoginRequestDTO = {
      email: 'valid_email@mail.com',
      password: 'valid_password'
    }
    const error = new ForbiddenError('Invalid password')
    validator.validate.mockReturnValue(undefined)
    loginUsecase.execute.mockResolvedValue(error)

    const response = await authUserController.handle(credentials)

    expect(response).toEqual(httpResponses.http403(error))
    expect(validator.validate).toHaveBeenCalledWith(credentials)
    expect(loginUsecase.execute).toHaveBeenCalledWith(credentials)
  })

  it('should return 500 if an unexpected error accurs', async () => {
    const credentials: ILoginRequestDTO = {
      email: 'valid_email@mail.com',
      password: 'valid_password'
    }
    const error = new Error('Some error')
    validator.validate.mockReturnValue(undefined)
    loginUsecase.execute.mockRejectedValue(error)

    const response = await authUserController.handle(credentials)

    expect(response).toEqual(httpResponses.http500(error))
    expect(validator.validate).toHaveBeenCalledWith(credentials)
    expect(loginUsecase.execute).toHaveBeenCalledWith(credentials)
  })
})
