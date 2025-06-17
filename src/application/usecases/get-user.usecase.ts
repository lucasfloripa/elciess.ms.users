import { type IGetUserUsecase } from '../../domain/contracts'
import { User } from '../../domain/entities'
import { UserType } from '../../domain/enums'
import { NotFoundError } from '../../domain/errors'
import { type IUser } from '../../domain/interfaces/user.interfaces'
import { type IGetUserDTO } from '../../domain/ports/inbounds'
import { type IGetUserResponseDTO } from '../../domain/ports/outbounds'
import { Email, Password } from '../../domain/value-objects'
import { type IUserRepository } from '../contracts'

export class GetUserUsecase implements IGetUserUsecase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(filters: IGetUserDTO): Promise<IGetUserResponseDTO | Error> {
    const dbUser: IUser | null = await this.userRepository.getUser(filters)

    if (!dbUser) return new NotFoundError('User not found')

    const { userId, email, password, userType } = dbUser

    const user: User = new User(
      userId,
      new Email(email),
      new Password(password),
      this._parseUserType(userType)
    )

    return { user: user.toReturn() }
  }

  private _parseUserType(type: string): UserType {
    return type === 'admin' ? UserType.ADMIN : UserType.CLIENT
  }
}
