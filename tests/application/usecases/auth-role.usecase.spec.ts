import { AuthRoleUsecase } from '@/application/usecases'
import { ForbiddenError } from '@/domain/errors'

describe('AuthRoleUsecase', () => {
  let authRoleUsecase: AuthRoleUsecase

  beforeEach(() => {
    authRoleUsecase = new AuthRoleUsecase()
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
