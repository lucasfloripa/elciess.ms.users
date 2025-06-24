import { type IUserRepository } from '../../../src/application/contracts'
import { AuthUserUsecase } from '../../../src/application/usecases'
import { User } from '../../../src/domain/entities'
import { UnauthorizedError, ForbiddenError } from '../../../src/domain/errors'
import { type IAuthUserRequestDTO } from '../../../src/domain/ports/inbounds'

describe('AuthUserUsecase', () => {
  let authUserUsecase: AuthUserUsecase
  let userRepository: jest.Mocked<IUserRepository>

  beforeEach(() => {
    userRepository = {
      loadByEmail: jest.fn(),
      save: jest.fn()
    }
    authUserUsecase = new AuthUserUsecase(userRepository)
  })

  it('should authenticate a user successfully', async () => {
    const credentials: IAuthUserRequestDTO = {
      email: 'test@example.com',
      password: 'password123'
    }

    const user = new User(
      'valid_userId',
      credentials.email,
      'valid_hashed_password'
    )

    userRepository.loadByEmail.mockResolvedValueOnce(user)
    jest.spyOn(User, 'comparePassword').mockResolvedValueOnce(true)
    jest.spyOn(User, 'generateToken').mockResolvedValueOnce('token')

    const result = await authUserUsecase.execute(credentials)

    expect(userRepository.loadByEmail).toHaveBeenCalledWith(credentials.email)
    expect(User.comparePassword).toHaveBeenCalledWith(
      credentials.password,
      user.password
    )
    expect(User.generateToken).toHaveBeenCalledWith(user.userId)
    expect(result).toEqual({ token: 'token' })
  })

  it('should return UnauthorizedError if user does not exist', async () => {
    const credentials: IAuthUserRequestDTO = {
      email: 'test@example.com',
      password: 'password123'
    }

    userRepository.loadByEmail.mockResolvedValueOnce(null)

    const result = await authUserUsecase.execute(credentials)

    expect(result).toEqual(new UnauthorizedError())
    expect(userRepository.loadByEmail).toHaveBeenCalledWith(credentials.email)
  })

  it('should return ForbiddenError if password is incorrect', async () => {
    const credentials: IAuthUserRequestDTO = {
      email: 'test@example.com',
      password: 'password123'
    }

    const user = new User(
      'valid_userId',
      credentials.email,
      'valid_hashed_password'
    )

    userRepository.loadByEmail.mockResolvedValueOnce(user)
    jest.spyOn(User, 'comparePassword').mockResolvedValueOnce(false)

    const result = await authUserUsecase.execute(credentials)

    expect(result).toEqual(new ForbiddenError())
    expect(userRepository.loadByEmail).toHaveBeenCalledWith(credentials.email)
    expect(User.comparePassword).toHaveBeenCalledWith(
      credentials.password,
      user.password
    )
  })
})
