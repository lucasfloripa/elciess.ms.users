import { type IUserRepository } from '@/application/contracts'
import { GetUsersUsecase } from '@/application/usecases'
import { type ILogger } from '@/domain/contracts'
import { NotFoundError } from '@/domain/errors'
import { type IUser } from '@/domain/interfaces'

describe('GetUsersUsecase', () => {
  let getUsersUsecase: GetUsersUsecase
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
      getUser: jest.fn(),
      getUsers: jest.fn(),
      save: jest.fn(),
      deleteUser: jest.fn(),
      logout: jest.fn(),
      saveRefreshToken: jest.fn(),
      updateUserPassword: jest.fn()
    }

    getUsersUsecase = new GetUsersUsecase(userRepository, logger)
  })

  it('should return list of sanitized users when users exist', async () => {
    const dbUsers: IUser[] = [
      {
        userId: 'user-1',
        email: 'user1@example.com',
        password: 'hashed1',
        role: 'ADMIN',
        refreshToken: 'token1'
      },
      {
        userId: 'user-2',
        email: 'user2@example.com',
        password: 'hashed2',
        role: 'DEFAULT',
        refreshToken: 'token2'
      }
    ]

    userRepository.getUsers.mockResolvedValueOnce(dbUsers)

    const result = await getUsersUsecase.execute()

    expect(userRepository.getUsers).toHaveBeenCalled()
    expect(result).toEqual({
      users: [
        {
          userId: 'user-1',
          email: 'user1@example.com',
          role: 'ADMIN',
          refreshToken: 'token1'
        },
        {
          userId: 'user-2',
          email: 'user2@example.com',
          role: 'DEFAULT',
          refreshToken: 'token2'
        }
      ]
    })
  })

  it('should return NotFoundError when no users found', async () => {
    userRepository.getUsers.mockResolvedValueOnce(null)

    const result = await getUsersUsecase.execute()

    expect(userRepository.getUsers).toHaveBeenCalled()
    expect(result).toEqual(new NotFoundError('No user found'))
  })
})
