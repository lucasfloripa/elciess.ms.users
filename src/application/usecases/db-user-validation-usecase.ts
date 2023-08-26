/* eslint-disable @typescript-eslint/no-throw-literal */
import { UserValidation } from '../../domain/implementations'
import { Decrypter, GetUserRepository } from '../protocols'

export class DbUserValidationUsecase implements UserValidation {
  constructor (
    private readonly decrypter: Decrypter,
    private readonly getUserById: GetUserRepository
  ) { }

  async execute (token: string): Promise<string> {
    if (!token) throw { statusCode: 400, body: { message: 'Token not provided' } }
    const decrypt = await this.decrypter.decrypt(token) as any
    if (!decrypt) throw { statusCode: 401, body: { message: 'Invalid token' } }
    console.log(decrypt)
    const user = await this.getUserById.get(decrypt.id)
    if (!user) throw { statusCode: 404, body: { message: 'Invalid user' } }
    return user.id
  }
}
