import { AuthRoleUsecase } from '../../../../src/application/usecases'

export const makeAuthRoleUsecase = (): AuthRoleUsecase => {
  const usecase = new AuthRoleUsecase()
  return usecase
}
