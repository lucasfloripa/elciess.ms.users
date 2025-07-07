import { type IUserRepository } from '@/application/contracts'
import { LogoutUsecase } from '@/application/usecases'
import { type ILogger } from '@/domain/contracts'
import { UserEnums } from '@/domain/enums'
import { NotFoundError } from '@/domain/errors'

describe('LogoutUsecase', () => {
  let logoutUsecase: LogoutUsecase
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

    logoutUsecase = new LogoutUsecase(userRepository, logger)
  })

  it('should return NotFoundError if user does not exist', async () => {
    const userId = 'nonexistent-user'

    userRepository.logout.mockResolvedValueOnce(UserEnums.USER_NOT_FOUND)

    const result = await logoutUsecase.execute(userId)

    expect(userRepository.logout).toHaveBeenCalledWith(userId)
    expect(result).toEqual(new NotFoundError('User not found'))
  })

  it('should return already logged out message if user was already logged out', async () => {
    const userId = 'already-logged-out-user'

    userRepository.logout.mockResolvedValueOnce(UserEnums.ALREADY_LOGGED_OUT)

    const result = await logoutUsecase.execute(userId)

    expect(userRepository.logout).toHaveBeenCalledWith(userId)
    expect(result).toEqual({ message: 'User was already logged out.' })
  })

  it('should return logged out message if user is successfully logged out', async () => {
    const userId = 'valid-user'

    userRepository.logout.mockResolvedValueOnce(UserEnums.SUCCESS)

    const result = await logoutUsecase.execute(userId)

    expect(userRepository.logout).toHaveBeenCalledWith(userId)
    expect(result).toEqual({ message: 'User logged out' })
  })
})
