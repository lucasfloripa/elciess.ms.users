import { type IAuthorizationUsecase, type ILogger } from '@/domain/contracts'
import {
  ForbiddenError,
  UnauthorizedError,
  MissingParamError
} from '@/domain/errors'
import { AuthorizationMiddleware } from '@/presentation/middlewares'

describe('AuthorizationMiddleware', () => {
  let authorizationMiddleware: AuthorizationMiddleware
  let authorizationUsecase: jest.Mocked<IAuthorizationUsecase>
  let logger: jest.Mocked<ILogger>

  beforeEach(() => {
    logger = {
      debug: jest.fn(),
      error: jest.fn(),
      info: jest.fn(),
      warn: jest.fn()
    } as unknown as jest.Mocked<ILogger>

    authorizationUsecase = {
      execute: jest.fn()
    } as unknown as jest.Mocked<IAuthorizationUsecase>

    authorizationMiddleware = new AuthorizationMiddleware(
      authorizationUsecase,
      logger
    )
  })

  it('should return 401 when userId is missing', async () => {
    const request = {
      userId: '',
      role: 'ADMIN',
      action: 'CREATE',
      resource: 'USER'
    }

    const result = await authorizationMiddleware.handle(request)

    expect(result.statusCode).toBe(401)
    expect(result.body).toEqual(new UnauthorizedError('Unauthenticated user'))
  })

  it('should return 400 when action is missing', async () => {
    const request = {
      userId: 'user-id',
      role: 'ADMIN',
      action: '',
      resource: 'USER'
    }

    const result = await authorizationMiddleware.handle(request)

    expect(result.statusCode).toBe(400)
    expect(result.body).toEqual(
      new MissingParamError('Missing authorization action')
    )
  })

  it('should return 403 when usecase returns ForbiddenError', async () => {
    const request = {
      userId: 'user-id',
      role: 'ADMIN',
      action: 'DELETE',
      resource: 'USER'
    }

    authorizationUsecase.execute.mockResolvedValueOnce(
      new ForbiddenError('Access denied')
    )

    const result = await authorizationMiddleware.handle(request)

    expect(authorizationUsecase.execute).toHaveBeenCalledWith(request)
    expect(result.statusCode).toBe(403)
    expect(result.body).toEqual(new ForbiddenError('Access denied'))
  })

  it('should return 200 when authorization succeeds', async () => {
    const request = {
      userId: 'user-id',
      role: 'ADMIN',
      action: 'CREATE',
      resource: 'USER'
    }

    authorizationUsecase.execute.mockResolvedValueOnce({ allowed: true })

    const result = await authorizationMiddleware.handle(request)

    expect(authorizationUsecase.execute).toHaveBeenCalledWith(request)
    expect(result.statusCode).toBe(200)
    expect(result.body).toEqual({})
  })

  it('should return 500 when usecase throws', async () => {
    const request = {
      userId: 'user-id',
      role: 'ADMIN',
      action: 'CREATE',
      resource: 'USER'
    }

    authorizationUsecase.execute.mockRejectedValueOnce(
      new Error('Unexpected error')
    )

    const result = await authorizationMiddleware.handle(request)

    expect(result.statusCode).toBe(500)
  })
})
