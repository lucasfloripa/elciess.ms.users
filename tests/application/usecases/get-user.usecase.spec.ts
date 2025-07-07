import { type IUserRepository } from '@/application/contracts'
import { GetUserUsecase } from '@/application/usecases'
import { type ILogger } from '@/domain/contracts'
import { NotFoundError } from '@/domain/errors'
import { type IUser } from '@/domain/interfaces'
import { type IGetUserRequestDTO } from '@/domain/ports/inbounds'

describe('GetUserUsecase', () => {
  let getUserUsecase: GetUserUsecase
  let userRepository: jest.Mocked<IUserRepository>
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

    getUserUsecase = new GetUserUsecase(userRepository, logger)
  })

  it('should return sanitized user when found', async () => {
    const request: IGetUserRequestDTO = { id: 'user-id' }

    const dbUser: IUser = {
      userId: 'user-id',
      email: 'user@example.com',
      password: 'hashed-password',
      role: 'ADMIN',
      refreshToken: 'any-token'
    }

    userRepository.getUser.mockResolvedValueOnce(dbUser)

    const result = await getUserUsecase.execute(request)

    expect(userRepository.getUser).toHaveBeenCalledWith({ userId: request.id })
    expect(result).toEqual({
      user: {
        userId: dbUser.userId,
        email: dbUser.email,
        role: dbUser.role,
        refreshToken: dbUser.refreshToken
      }
    })
  })

  it('should return NotFoundError when user is not found', async () => {
    const request: IGetUserRequestDTO = { id: 'nonexistent-user' }

    userRepository.getUser.mockResolvedValueOnce(null)

    const result = await getUserUsecase.execute(request)

    expect(userRepository.getUser).toHaveBeenCalledWith({ userId: request.id })
    expect(result).toEqual(new NotFoundError('User not found'))
  })
})
