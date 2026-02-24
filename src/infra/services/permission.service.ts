import axios from 'axios'

import { type IPermissionService } from '@/application/contracts'
import { type IAuthorizationRequestDTO } from '@/domain/ports/inbounds'

interface PermissionResponse {
  allowed: boolean
}

export class PermissionService implements IPermissionService {
  private readonly http: ReturnType<typeof axios.create>
  private readonly baseURL: string = 'http://localhost:2000/api/permissions'

  constructor() {
    this.http = axios.create({
      baseURL: this.baseURL
    })
  }

  async can(request: IAuthorizationRequestDTO): Promise<boolean> {
    const { userId, role, resource, action } = request

    const response = await this.http.post<PermissionResponse>('/check', {
      userId,
      role,
      resource,
      action
    })

    return response.data.allowed
  }
}
