import * as bcrypt from 'bcryptjs'
import * as jwt from 'jsonwebtoken'
import * as shortUuid from 'short-uuid'

import { type ICreateUserDTO } from '../ports/inbounds'

export class User {
  static readonly SALT: number = 4
  static readonly JWT_SECRET: string = String(process.env.JWT_SECRET)

  constructor(
    readonly userId: string,
    readonly email: string,
    readonly password: string
  ) {}

  static async create(input: ICreateUserDTO): Promise<User> {
    const { email, password } = input
    const userId = this._generateId()
    const hashedPassword = await this._hashPassword(password)
    return new User(userId, email, hashedPassword)
  }

  static async comparePassword(
    password: string,
    hashedPassword: string
  ): Promise<boolean> {
    return await bcrypt.compare(password, hashedPassword)
  }

  static async generateToken(userId: string): Promise<string> {
    return jwt.sign({ userId }, this.JWT_SECRET)
  }

  private static async _hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, this.SALT)
  }

  private static _generateId(): string {
    return shortUuid.generate()
  }
}
