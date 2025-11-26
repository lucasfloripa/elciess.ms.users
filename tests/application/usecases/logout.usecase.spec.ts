import { LogoutUsecase } from '@/application/usecases'
import { type ILogger } from '@/domain/contracts'

describe('LogoutUsecase', () => {
  let logoutUsecase: LogoutUsecase
  let logger: ILogger

  beforeEach(() => {
    logger = {
      debug: jest.fn(),
      error: jest.fn(),
      info: jest.fn(),
      warn: jest.fn()
    } as unknown as jest.Mocked<ILogger>

    logoutUsecase = new LogoutUsecase(logger)
  })

  it('should return logged out message with refreshTokenCookie empty', async () => {
    const result = await logoutUsecase.execute()
    expect(result).toEqual({
      message: 'User logged out',
      refreshTokenCookie: { value: '', maxAge: 0 }
    })
  })
})
