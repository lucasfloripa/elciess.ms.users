import { type IRefreshTokenUsecase } from '../../../src/domain/contracts'
import { UnauthorizedError } from '../../../src/domain/errors'
import { type IRefreshTokenRequestDTO } from '../../../src/domain/ports/inbounds'
import { type IRefreshTokenResponseDTO } from '../../../src/domain/ports/outbounds'
import { type IValidation } from '../../../src/presentation/contracts'
import { RefreshTokenController } from '../../../src/presentation/controllers'
import { htttpResponses } from '../../../src/presentation/interfaces'

describe('RefreshTokenController', () => {
  let refreshTokenUsecase: jest.Mocked<IRefreshTokenUsecase>
  let validator: jest.Mocked<IValidation>
  let refreshTokenController: RefreshTokenController

  beforeEach(() => {
    refreshTokenUsecase = {
      execute: jest.fn()
    }
    validator = {
      validate: jest.fn()
    }
    refreshTokenController = new RefreshTokenController(
      refreshTokenUsecase,
      validator
    )
  })

  it('should return 200 with new tokens if refresh token is valid', async () => {
    const requestData: IRefreshTokenRequestDTO = {
      refreshToken: 'valid_refresh_token'
    }
    const responseData: IRefreshTokenResponseDTO = {
      accessToken: 'new_access_token',
      refreshToken: 'new_refresh_token'
    }
    validator.validate.mockReturnValue(undefined)
    refreshTokenUsecase.execute.mockResolvedValue(responseData)

    const response = await refreshTokenController.handle(requestData)

    expect(response).toEqual(htttpResponses.http200(responseData))
    expect(validator.validate).toHaveBeenCalledWith(requestData)
    expect(refreshTokenUsecase.execute).toHaveBeenCalledWith(
      requestData.refreshToken
    )
  })

  it('should return 400 if validation fails', async () => {
    const requestData: IRefreshTokenRequestDTO = {
      refreshToken: ''
    }
    const validationError = new Error('Refresh token is required')
    validator.validate.mockReturnValue(validationError)

    const response = await refreshTokenController.handle(requestData)

    expect(response).toEqual(htttpResponses.http400(validationError))
    expect(validator.validate).toHaveBeenCalledWith(requestData)
    expect(refreshTokenUsecase.execute).not.toHaveBeenCalled()
  })

  it('should return 401 if refresh token is invalid or expired (UnauthorizedError)', async () => {
    const requestData: IRefreshTokenRequestDTO = {
      refreshToken: 'invalid_or_expired_token'
    }
    const unauthorizedError = new UnauthorizedError(
      'Invalid or expired refresh token'
    )
    validator.validate.mockReturnValue(undefined)
    refreshTokenUsecase.execute.mockResolvedValue(unauthorizedError)

    const response = await refreshTokenController.handle(requestData)

    expect(response).toEqual(htttpResponses.http401(unauthorizedError))
    expect(validator.validate).toHaveBeenCalledWith(requestData)
    expect(refreshTokenUsecase.execute).toHaveBeenCalledWith(
      requestData.refreshToken
    )
  })

  it('should return 500 if an unexpected error occurs', async () => {
    const requestData: IRefreshTokenRequestDTO = {
      refreshToken: 'any_valid_token'
    }
    const unexpectedError = new Error('Database connection failed')
    validator.validate.mockReturnValue(undefined)
    refreshTokenUsecase.execute.mockRejectedValue(unexpectedError)

    const response = await refreshTokenController.handle(requestData)

    expect(response).toEqual(htttpResponses.http500(unexpectedError))
    expect(validator.validate).toHaveBeenCalledWith(requestData)
    expect(refreshTokenUsecase.execute).toHaveBeenCalledWith(
      requestData.refreshToken
    )
  })
})
