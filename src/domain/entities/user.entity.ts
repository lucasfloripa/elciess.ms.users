import * as shortUuid from 'short-uuid'

import { UserType } from '../enums'
import { type ICreateUserDTO } from '../ports/inbounds'
import { type DbUser, type UserDTO } from '../ports/outbounds'
import { Email, Password } from '../value-objects'

export class User {
  static readonly SALT: number = 4
  static readonly JWT_SECRET: string = String(process.env.JWT_SECRET)

  constructor(
    readonly userId: string,
    readonly email: Email,
    readonly password: Password,
    readonly userType: UserType
  ) {}

  static async create(input: ICreateUserDTO): Promise<User> {
    const { email, password, type } = input
    const userId = this._generateId()
    const userEmail = Email.create(email)
    const hashedPassword = await Password.create(password)
    const userType = this._getUserType(type)
    return new User(userId, userEmail, hashedPassword, userType)
  }

  private static _generateId(): string {
    return shortUuid.generate()
  }

  private static _getUserType(userType: string): UserType {
    switch (userType) {
      case 'admin':
        return UserType.ADMIN
      default:
        return UserType.CLIENT
    }
  }

  toReturn(): UserDTO {
    return {
      userId: this.userId,
      email: this.email.value(),
      userType: this.userType
    }
  }

  toPersistence(): DbUser {
    return {
      userId: this.userId,
      email: this.email.value(),
      password: this.password.value(),
      userType: this.userType
    }
  }
}
