import * as shortUuid from 'short-uuid'

import {
  type ISanitezedUser,
  type IUser
} from '@/domain/interfaces/user.interfaces'
import { type ICreateUserRequestDTO } from '@/domain/ports/inbounds'
import { Email, Password } from '@/domain/value-objects'

import { type UserRoles } from '../enums'

export class User {
  static readonly SALT: number = 4

  constructor(
    readonly userId: string,
    readonly email: Email,
    readonly password: Password,
    readonly role: UserRoles
  ) {}

  static async create(input: ICreateUserRequestDTO): Promise<User> {
    const { email, password, role } = input
    const userId = this._generateId()
    const userEmail = Email.create(email)
    const hashedPassword = await Password.create(password)
    return new User(userId, userEmail, hashedPassword, role)
  }

  private static _generateId(): string {
    return shortUuid.generate()
  }

  toReturn(): ISanitezedUser {
    return {
      userId: this.userId,
      email: this.email.value(),
      role: this.role
    }
  }

  toPersistence(): IUser {
    return {
      userId: this.userId,
      email: this.email.value(),
      password: this.password.value(),
      role: this.role
    }
  }
}
