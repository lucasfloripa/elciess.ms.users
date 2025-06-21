import { type IDeleteUserUsecase } from '../../domain/contracts'
import { NotFoundError } from '../../domain/errors'
import { type IUserRepository } from '../contracts'

export class DeleteUserUsecase implements IDeleteUserUsecase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(userId: string): Promise<boolean | Error> {
    const hasUserDeleted: boolean = await this.userRepository.deleteUser(userId)

    if (!hasUserDeleted) return new NotFoundError('User not found')

    return hasUserDeleted
  }
}
