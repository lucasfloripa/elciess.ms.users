import { type IUserRepository } from '@/application/contracts'
import { CreateUserUsecase } from '@/application/usecases'
import { type ILogger } from '@/domain/contracts'
import { User } from '@/domain/entities'
import { UserRoles } from '@/domain/enums'
import { EmailInUseError } from '@/domain/errors'
import { type ICreateUserRequestDTO } from '@/domain/ports/inbounds'
import { Password, Email } from '@/domain/value-objects'

jest.mock('@/domain/entities/user.entity')

describe('CreateUserUsecase', () => {
  let createUserUsecase: CreateUserUsecase
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
      save: jest.fn()
    } as unknown as jest.Mocked<IUserRepository>

    createUserUsecase = new CreateUserUsecase(userRepository, logger)
  })

  it('should create a user successfully', async () => {
    const createUserData: ICreateUserRequestDTO = {
      email: 'test@example.com',
      password: 'password123',
      confirmPassword: 'password123'
    }

    const mockEmail: Email = Email.create('test@example.com')
    const mockPassword = await Password.create('hashed-password')

    const mockUser = new User(
      'user-id',
      mockEmail,
      mockPassword,
      UserRoles.DEFAULT
    )

    jest.spyOn(User, 'create').mockResolvedValueOnce(mockUser)
    userRepository.getUser.mockResolvedValueOnce(null)

    const result = await createUserUsecase.execute(createUserData)

    expect(userRepository.getUser).toHaveBeenCalledWith({
      email: createUserData.email
    })
    expect(User.create).toHaveBeenCalledWith(createUserData)
    expect(userRepository.save).toHaveBeenCalledWith(mockUser.toPersistence())
    expect(result).toEqual({ user: mockUser.toReturn() })
  })

  it('should return EmailInUseError if email is already in use', async () => {
    const createUserData: ICreateUserRequestDTO = {
      email: 'test@example.com',
      password: 'password123',
      confirmPassword: 'password123'
    }

    const existingUser = {
      userId: 'existing-id',
      email: 'test@example.com',
      password: 'hashed',
      role: 'DEFAULT'
    }

    userRepository.getUser.mockResolvedValueOnce(existingUser)

    const result = await createUserUsecase.execute(createUserData)

    expect(userRepository.getUser).toHaveBeenCalledWith({
      email: createUserData.email
    })
    expect(result).toEqual(new EmailInUseError())
    expect(userRepository.save).not.toHaveBeenCalled()
  })
})
