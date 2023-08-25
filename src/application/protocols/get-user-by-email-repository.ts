import { User } from '../../domain/models'

export interface GetUserByEmail {
  getByEmail: (email: string) => Promise<User | null>
}
