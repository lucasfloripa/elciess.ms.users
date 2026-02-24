import { type IAuthorizationRequestDTO } from '@/domain/ports/inbounds'

export interface IPermissionService {
  can: (request: IAuthorizationRequestDTO) => Promise<boolean>
}
