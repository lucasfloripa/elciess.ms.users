import { User } from '../models'

export interface GetUser {
  execute: (id: string) => Promise<User | null>
}
