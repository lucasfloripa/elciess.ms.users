import { User } from '@src/domain/models'

export interface GetUserImplementation {
  getUser: (id: string) => Promise<User | null>
}
