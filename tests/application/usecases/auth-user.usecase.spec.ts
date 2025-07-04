import {
  type ITokenService,
  type IUserRepository
} from '@/application/contracts'
import { AuthUserUsecase } from '@/application/usecases'
import { UnauthorizedError, ForbiddenError } from '@/domain/errors'
import { type IUser } from '@/domain/interfaces'
import { type IAuthUserRequestDTO } from '@/domain/ports/inbounds'
import { Password } from '@/domain/value-objects'

describe('AuthUserUsecase', () => {
  let authUserUsecase: AuthUserUsecase
  let userRepository: jest.Mocked<IUserRepository>
  let tokenService: jest.Mocked<ITokenService>

  beforeEach(() => {
    userRepository = {
      getUser: jest.fn(),
      saveRefreshToken: jest.fn()
    } as unknown as jest.Mocked<IUserRepository>
    tokenService = {
      generateAccessToken: jest.fn(),
      generateRefreshToken: jest.fn()
    } as unknown as jest.Mocked<ITokenService>
    authUserUsecase = new AuthUserUsecase(userRepository, tokenService)
  })

  it('should authenticate a user successfully', async () => {
    const credentials: IAuthUserRequestDTO = {
      email: 'test@example.com',
      password: 'password123'
    }

    const user: IUser = {
      email: 'any_email',
      password: 'any_password',
      role: 'DEFAULT',
      userId: 'any_id',
      refreshToken: 'any_refreshToken'
    }

    userRepository.getUser.mockResolvedValueOnce(user)
    jest.spyOn(Password, 'comparePassword').mockResolvedValueOnce(true)
    jest
      .spyOn(tokenService, 'generateAccessToken')
      .mockResolvedValueOnce('accessToken')
    jest
      .spyOn(tokenService, 'generateRefreshToken')
      .mockResolvedValueOnce('refreshToken')

    const result = await authUserUsecase.execute(credentials)

    expect(userRepository.getUser).toHaveBeenCalledWith({
      email: credentials.email
    })
    expect(Password.comparePassword).toHaveBeenCalledWith(
      credentials.password,
      user.password
    )
    expect(tokenService.generateAccessToken).toHaveBeenCalledWith({
      userId: user.userId,
      role: user.role
    })
    expect(tokenService.generateRefreshToken).toHaveBeenCalledWith({
      userId: user.userId,
      role: user.role
    })
    expect(userRepository.saveRefreshToken).toHaveBeenCalledWith(
      user.userId,
      'refreshToken'
    )
    expect(result).toEqual({
      accessToken: 'accessToken',
      refreshToken: 'refreshToken'
    })
  })

  it('should return UnauthorizedError if user does not exist', async () => {
    const credentials: IAuthUserRequestDTO = {
      email: 'test@example.com',
      password: 'password123'
    }

    userRepository.getUser.mockResolvedValueOnce(null)

    const result = await authUserUsecase.execute(credentials)

    expect(userRepository.getUser).toHaveBeenCalledWith({
      email: credentials.email
    })
    expect(result).toEqual(new UnauthorizedError('User not found'))
  })

  it('should return ForbiddenError if password is incorrect', async () => {
    const credentials: IAuthUserRequestDTO = {
      email: 'test@example.com',
      password: 'password123'
    }

    const user: IUser = {
      email: 'any_email',
      password: 'any_password',
      role: 'DEFAULT',
      userId: 'any_id',
      refreshToken: 'any_refreshToken'
    }

    userRepository.getUser.mockResolvedValueOnce(user)
    jest.spyOn(Password, 'comparePassword').mockResolvedValueOnce(false)

    const result = await authUserUsecase.execute(credentials)

    expect(userRepository.getUser).toHaveBeenCalledWith({
      email: credentials.email
    })
    expect(Password.comparePassword).toHaveBeenCalledWith(
      credentials.password,
      user.password
    )
    expect(result).toEqual(new ForbiddenError('Invalid Password'))
  })
})
