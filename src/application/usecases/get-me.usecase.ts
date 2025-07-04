import {
  type ICacheService,
  type IUserRepository
} from '@/application/contracts'
import { type IGetMeUsecase } from '@/domain/contracts'
import { NotFoundError } from '@/domain/errors'
import {
  type ISanitezedUser,
  type IUser
} from '@/domain/interfaces/user.interfaces'
import { type IGetMeResponseDTO } from '@/domain/ports/outbounds'

export class GetMeUsecase implements IGetMeUsecase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly cacheService: ICacheService
  ) {}

  async execute(userId: string): Promise<IGetMeResponseDTO | Error> {
    const cachedUser = await this.cacheService.get<IGetMeResponseDTO>(userId)
    if (cachedUser) return cachedUser

    const dbUser: IUser | null = await this.userRepository.getUser({ userId })

    if (!dbUser) return new NotFoundError('User not found')

    const { password, ...sanitezedUser } = dbUser
    const user: ISanitezedUser = sanitezedUser

    await this.cacheService.set(userId, { user: sanitezedUser })

    return { user }
  }
}
