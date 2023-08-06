import { User } from '../../domain/models'

export interface GetUserRequestDTO {
  id: string
}

export interface GetUserResponseDTO {
  user: User
}
