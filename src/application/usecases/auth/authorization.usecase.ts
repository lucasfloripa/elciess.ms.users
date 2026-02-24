import { type IPermissionService } from '@/application/contracts'
import { type IAuthorizationUsecase, type ILogger } from '@/domain/contracts'
import { ForbiddenError } from '@/domain/errors'
import { type IAuthorizationRequestDTO } from '@/domain/ports/inbounds'
import { type IAuthorizationResponseDTO } from '@/domain/ports/outbounds'

enum CircuitState {
  CLOSED = 'CLOSED',
  OPEN = 'OPEN',
  HALF_OPEN = 'HALF_OPEN'
}

export class AuthorizationUsecase implements IAuthorizationUsecase {
  private failures: number = 0
  private circuitState: CircuitState = CircuitState.CLOSED
  private lastFailureTime = 0

  private readonly failureThreshold = 3
  private readonly resetTimeout = 10000 // 10s

  constructor(
    private readonly permissionService: IPermissionService,
    private readonly logger: ILogger
  ) {}

  async execute(
    request: IAuthorizationRequestDTO
  ): Promise<IAuthorizationResponseDTO | Error> {
    if (this.circuitState === CircuitState.OPEN) {
      const now = Date.now()

      if (now - this.lastFailureTime > this.resetTimeout) {
        this.logger.warn('Circuit moving to HALF_OPEN')
        this.circuitState = CircuitState.HALF_OPEN
      } else {
        return new ForbiddenError('Authorization service unavailable')
      }
    }

    const { userId, role, action, resource } = request

    try {
      const allowed = await this._retry(
        async () =>
          await this.permissionService.can({
            userId,
            role,
            action,
            resource
          })
      )

      if (!allowed) {
        return new ForbiddenError(
          `User ${userId} is not allowed to perform ${action}`
        )
      }

      this.failures = 0
      this.circuitState = CircuitState.CLOSED

      return { allowed: true }
    } catch (error) {
      this.failures++
      this.lastFailureTime = Date.now()

      this.logger.error(
        'AuthorizationUsecase: Permission service failed',
        error
      )

      if (this.failures >= this.failureThreshold) {
        this.circuitState = CircuitState.OPEN
        this.logger.warn('Circuit opened due to repeated failures')
      }

      return new ForbiddenError('Authorization service unavailable')
    }
  }

  private async _retry(fn, retries = 3, delay = 300): Promise<any> {
    try {
      // eslint-disable-next-line @typescript-eslint/return-await
      return await fn()
    } catch (err) {
      if (retries === 0) throw err
      // eslint-disable-next-line promise/param-names
      await new Promise((r) => setTimeout(r, delay))
      return await this._retry(fn, retries - 1, delay * 2)
    }
  }
}
