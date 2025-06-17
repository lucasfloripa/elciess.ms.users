import { type ICreateUserUsecase } from '../../domain/contracts'
import { User } from '../../domain/entities'
import { EmailInUseError } from '../../domain/errors'
import { type IUser } from '../../domain/interfaces/user.interfaces'
import { type ICreateUserDTO } from '../../domain/ports/inbounds'
import { type ICreateUserResponseDTO } from '../../domain/ports/outbounds'
import { type IUserRepository } from '../contracts'

export class CreateUserUsecase implements ICreateUserUsecase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(
    createUserData: ICreateUserDTO
  ): Promise<ICreateUserResponseDTO | Error> {
    const userExists: IUser | null = await this.userRepository.getUser({
      email: createUserData.email
    })
    if (userExists) return new EmailInUseError()

    const user: User = await User.create(createUserData)
    await this.userRepository.save(user.toPersistence())

    return { user: user.toReturn() }
  }
}
