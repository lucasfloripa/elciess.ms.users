import {
  type IUserRepository,
  type IMessagerService
} from '@/application/contracts'
import { PasswordResetUsecase } from '@/application/usecases'
import { NotFoundError } from '@/domain/errors'
import { type IUser } from '@/domain/interfaces'

describe('PasswordResetUsecase', () => {
  let passwordResetUsecase: PasswordResetUsecase
  let userRepository: jest.Mocked<IUserRepository>
  let messagerService: jest.Mocked<IMessagerService>

  beforeEach(() => {
    userRepository = {
      getUser: jest.fn()
    } as unknown as jest.Mocked<IUserRepository>
    messagerService = {
      sendMessage: jest.fn()
    } as unknown as jest.Mocked<IMessagerService>

    passwordResetUsecase = new PasswordResetUsecase(
      userRepository,
      messagerService
    )
  })

  it('should return NotFoundError if user does not exist', async () => {
    const email = 'nonexistent@example.com'
    userRepository.getUser.mockResolvedValueOnce(null)

    const result = await passwordResetUsecase.execute(email)

    expect(userRepository.getUser).toHaveBeenCalledWith({ email })
    expect(result).toEqual(new NotFoundError('User not found'))
    expect(messagerService.sendMessage).not.toHaveBeenCalled()
  })

  it('should send password reset message and return success message if user exists', async () => {
    const email = 'user@example.com'
    const dbUser: IUser = {
      userId: 'user-id',
      email,
      password: 'hashed-password',
      role: 'DEFAULT',
      refreshToken: 'token'
    }
    userRepository.getUser.mockResolvedValueOnce(dbUser)
    messagerService.sendMessage.mockResolvedValueOnce(undefined) // or Promise.resolve()

    const result = await passwordResetUsecase.execute(email)

    expect(userRepository.getUser).toHaveBeenCalledWith({ email })
    expect(messagerService.sendMessage).toHaveBeenCalledWith(
      'user.notifications',
      'user.password_reset',
      email
    )
    expect(result).toEqual({ message: 'Passord reseted' })
  })
})
