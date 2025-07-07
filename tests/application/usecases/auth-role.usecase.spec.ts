import { AuthRoleUsecase } from '@/application/usecases'
import { type ILogger } from '@/domain/contracts'
import { ForbiddenError } from '@/domain/errors'

describe('AuthRoleUsecase', () => {
  let authRoleUsecase: AuthRoleUsecase
  let logger: ILogger

  beforeEach(() => {
    logger = {
      debug: jest.fn(),
      error: jest.fn(),
      info: jest.fn(),
      warn: jest.fn()
    } as unknown as jest.Mocked<ILogger>
    authRoleUsecase = new AuthRoleUsecase(logger)
  })

  it('should authorize when roles match', async () => {
    const role = 'ADMIN'
    const requiredRole = 'ADMIN'

    const result = await authRoleUsecase.execute(role, requiredRole)

    expect(result).toBeUndefined()
  })

  it('should return ForbiddenError when roles do not match', async () => {
    const role = 'DEFAULT'
    const requiredRole = 'ADMIN'

    const result = await authRoleUsecase.execute(role, requiredRole)

    expect(result).toBeInstanceOf(ForbiddenError)
  })
})
