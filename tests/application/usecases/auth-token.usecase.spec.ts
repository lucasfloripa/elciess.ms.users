import { type ITokenService } from '@/application/contracts'
import { AuthTokenUsecase } from '@/application/usecases'
import { type ILogger } from '@/domain/contracts'
import { UnauthorizedError } from '@/domain/errors'

describe('AuthTokenUsecase', () => {
  let authTokenUsecase: AuthTokenUsecase
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
      verifyAccessToken: jest.fn()
    } as unknown as jest.Mocked<ITokenService>

    authTokenUsecase = new AuthTokenUsecase(tokenService, logger)
  })

  it('should return userId and role when accessToken is valid', async () => {
    const accessToken = 'valid.token.here'
    const userTokenInfos = {
      userId: 'user-id',
      role: 'ADMIN'
    }

    tokenService.verifyAccessToken.mockResolvedValueOnce(userTokenInfos)

    const result = await authTokenUsecase.execute({ accessToken })

    expect(tokenService.verifyAccessToken).toHaveBeenCalledWith(accessToken)
    expect(result).toEqual(userTokenInfos)
  })

  it('should return UnauthorizedError when token is malformed', async () => {
    const accessToken = 'invalid.token'
    tokenService.verifyAccessToken.mockResolvedValueOnce('JsonWebTokenError')

    const result = await authTokenUsecase.execute({ accessToken })

    expect(tokenService.verifyAccessToken).toHaveBeenCalledWith(accessToken)
    expect(result).toEqual(new UnauthorizedError('Invalid format token'))
  })

  it('should return UnauthorizedError when token is expired', async () => {
    const accessToken = 'expired.token'
    tokenService.verifyAccessToken.mockResolvedValueOnce('TokenExpiredError')

    const result = await authTokenUsecase.execute({ accessToken })

    expect(tokenService.verifyAccessToken).toHaveBeenCalledWith(accessToken)
    expect(result).toEqual(new UnauthorizedError('Expired token'))
  })
})
