import { type ITokenService } from '@/application/contracts'
import { RefreshTokenUsecase } from '@/application/usecases'
import { type ILogger } from '@/domain/contracts'
import { UnauthorizedError } from '@/domain/errors'
import { type IUserTokenInfos } from '@/domain/interfaces'

describe('RefreshTokenUsecase', () => {
  let refreshTokenUsecase: RefreshTokenUsecase
  let tokenService: jest.Mocked<ITokenService>
  let logger: ILogger

  beforeEach(() => {
    logger = {
      debug: jest.fn(),
      error: jest.fn(),
      info: jest.fn(),
      warn: jest.fn()
    } as unknown as jest.Mocked<ILogger>
    tokenService = {
      verifyRefreshToken: jest.fn(),
      generateAccessToken: jest.fn(),
      generateRefreshToken: jest.fn()
    } as unknown as jest.Mocked<ITokenService>

    refreshTokenUsecase = new RefreshTokenUsecase(tokenService, logger)
  })

  it('should return UnauthorizedError if token format is invalid', async () => {
    const refreshToken = 'invalid-token'

    tokenService.verifyRefreshToken.mockResolvedValueOnce('JsonWebTokenError')

    const result = await refreshTokenUsecase.execute(refreshToken)

    expect(tokenService.verifyRefreshToken).toHaveBeenCalledWith(refreshToken)
    expect(result).toEqual(new UnauthorizedError('Invalid format token'))
  })

  it('should return UnauthorizedError if token is expired', async () => {
    const refreshToken = 'expired-token'

    tokenService.verifyRefreshToken.mockResolvedValueOnce('TokenExpiredError')

    const result = await refreshTokenUsecase.execute(refreshToken)

    expect(tokenService.verifyRefreshToken).toHaveBeenCalledWith(refreshToken)
    expect(result).toEqual(new UnauthorizedError('Expired token'))
  })

  it('should generate new tokens and return them on valid payload', async () => {
    const refreshToken = 'valid-refresh-token'
    const payload: IUserTokenInfos = {
      userId: 'user-id',
      role: 'DEFAULT'
    }

    tokenService.verifyRefreshToken.mockResolvedValueOnce(payload)
    tokenService.generateAccessToken.mockResolvedValueOnce('new-access-token')
    tokenService.generateRefreshToken.mockResolvedValueOnce('new-refresh-token')

    const result = await refreshTokenUsecase.execute(refreshToken)

    expect(tokenService.verifyRefreshToken).toHaveBeenCalledWith(refreshToken)
    expect(tokenService.generateAccessToken).toHaveBeenCalledWith(payload)
    expect(tokenService.generateRefreshToken).toHaveBeenCalledWith(payload)
    expect(result).toEqual({
      accessToken: 'new-access-token',
      refreshToken: 'new-refresh-token'
    })
  })
})
