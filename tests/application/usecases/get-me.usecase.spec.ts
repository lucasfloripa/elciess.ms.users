import {
  type IUserRepository,
  type ITokenService
} from '@/application/contracts'
import { GetMeUsecase } from '@/application/usecases'
import { type ILogger } from '@/domain/contracts'
import { NotFoundError } from '@/domain/errors'
import { type IUser } from '@/domain/interfaces'

describe('GetMeUsecase', () => {
  let getMeUsecase: GetMeUsecase
  let userRepository: jest.Mocked<IUserRepository>
  let tokenService: jest.Mocked<ITokenService>
  let logger: ILogger

  beforeEach(() => {
    logger = {
      debug: jest.fn(),
      error: jest.fn(),
      info: jest.fn(),
      warn: jest.fn()
    } as unknown as jest.Mocked<ILogger>

    userRepository = {
      getUser: jest.fn()
    } as unknown as jest.Mocked<IUserRepository>

    tokenService = {
      verifyAccessToken: jest.fn(),
      generateAccessToken: jest.fn(),
      generateRefreshToken: jest.fn()
    } as unknown as jest.Mocked<ITokenService>

    getMeUsecase = new GetMeUsecase(userRepository, tokenService, logger)
  })

  it('should return NotFoundError if user is not found in DB', async () => {
    const accessToken = 'access-token'

    tokenService.verifyAccessToken.mockResolvedValueOnce({
      userId: 'user-id',
      role: 'USER'
    })

    userRepository.getUser.mockResolvedValueOnce(null)

    const result = await getMeUsecase.execute(accessToken)

    expect(userRepository.getUser).toHaveBeenCalledWith({ userId: 'user-id' })
    expect(result).toEqual(new NotFoundError('User not found'))
  })

  it('should return email and role from user when user exists in DB', async () => {
    const accessToken = 'valid-token'

    const dbUser: IUser = {
      userId: 'user-id',
      email: 'john@example.com',
      role: 'USER',
      password: 'hashed-password'
    }

    tokenService.verifyAccessToken.mockResolvedValueOnce({
      userId: 'user-id',
      role: 'USER'
    })

    userRepository.getUser.mockResolvedValueOnce(dbUser)

    const result = await getMeUsecase.execute(accessToken)

    expect(tokenService.verifyAccessToken).toHaveBeenCalledWith(accessToken)
    expect(userRepository.getUser).toHaveBeenCalledWith({ userId: 'user-id' })

    expect(result).toEqual({
      email: dbUser.email,
      role: dbUser.role
    })
  })
})
