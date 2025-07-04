import * as shortUuid from 'short-uuid'

import { UserRoles } from '@/domain/enums'
import {
  type ISanitezedUser,
  type IUser
} from '@/domain/interfaces/user.interfaces'
import { type ICreateUserRequestDTO } from '@/domain/ports/inbounds'
import { Email, Password } from '@/domain/value-objects'

export class User {
  static readonly SALT: number = 4
  static readonly JWT_SECRET: string = String(process.env.JWT_SECRET)

  constructor(
    readonly userId: string,
    readonly email: Email,
    readonly password: Password,
    readonly role: string
  ) {}

  static async create(input: ICreateUserRequestDTO): Promise<User> {
    const { email, password } = input
    const userId = this._generateId()
    const userEmail = Email.create(email)
    const hashedPassword = await Password.create(password)
    const defaultRole = UserRoles.DEFAULT
    return new User(userId, userEmail, hashedPassword, defaultRole)
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
