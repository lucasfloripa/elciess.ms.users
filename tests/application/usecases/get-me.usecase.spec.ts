import { type IUserRepository } from '@/application/contracts'
import { GetMeUsecase } from '@/application/usecases'
import { type ILogger } from '@/domain/contracts'
import { UserRoles } from '@/domain/enums'
import { NotFoundError } from '@/domain/errors'
import { type IUser } from '@/domain/interfaces'

describe('GetMeUsecase', () => {
  let getMeUsecase: GetMeUsecase
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

    getMeUsecase = new GetMeUsecase(userRepository, logger)
  })

  it('should return NotFoundError if user is not found in DB', async () => {
    const userId = 'user-id'

    userRepository.getUser.mockResolvedValueOnce(null)

    const result = await getMeUsecase.execute(userId)

    expect(userRepository.getUser).toHaveBeenCalledWith({ userId: 'user-id' })
    expect(result).toEqual(new NotFoundError('User not found'))
  })

  it('should return email and role from user when user exists in DB', async () => {
    const userId = 'user-id'

    const dbUser: IUser = {
      userId: 'user-id',
      email: 'john@example.com',
      role: UserRoles.ORGANIZATION_USER,
      password: 'hashed-password'
    }

    userRepository.getUser.mockResolvedValueOnce(dbUser)

    const result = await getMeUsecase.execute(userId)

    expect(userRepository.getUser).toHaveBeenCalledWith({ userId: 'user-id' })

    expect(result).toEqual({
      email: dbUser.email,
      role: dbUser.role
    })
  })
})
