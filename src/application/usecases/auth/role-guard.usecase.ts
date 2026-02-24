import { type IRoleGuardUsecase, type ILogger } from '@/domain/contracts'
import { ForbiddenError } from '@/domain/errors'

export class RoleGuardUsecase implements IRoleGuardUsecase {
  constructor(private readonly logger: ILogger) {}

  async execute(role: string, requiredRole: string): Promise<void | Error> {
    this.logger.info('Init RoleGuardUsecase')
    this.logger.debug('RoleGuardUsecase: Checking role authorization', {
      role,
      requiredRole
    })

    if (role !== requiredRole) {
      this.logger.warn(
        `RoleGuardUsecase: Access denied. Role '${role}' does not match required role '${requiredRole}'`,
        { role, requiredRole }
      )
      return new ForbiddenError('Access denied for role ' + role)
    }

    this.logger.info('Completed RoleGuardUsecase')
    this.logger.debug('RoleGuardUsecase: Role authorized successfully', {
      role,
      requiredRole
    })
  }
}
