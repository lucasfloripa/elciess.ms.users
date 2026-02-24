export interface IRoleGuardUsecase {
  execute: (role: string, requiredRole: string) => Promise<void | Error>
}
