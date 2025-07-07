import { type IUserRepository } from '@/application/contracts'
import { DeleteUserUsecase } from '@/application/usecases'
import { type ILogger } from '@/domain/contracts'
import { NotFoundError } from '@/domain/errors'

describe('DeleteUserUsecase', () => {
  let deleteUserUsecase: DeleteUserUsecase
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
      deleteUser: jest.fn()
    } as unknown as jest.Mocked<IUserRepository>

    deleteUserUsecase = new DeleteUserUsecase(userRepository, logger)
  })

  it('should delete user successfully', async () => {
    const userId = 'user-id'

    userRepository.deleteUser.mockResolvedValueOnce(true)

    const result = await deleteUserUsecase.execute(userId)

    expect(userRepository.deleteUser).toHaveBeenCalledWith(userId)
    expect(result).toBe(true)
  })

  it('should return NotFoundError if user was not found', async () => {
    const userId = 'non-existent-id'

    userRepository.deleteUser.mockResolvedValueOnce(false)

    const result = await deleteUserUsecase.execute(userId)

    expect(userRepository.deleteUser).toHaveBeenCalledWith(userId)
    expect(result).toEqual(new NotFoundError('User not found'))
  })
})
