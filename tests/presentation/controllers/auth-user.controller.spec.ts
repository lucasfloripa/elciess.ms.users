import { type IAuthUserUsecase } from '../../../src/domain/contracts'
import { UnauthorizedError, ForbiddenError } from '../../../src/domain/errors'
import { type IUserCredentialsDTO } from '../../../src/domain/ports/inbounds'
import { type IAuthUserResponseDTO } from '../../../src/domain/ports/outbounds'
import { type IValidation } from '../../../src/presentation/contracts'
import { AuthUserController } from '../../../src/presentation/controllers'
import { htttpResponses } from '../../../src/presentation/interfaces'

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

  it('should return 400 if validation fails', async () => {
    const credentials: IUserCredentialsDTO = {
      email: 'invalid_email',
      password: 'valid_password'
    }
    const validationError = new Error('Validation error')
    validator.validate.mockReturnValue(validationError)

    const response = await authUserController.handle(credentials)

    expect(response).toEqual(htttpResponses.http400(validationError))
    expect(validator.validate).toHaveBeenCalledWith(credentials)
    expect(authUserUsecase.execute).not.toHaveBeenCalled()
  })

  it('should return 200 if user is authenticated successfully', async () => {
    const credentials: IUserCredentialsDTO = {
      email: 'valid_email@mail.com',
      password: 'valid_password'
    }
    const token: IAuthUserResponseDTO = {
      token: 'valid_token'
    }
    validator.validate.mockReturnValue(undefined)
    authUserUsecase.execute.mockResolvedValue(token)

    const response = await authUserController.handle(credentials)

    expect(response).toEqual(htttpResponses.http200(token))
    expect(validator.validate).toHaveBeenCalledWith(credentials)
    expect(authUserUsecase.execute).toHaveBeenCalledWith(credentials)
  })

  it('should return 401 if user is not found', async () => {
    const credentials: IUserCredentialsDTO = {
      email: 'valid_email@mail.com',
      password: 'valid_password'
    }
    const error = new UnauthorizedError()
    validator.validate.mockReturnValue(undefined)
    authUserUsecase.execute.mockResolvedValue(error)

    const response = await authUserController.handle(credentials)

    expect(response).toEqual(htttpResponses.http401(error))
    expect(validator.validate).toHaveBeenCalledWith(credentials)
    expect(authUserUsecase.execute).toHaveBeenCalledWith(credentials)
  })

  it('should return 403 if invalid password is provided', async () => {
    const credentials: IUserCredentialsDTO = {
      email: 'valid_email@mail.com',
      password: 'valid_password'
    }
    const error = new ForbiddenError()
    validator.validate.mockReturnValue(undefined)
    authUserUsecase.execute.mockResolvedValue(error)

    const response = await authUserController.handle(credentials)

    expect(response).toEqual(htttpResponses.http403(error))
    expect(validator.validate).toHaveBeenCalledWith(credentials)
    expect(authUserUsecase.execute).toHaveBeenCalledWith(credentials)
  })

  it('should handle errors and return appropriate response', async () => {
    const credentials: IUserCredentialsDTO = {
      email: 'valid_email@mail.com',
      password: 'valid_password'
    }
    const error = new Error('Some error')
    validator.validate.mockReturnValue(undefined)
    authUserUsecase.execute.mockRejectedValue(error)

    const response = await authUserController.handle(credentials)

    expect(response).toEqual(htttpResponses.http500(error))
    expect(validator.validate).toHaveBeenCalledWith(credentials)
    expect(authUserUsecase.execute).toHaveBeenCalledWith(credentials)
  })
})
