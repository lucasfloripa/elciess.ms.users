import { type IAuthUserUsecase } from '../../domain/contracts'
import { User } from '../../domain/entities'
import { ForbiddenError, UnauthorizedError } from '../../domain/errors'
import { type IUserCredentialsDTO } from '../../domain/ports/inbounds'
import { type IAuthUserResponse } from '../../domain/ports/outbounds'
import { Password } from '../../domain/value-objects'
import { type IUserRepository } from '../contracts'

export class AuthUserUsecase implements IAuthUserUsecase {
  constructor(private readonly userDynamodb: IUserRepository) {}

  async execute(
    credentials: IUserCredentialsDTO
  ): Promise<IAuthUserResponse | Error> {
    const { email, password } = credentials

    const userExists = await this.userDynamodb.loadByEmail(email)
    if (!userExists) return new UnauthorizedError()

    const passwordMatch = await Password.comparePassword(
      password,
      userExists.password
    )
    if (!passwordMatch) return new ForbiddenError()

    const token = await User.generateToken(userExists.userId)
    return { token }
  }
}
