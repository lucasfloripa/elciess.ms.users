import { type IAuthRoleUsecase, type ILogger } from '@/domain/contracts'
import { ForbiddenError } from '@/domain/errors'

export class AuthRoleUsecase implements IAuthRoleUsecase {
  constructor(private readonly logger: ILogger) {}

  async execute(role: string, requiredRole: string): Promise<void | Error> {
    this.logger.info('Init AuthRoleUsecase')
    this.logger.debug('AuthRoleUsecase: Checking role authorization', {
      role,
      requiredRole
    })

    if (role !== requiredRole) {
      this.logger.warn(
        `AuthRoleUsecase: Access denied. Role '${role}' does not match required role '${requiredRole}'`,
        { role, requiredRole }
      )
      return new ForbiddenError('Access denied for role ' + role)
    }

    this.logger.info('Completed AuthRoleUsecase')
    this.logger.debug('AuthRoleUsecase: Role authorized successfully', {
      role,
      requiredRole
    })
  }
}
