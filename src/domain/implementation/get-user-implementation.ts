import { User } from '../../domain/models'

export interface GetUserImplementation {
  getUser: (id: string) => Promise<User | null>
}
