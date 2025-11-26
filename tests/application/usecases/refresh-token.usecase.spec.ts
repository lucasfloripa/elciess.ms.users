import { type ITokenService, type ICacheService } from '@/application/contracts'
import { RefreshTokenUsecase } from '@/application/usecases'
import { type ILogger } from '@/domain/contracts'
import { ForbiddenError, UnauthorizedError } from '@/domain/errors'
import { type IUserTokenInfos } from '@/domain/interfaces'

describe('RefreshTokenUsecase', () => {
  let refreshTokenUsecase: RefreshTokenUsecase
  let tokenService: jest.Mocked<ITokenService>
  let cacheService: jest.Mocked<ICacheService>
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

    cacheService = {
      get: jest.fn(),
      set: jest.fn(),
      delete: jest.fn()
    } as unknown as jest.Mocked<ICacheService>

    refreshTokenUsecase = new RefreshTokenUsecase(
      tokenService,
      cacheService,
      logger
    )
  })

  it('should return UnauthorizedError for invalid format token', async () => {
    const refreshToken = 'invalid-token'
    tokenService.verifyRefreshToken.mockResolvedValueOnce('JsonWebTokenError')

    const result = await refreshTokenUsecase.execute(refreshToken)

    expect(result).toEqual(new UnauthorizedError('Invalid format token'))
  })

  it('should return UnauthorizedError for expired token', async () => {
    const refreshToken = 'expired-token'
    tokenService.verifyRefreshToken.mockResolvedValueOnce('TokenExpiredError')

    const result = await refreshTokenUsecase.execute(refreshToken)

    expect(result).toEqual(new UnauthorizedError('Expired token'))
  })

  it('should return ForbiddenError when refresh token is not found in Redis', async () => {
    const refreshToken = 'valid-refresh-token'
    const payload: IUserTokenInfos = { userId: 'user-id', role: 'DEFAULT' }

    tokenService.verifyRefreshToken.mockResolvedValueOnce(payload)
    cacheService.get.mockResolvedValueOnce(null) // Redis não tem o token

    const result = await refreshTokenUsecase.execute(refreshToken)

    expect(result).toEqual(
      new ForbiddenError('Refresh token revoked or invalidated')
    )
  })

  it('should return UnauthorizedError when refresh token in Redis mismatches', async () => {
    const refreshToken = 'valid-refresh-token'
    const payload: IUserTokenInfos = { userId: 'user-id', role: 'DEFAULT' }

    tokenService.verifyRefreshToken.mockResolvedValueOnce(payload)
    cacheService.get.mockResolvedValueOnce('other-refresh-token') // mismatch

    const result = await refreshTokenUsecase.execute(refreshToken)

    expect(result).toEqual(
      new UnauthorizedError('Refresh token revoked or invalidated')
    )
  })

  it('should generate a new access token on valid refresh token', async () => {
    const refreshToken = 'valid-refresh-token'
    const payload: IUserTokenInfos = { userId: 'user-id', role: 'DEFAULT' }

    tokenService.verifyRefreshToken.mockResolvedValueOnce(payload)
    cacheService.get.mockResolvedValueOnce(refreshToken)
    tokenService.generateAccessToken.mockResolvedValueOnce('new-access-token')

    const result = await refreshTokenUsecase.execute(refreshToken)

    expect(tokenService.verifyRefreshToken).toHaveBeenCalledWith(refreshToken)
    expect(cacheService.get).toHaveBeenCalledWith('refreshToken:user-id')
    expect(tokenService.generateAccessToken).toHaveBeenCalledWith(payload)
    expect(result).toEqual({ accessToken: 'new-access-token' })
  })
})
