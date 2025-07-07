import { type IAuthUserUsecase } from '@/domain/contracts'
import { UnauthorizedError, ForbiddenError } from '@/domain/errors'
import { type IAuthUserRequestDTO } from '@/domain/ports/inbounds'
import { type IAuthUserResponseDTO } from '@/domain/ports/outbounds'
import { type IValidation } from '@/presentation/contracts'
import { AuthUserController } from '@/presentation/controllers'
import { httpResponses } from '@/presentation/interfaces'

describe('AuthUserController', () => {
  let authUserUsecase: jest.Mocked<IAuthUserUsecase>
  let validator: jest.Mocked<IValidation>
  let authUserController: AuthUserController

  beforeEach(() => {
    authUserUsecase = {
      execute: jest.fn()
    }
    validator = {
      validate: jest.fn()
    }
    authUserController = new AuthUserController(authUserUsecase, validator)
  })

  it('should return 200 if user is authenticated successfully', async () => {
    const credentials: IAuthUserRequestDTO = {
      email: 'valid_email@mail.com',
      password: 'valid_password'
    }
    const tokens: IAuthUserResponseDTO = {
      accessToken: 'valid_token',
      refreshToken: 'refresh_token'
    }
    validator.validate.mockReturnValue(undefined)
    authUserUsecase.execute.mockResolvedValue(tokens)

    const response = await authUserController.handle(credentials)

    expect(response).toEqual(httpResponses.http200(tokens))
    expect(validator.validate).toHaveBeenCalledWith(credentials)
    expect(authUserUsecase.execute).toHaveBeenCalledWith(credentials)
  })

  it('should return 400 if validation fails', async () => {
    const credentials: IAuthUserRequestDTO = {
      email: 'invalid_email',
      password: 'valid_password'
    }
    const validationError = new Error('Validation error')
    validator.validate.mockReturnValue(validationError)

    const response = await authUserController.handle(credentials)

    expect(response).toEqual(httpResponses.http400(validationError))
    expect(validator.validate).toHaveBeenCalledWith(credentials)
    expect(authUserUsecase.execute).not.toHaveBeenCalled()
  })

  it('should return 401 if user is not found', async () => {
    const credentials: IAuthUserRequestDTO = {
      email: 'valid_email@mail.com',
      password: 'valid_password'
    }
    const error = new UnauthorizedError('User not found')
    validator.validate.mockReturnValue(undefined)
    authUserUsecase.execute.mockResolvedValue(error)

    const response = await authUserController.handle(credentials)

    expect(response).toEqual(httpResponses.http401(error))
    expect(validator.validate).toHaveBeenCalledWith(credentials)
    expect(authUserUsecase.execute).toHaveBeenCalledWith(credentials)
  })

  it('should return 403 if invalid password is provided', async () => {
    const credentials: IAuthUserRequestDTO = {
      email: 'valid_email@mail.com',
      password: 'valid_password'
    }
    const error = new ForbiddenError('Invalid password')
    validator.validate.mockReturnValue(undefined)
    authUserUsecase.execute.mockResolvedValue(error)

    const response = await authUserController.handle(credentials)

    expect(response).toEqual(httpResponses.http403(error))
    expect(validator.validate).toHaveBeenCalledWith(credentials)
    expect(authUserUsecase.execute).toHaveBeenCalledWith(credentials)
  })

  it('should return 500 if an unexpected error accurs', async () => {
    const credentials: IAuthUserRequestDTO = {
      email: 'valid_email@mail.com',
      password: 'valid_password'
    }
    const error = new Error('Some error')
    validator.validate.mockReturnValue(undefined)
    authUserUsecase.execute.mockRejectedValue(error)

    const response = await authUserController.handle(credentials)

    expect(response).toEqual(httpResponses.http500(error))
    expect(validator.validate).toHaveBeenCalledWith(credentials)
    expect(authUserUsecase.execute).toHaveBeenCalledWith(credentials)
  })
})
