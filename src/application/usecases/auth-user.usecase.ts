import { type IAuthUserUsecase } from '../../domain/contracts'
import { ForbiddenError, UnauthorizedError } from '../../domain/errors'
import { type IUserCredentialsDTO } from '../../domain/ports/inbounds'
import { type IAuthUserResponse } from '../../domain/ports/outbounds'
import { Password } from '../../domain/value-objects'
import { type TokenService, type IUserRepository } from '../contracts'

export class AuthUserUsecase implements IAuthUserUsecase {
  constructor(
    private readonly userDynamodb: IUserRepository,
    private readonly tokenService: TokenService
  ) {}

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

    const accessToken = await this.tokenService.generateAccessToken(
      userExists.userId
    )
    const refreshToken = await this.tokenService.generateRefreshToken(
      userExists.userId
    )

    await this.userDynamodb.saveRefreshToken(userExists.userId, refreshToken)
    return { accessToken, refreshToken }
  }
}
