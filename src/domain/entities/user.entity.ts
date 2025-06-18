import * as shortUuid from 'short-uuid'

import { type ISanitezedUser, type IUser } from '../interfaces/user.interfaces'
import { type ICreateUserDTO } from '../ports/inbounds'
import { Email, Password } from '../value-objects'

export class User {
  static readonly SALT: number = 4
  static readonly JWT_SECRET: string = String(process.env.JWT_SECRET)

  constructor(
    readonly userId: string,
    readonly email: Email,
    readonly password: Password
  ) {}

  static async create(input: ICreateUserDTO): Promise<User> {
    const { email, password } = input
    const userId = this._generateId()
    const userEmail = Email.create(email)
    const hashedPassword = await Password.create(password)
    return new User(userId, userEmail, hashedPassword)
  }

  private static _generateId(): string {
    return shortUuid.generate()
  }

  toReturn(): ISanitezedUser {
    return {
      userId: this.userId,
      email: this.email.value()
    }
  }

  toPersistence(): IUser {
    return {
      userId: this.userId,
      email: this.email.value(),
      password: this.password.value()
    }
  }
}
