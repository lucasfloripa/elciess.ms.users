import { type IAuthRoleUsecase } from '../../../src/domain/contracts'
import { ForbiddenError } from '../../../src/domain/errors'
import { type IAuthRoleRequestDTO } from '../../../src/domain/ports/inbounds'
import { htttpResponses } from '../../../src/presentation/interfaces'
import { AuthRoleMiddleware } from '../../../src/presentation/middlewares'

describe('AuthRoleMiddleware', () => {
  let authRoleUsecase: jest.Mocked<IAuthRoleUsecase>
  let authRoleMiddleware: AuthRoleMiddleware
  const requiredRole = 'ADMIN'

  beforeEach(() => {
    authRoleUsecase = {
      execute: jest.fn()
    }
    authRoleMiddleware = new AuthRoleMiddleware(authRoleUsecase, requiredRole)
  })

  it('should return 200 if the user has the required role', async () => {
    const requestData: IAuthRoleRequestDTO = {
      role: 'ADMIN'
    }
    authRoleUsecase.execute.mockResolvedValue(undefined)

    const response = await authRoleMiddleware.handle(requestData)

    expect(response).toEqual(htttpResponses.http200({}))
    expect(authRoleUsecase.execute).toHaveBeenCalledWith(
      requestData.role,
      requiredRole
    )
  })

  it('should return 401 if the user does not have the required role (ForbiddenError from usecase)', async () => {
    const requestData: IAuthRoleRequestDTO = {
      role: 'USER'
    }
    const forbiddenError = new ForbiddenError(
      'Access denied: insufficient role'
    )
    authRoleUsecase.execute.mockResolvedValue(forbiddenError)

    const response = await authRoleMiddleware.handle(requestData)

    expect(response).toEqual(htttpResponses.http401(forbiddenError))
    expect(authRoleUsecase.execute).toHaveBeenCalledWith(
      requestData.role,
      requiredRole
    )
  })

  it('should return 500 if an unexpected error occurs', async () => {
    const requestData: IAuthRoleRequestDTO = {
      role: 'ADMIN'
    }
    const unexpectedError = new Error('Role check service unavailable')
    authRoleUsecase.execute.mockRejectedValue(unexpectedError)

    const response = await authRoleMiddleware.handle(requestData)

    expect(response).toEqual(htttpResponses.http500(unexpectedError))
    expect(authRoleUsecase.execute).toHaveBeenCalledWith(
      requestData.role,
      requiredRole
    )
  })
})
