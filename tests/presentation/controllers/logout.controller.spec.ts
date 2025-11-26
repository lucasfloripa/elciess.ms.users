import { type ILogger, type ILogoutUsecase } from '@/domain/contracts'
import { type ILogoutResponseDTO } from '@/domain/ports/outbounds'
import { LogoutController } from '@/presentation/controllers'
import { httpResponses } from '@/presentation/interfaces'

describe('LogoutController', () => {
  let logoutUsecase: jest.Mocked<ILogoutUsecase>
  let logoutController: LogoutController
  let logger: ILogger

  beforeEach(() => {
    logger = {
      debug: jest.fn(),
      error: jest.fn(),
      info: jest.fn(),
      warn: jest.fn()
    } as unknown as jest.Mocked<ILogger>
    logoutUsecase = {
      execute: jest.fn()
    }
    logoutController = new LogoutController(logoutUsecase, logger)
  })

  it('should return 200 if logout is successful', async () => {
    const responseData: ILogoutResponseDTO = {
      message: 'User logged out successfully'
    }
    logoutUsecase.execute.mockResolvedValue(responseData)

    const response = await logoutController.handle()

    expect(response).toEqual(httpResponses.http200(responseData))
    expect(logoutUsecase.execute).toHaveBeenCalledWith()
  })

  it('should return 500 if an unexpected error occurs', async () => {
    const unexpectedError = new Error('Session service unavailable')
    logoutUsecase.execute.mockRejectedValueOnce(unexpectedError)

    const response = await logoutController.handle()

    expect(response).toEqual(httpResponses.http500(unexpectedError))
    expect(logoutUsecase.execute).toHaveBeenCalledWith()
  })
})
