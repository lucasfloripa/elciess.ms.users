import {
  type IUserRepository,
  type ICacheService
} from '@/application/contracts'
import { GetMeUsecase } from '@/application/usecases'
import { type ILogger } from '@/domain/contracts'
import { NotFoundError } from '@/domain/errors'
import { type IUser } from '@/domain/interfaces'

describe('GetMeUsecase', () => {
  let getMeUsecase: GetMeUsecase
  let userRepository: jest.Mocked<IUserRepository>
  let cacheService: jest.Mocked<ICacheService>
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

    cacheService = {
      get: jest.fn(),
      set: jest.fn()
    } as unknown as jest.Mocked<ICacheService>

    getMeUsecase = new GetMeUsecase(userRepository, cacheService, logger)
  })

  it('should return user from cache if exists', async () => {
    const userId = 'cached-user-id'
    const cachedResponse = {
      user: {
        userId,
        email: 'cached@example.com',
        role: 'DEFAULT'
      }
    }

    cacheService.get.mockResolvedValueOnce(cachedResponse)

    const result = await getMeUsecase.execute(userId)

    expect(cacheService.get).toHaveBeenCalledWith(userId)
    expect(userRepository.getUser).not.toHaveBeenCalled()
    expect(result).toEqual(cachedResponse)
  })

  it('should return user from DB and cache it if not found in cache', async () => {
    const userId = 'db-user-id'
    const dbUser: IUser = {
      userId,
      email: 'user@example.com',
      password: 'hashed-password',
      role: 'ADMIN',
      refreshToken: 'any-token'
    }

    cacheService.get.mockResolvedValueOnce(null)
    userRepository.getUser.mockResolvedValueOnce(dbUser)

    const result = await getMeUsecase.execute(userId)

    expect(cacheService.get).toHaveBeenCalledWith(userId)
    expect(userRepository.getUser).toHaveBeenCalledWith({ userId })
    expect(cacheService.set).toHaveBeenCalledWith(userId, {
      user: {
        userId: dbUser.userId,
        email: dbUser.email,
        role: dbUser.role,
        refreshToken: dbUser.refreshToken
      }
    })

    expect(result).toEqual({
      user: {
        userId: dbUser.userId,
        email: dbUser.email,
        role: dbUser.role,
        refreshToken: dbUser.refreshToken
      }
    })
  })

  it('should return NotFoundError if user is not found in cache or DB', async () => {
    const userId = 'not-found-id'

    cacheService.get.mockResolvedValueOnce(null)
    userRepository.getUser.mockResolvedValueOnce(null)

    const result = await getMeUsecase.execute(userId)

    expect(cacheService.get).toHaveBeenCalledWith(userId)
    expect(userRepository.getUser).toHaveBeenCalledWith({ userId })
    expect(result).toEqual(new NotFoundError('User not found'))
  })
})
