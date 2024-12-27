import { type ICreateUserUsecase } from '../../domain/contracts'
import { User } from '../../domain/entities'
import { EmailInUseError } from '../../domain/errors'
import { type ICreateUserDTO } from '../../domain/ports/inbounds'
import { type ICreateUserResponse } from '../../domain/ports/outbounds'
import { type IUserRepository } from '../contracts'

export class CreateUserUsecase implements ICreateUserUsecase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(
    createUserData: ICreateUserDTO
  ): Promise<ICreateUserResponse | Error> {
    const userExists = await this.userRepository.loadByEmail(
      createUserData.email
    )
    if (userExists) return new EmailInUseError()

    const user = await User.create(createUserData)
    await this.userRepository.save(user)

    return { user: this._sanitizeUser(user) }
  }

  private _sanitizeUser(user: User): Omit<User, 'password'> {
    const { password, ...safeUser } = user
    return safeUser
  }
}
