import { type ILogger, type IAuthenticationUsecase } from '@/domain/contracts'
import { UnauthorizedError } from '@/domain/errors'
import { type IAuthenticationRequestDTO } from '@/domain/ports/inbounds'
import { httpResponses } from '@/presentation/interfaces'
import { AuthenticationMiddleware } from '@/presentation/middlewares'

describe('AuthenticationMiddleware', () => {
  let authenticationUsecase: jest.Mocked<IAuthenticationUsecase>
  let authTokenMiddleware: AuthenticationMiddleware
  let logger: ILogger

  beforeEach(() => {
    logger = {
      debug: jest.fn(),
      error: jest.fn(),
      info: jest.fn(),
      warn: jest.fn()
    } as unknown as jest.Mocked<ILogger>
    authenticationUsecase = {
      execute: jest.fn()
    }
    authTokenMiddleware = new AuthenticationMiddleware(
      authenticationUsecase,
      logger
    )
  })

  it('should return 200 with user data if accessToken is valid', async () => {
    const requestData: IAuthenticationRequestDTO = {
      accessToken: 'valid_access_token'
    }
    const usecaseResponse = {
      userId: 'any_user_id',
      role: 'any_role'
    }
    authenticationUsecase.execute.mockResolvedValue(usecaseResponse)

    const response = await authTokenMiddleware.handle(requestData)

    expect(response).toEqual(httpResponses.http200(usecaseResponse))
    expect(authenticationUsecase.execute).toHaveBeenCalledWith({
      accessToken: requestData.accessToken
    })
  })

  it('should return 401 if accessToken is missing', async () => {
    const requestData: IAuthenticationRequestDTO = {
      accessToken: ''
    }
    const unauthorizedError = new UnauthorizedError('Missing accessToken')

    const response = await authTokenMiddleware.handle(requestData)

    expect(response).toEqual(httpResponses.http401(unauthorizedError))
    expect(authenticationUsecase.execute).not.toHaveBeenCalled()
  })

  it('should return 401 if accessToken is invalid or expired (UnauthorizedError from usecase)', async () => {
    const requestData: IAuthenticationRequestDTO = {
      accessToken: 'invalid_access_token'
    }
    const unauthorizedError = new UnauthorizedError(
      'Invalid or expired accessToken'
    )
    authenticationUsecase.execute.mockResolvedValue(unauthorizedError)

    const response = await authTokenMiddleware.handle(requestData)

    expect(response).toEqual(httpResponses.http401(unauthorizedError))
    expect(authenticationUsecase.execute).toHaveBeenCalledWith({
      accessToken: requestData.accessToken
    })
  })

  it('should return 500 if an unexpected error occurs', async () => {
    const requestData: IAuthenticationRequestDTO = {
      accessToken: 'any_token'
    }
    const unexpectedError = new Error('Database connection error')
    authenticationUsecase.execute.mockRejectedValue(unexpectedError)

    const response = await authTokenMiddleware.handle(requestData)

    expect(response).toEqual(httpResponses.http500(unexpectedError))
    expect(authenticationUsecase.execute).toHaveBeenCalledWith({
      accessToken: requestData.accessToken
    })
  })
})
