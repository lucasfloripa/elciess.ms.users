import * as bcrypt from 'bcryptjs'

export class Password {
  static readonly SALT: number = 4

  constructor(readonly password: string) {}

  static async create(password: string): Promise<Password> {
    const hashedPassword = await this._hashPassword(password)
    return new Password(hashedPassword)
  }

  static async comparePassword(
    password: string,
    hashedPassword: Password
  ): Promise<boolean> {
    return await bcrypt.compare(password, hashedPassword as unknown as string)
  }

  private static async _hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, this.SALT)
  }
}
