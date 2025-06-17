import { type IGetUserUsecase } from '../../domain/contracts'
import { NotFoundError } from '../../domain/errors'
import { type IUser } from '../../domain/interfaces/user.interfaces'
import { type IGetUserDTO } from '../../domain/ports/inbounds'
import { type IGetUserResponseDTO } from '../../domain/ports/outbounds'
import { type IUserRepository } from '../contracts'

export class GetUserUsecase implements IGetUserUsecase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(filters: IGetUserDTO): Promise<IGetUserResponseDTO | Error> {
    const user: IUser | null = await this.userRepository.getUser(filters)

    if (!user) return new NotFoundError('User not found')

    return { user }
  }
}
