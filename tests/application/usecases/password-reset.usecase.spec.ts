import { type IUserRepository } from '@/application/contracts'
import { PasswordResetUsecase } from '@/application/usecases'
import { type ILogger } from '@/domain/contracts'
import { NotFoundError } from '@/domain/errors'
import { type IUser } from '@/domain/interfaces'

describe('PasswordResetUsecase', () => {
  let passwordResetUsecase: PasswordResetUsecase
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

    passwordResetUsecase = new PasswordResetUsecase(userRepository, logger)
  })

  it('should return NotFoundError if user does not exist', async () => {
    const email = 'nonexistent@example.com'
    userRepository.getUser.mockResolvedValueOnce(null)

    const result = await passwordResetUsecase.execute(email)

    expect(userRepository.getUser).toHaveBeenCalledWith({ email })
    expect(result).toEqual(new NotFoundError('User not found'))
  })

  it('should return success message if user exists', async () => {
    const email = 'user@example.com'
    const dbUser: IUser = {
      userId: 'user-id',
      email,
      password: 'hashed-password',
      role: 'USER',
      refreshToken: 'token'
    }
    userRepository.getUser.mockResolvedValueOnce(dbUser)

    const result = await passwordResetUsecase.execute(email)

    expect(userRepository.getUser).toHaveBeenCalledWith({ email })
    expect(result).toEqual({ message: 'Passord reseted' })
  })
})
