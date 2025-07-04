import { type IAuthTokenUsecase } from '../../../src/domain/contracts'
import { UnauthorizedError } from '../../../src/domain/errors'
import { type IAuthTokenRequestDTO } from '../../../src/domain/ports/inbounds'
import { htttpResponses } from '../../../src/presentation/interfaces'
import { AuthTokenMiddleware } from '../../../src/presentation/middlewares' // Ajuste o caminho do import do middleware

describe('AuthTokenMiddleware', () => {
  let authTokenUsecase: jest.Mocked<IAuthTokenUsecase>
  let authTokenMiddleware: AuthTokenMiddleware

  beforeEach(() => {
    authTokenUsecase = {
      execute: jest.fn()
    }
    authTokenMiddleware = new AuthTokenMiddleware(authTokenUsecase)
  })

  it('should return 200 with user data if accessToken is valid', async () => {
    const requestData: IAuthTokenRequestDTO = {
      accessToken: 'valid_access_token'
    }
    const usecaseResponse = {
      userId: 'any_user_id',
      role: 'any_role'
    }
    authTokenUsecase.execute.mockResolvedValue(usecaseResponse)

    const response = await authTokenMiddleware.handle(requestData)

    expect(response).toEqual(htttpResponses.http200(usecaseResponse))
    expect(authTokenUsecase.execute).toHaveBeenCalledWith({
      accessToken: requestData.accessToken
    })
  })

  it('should return 401 if accessToken is missing', async () => {
    const requestData: IAuthTokenRequestDTO = {
      accessToken: ''
    }
    const unauthorizedError = new UnauthorizedError('Missing accessToken')

    const response = await authTokenMiddleware.handle(requestData)

    expect(response).toEqual(htttpResponses.http401(unauthorizedError))
    expect(authTokenUsecase.execute).not.toHaveBeenCalled()
  })

  it('should return 401 if accessToken is invalid or expired (UnauthorizedError from usecase)', async () => {
    const requestData: IAuthTokenRequestDTO = {
      accessToken: 'invalid_access_token'
    }
    const unauthorizedError = new UnauthorizedError(
      'Invalid or expired accessToken'
    )
    authTokenUsecase.execute.mockResolvedValue(unauthorizedError)

    const response = await authTokenMiddleware.handle(requestData)

    expect(response).toEqual(htttpResponses.http401(unauthorizedError))
    expect(authTokenUsecase.execute).toHaveBeenCalledWith({
      accessToken: requestData.accessToken
    })
  })

  it('should return 500 if an unexpected error occurs', async () => {
    const requestData: IAuthTokenRequestDTO = {
      accessToken: 'any_token'
    }
    const unexpectedError = new Error('Database connection error')
    authTokenUsecase.execute.mockRejectedValue(unexpectedError)

    const response = await authTokenMiddleware.handle(requestData)

    expect(response).toEqual(htttpResponses.http500(unexpectedError))
    expect(authTokenUsecase.execute).toHaveBeenCalledWith({
      accessToken: requestData.accessToken
    })
  })
})
