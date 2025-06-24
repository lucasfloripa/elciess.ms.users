import { type IUserRepository } from '../../../src/application/contracts'
import { CreateUserUsecase } from '../../../src/application/usecases'
import { User } from '../../../src/domain/entities'
import { EmailInUseError } from '../../../src/domain/errors'
import { type ICreateUserRequestDTO } from '../../../src/domain/ports/inbounds'

describe('CreateUserUsecase', () => {
  let createUserUsecase: CreateUserUsecase
  let userRepository: jest.Mocked<IUserRepository>

  beforeEach(() => {
    userRepository = {
      loadByEmail: jest.fn(),
      save: jest.fn()
    }
    createUserUsecase = new CreateUserUsecase(userRepository)
  })

  it('should create a user successfully', async () => {
    const createUserData: ICreateUserRequestDTO = {
      email: 'test@example.com',
      password: 'password123',
      confirmPassword: 'password123'
    }

    userRepository.loadByEmail.mockResolvedValueOnce(null)
    const user = new User(
      'valid_userId',
      createUserData.email,
      'valid_hashed_password'
    )
    jest.spyOn(User, 'create').mockResolvedValueOnce(user)

    const result = await createUserUsecase.execute(createUserData)

    expect(userRepository.loadByEmail).toHaveBeenCalledWith(
      createUserData.email
    )
    expect(User.create).toHaveBeenCalledWith(createUserData)
    expect(userRepository.save).toHaveBeenCalledWith(user)
    expect(result).toEqual({ user: { ...user, password: undefined } })
  })

  it('should return EmailInUseError if email is already in use', async () => {
    const createUserData: ICreateUserRequestDTO = {
      email: 'test@example.com',
      password: 'password123',
      confirmPassword: 'password123'
    }

    const user = new User(
      'valid_userId',
      createUserData.email,
      'valid_hashed_password'
    )

    userRepository.loadByEmail.mockResolvedValueOnce(user)

    const result = await createUserUsecase.execute(createUserData)

    expect(result).toEqual(new EmailInUseError())
    expect(userRepository.loadByEmail).toHaveBeenCalledWith(
      createUserData.email
    )
    expect(userRepository.save).not.toHaveBeenCalled()
  })
})
