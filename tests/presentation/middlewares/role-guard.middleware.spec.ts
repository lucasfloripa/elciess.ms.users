import { type ILogger, type IRoleGuardUsecase } from '@/domain/contracts'
import { ForbiddenError } from '@/domain/errors'
import { type IRoleGuardRequestDTO } from '@/domain/ports/inbounds'
import { httpResponses } from '@/presentation/interfaces'
import { RoleGuardMiddleware } from '@/presentation/middlewares'

describe('RoleGuardMiddleware', () => {
  let roleGuardUsecase: jest.Mocked<IRoleGuardUsecase>
  let roleGuardMiddleware: RoleGuardMiddleware
  let logger: ILogger

  const requiredRole = 'ADMIN'

  beforeEach(() => {
    logger = {
      debug: jest.fn(),
      error: jest.fn(),
      info: jest.fn(),
      warn: jest.fn()
    } as unknown as jest.Mocked<ILogger>
    roleGuardUsecase = {
      execute: jest.fn()
    }
    roleGuardMiddleware = new RoleGuardMiddleware(
      roleGuardUsecase,
      requiredRole,
      logger
    )
  })

  it('should return 200 if the user has the required role', async () => {
    const requestData: IRoleGuardRequestDTO = {
      role: 'ADMIN'
    }
    roleGuardUsecase.execute.mockResolvedValue(undefined)

    const response = await roleGuardMiddleware.handle(requestData)

    expect(response).toEqual(httpResponses.http200({}))
    expect(roleGuardUsecase.execute).toHaveBeenCalledWith(
      requestData.role,
      requiredRole
    )
  })

  it('should return 401 if the user does not have the required role (ForbiddenError from usecase)', async () => {
    const requestData: IRoleGuardRequestDTO = {
      role: 'USER'
    }
    const forbiddenError = new ForbiddenError(
      'Access denied: insufficient role'
    )
    roleGuardUsecase.execute.mockResolvedValue(forbiddenError)

    const response = await roleGuardMiddleware.handle(requestData)

    expect(response).toEqual(httpResponses.http403(forbiddenError))
    expect(roleGuardUsecase.execute).toHaveBeenCalledWith(
      requestData.role,
      requiredRole
    )
  })

  it('should return 500 if an unexpected error occurs', async () => {
    const requestData: IRoleGuardRequestDTO = {
      role: 'ADMIN'
    }
    const unexpectedError = new Error('Role check service unavailable')
    roleGuardUsecase.execute.mockRejectedValue(unexpectedError)

    const response = await roleGuardMiddleware.handle(requestData)

    expect(response).toEqual(httpResponses.http500(unexpectedError))
    expect(roleGuardUsecase.execute).toHaveBeenCalledWith(
      requestData.role,
      requiredRole
    )
  })
})
