import { Authentication, AuthenticationParams } from '../../domain/implementations'
import { Encrypter, GetUserByEmail, HashComparer } from '../protocols'

export class DbAuthUserUsecase implements Authentication {
  constructor (
    private readonly getUserByEmailRepository: GetUserByEmail,
    private readonly hashComparer: HashComparer,
    private readonly encrypter: Encrypter
  ) {}

  async execute (credentials: AuthenticationParams): Promise<string> {
    const { email, password } = credentials
    const user = await this.getUserByEmailRepository.getByEmail(email)
    // eslint-disable-next-line @typescript-eslint/no-throw-literal
    if (!user) throw { statusCode: 401, body: new Error('Invalid email') }
    const passwordIsValid = await this.hashComparer.compare(password, user.password)
    // eslint-disable-next-line @typescript-eslint/no-throw-literal
    if (!passwordIsValid) throw { statusCode: 401, body: new Error('Invalid password') }
    const token = await this.encrypter.encrypt(user.id)
    return token
  }
}
