export interface IAuthRoleUsecase {
  execute: (role: string, requiredRole: string) => Promise<void | Error>
}
