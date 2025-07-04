import { type IAuthRoleUsecase } from '@/domain/contracts'
import { ForbiddenError } from '@/domain/errors'

export class AuthRoleUsecase implements IAuthRoleUsecase {
  async execute(role: string, requiredRole: string): Promise<void | Error> {
    if (role !== requiredRole)
      return new ForbiddenError('Access denied for role ' + role)
  }
}
