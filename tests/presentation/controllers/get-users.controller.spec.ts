import { type IGetUsersUsecase } from '@/domain/contracts'
import { NotFoundError } from '@/domain/errors'
import { type IGetUsersResponseDTO } from '@/domain/ports/outbounds'
import { GetUsersController } from '@/presentation/controllers'
import { httpResponses } from '@/presentation/interfaces'

describe('GetUsersController', () => {
  let getUsersUsecase: jest.Mocked<IGetUsersUsecase>
  let getUsersController: GetUsersController

  beforeEach(() => {
    getUsersUsecase = {
      execute: jest.fn()
    }
    getUsersController = new GetUsersController(getUsersUsecase)
  })

  it('should return 200 with a list of users if successful', async () => {
    const usersResponse: IGetUsersResponseDTO = {
      users: [
        {
          userId: 'user_id_1',
          email: 'user1@example.com',
          role: 'DEFAULT'
        },
        {
          userId: 'user_id_2',
          email: 'user2@example.com',
          role: 'ADMIN'
        }
      ]
    }
    getUsersUsecase.execute.mockResolvedValue(usersResponse)

    const response = await getUsersController.handle()

    expect(response).toEqual(httpResponses.http200(usersResponse))
    expect(getUsersUsecase.execute).toHaveBeenCalledTimes(1)
  })

  it('should return 404 if no users are found (NotFoundError from usecase)', async () => {
    const notFoundError = new NotFoundError('No users found')
    getUsersUsecase.execute.mockResolvedValue(notFoundError)

    const response = await getUsersController.handle()

    expect(response).toEqual(httpResponses.http404(notFoundError))
    expect(getUsersUsecase.execute).toHaveBeenCalledTimes(1)
  })

  it('should return 500 if an unexpected error occurs', async () => {
    const unexpectedError = new Error('Database connection failed')
    getUsersUsecase.execute.mockRejectedValue(unexpectedError)

    const response = await getUsersController.handle()

    expect(response).toEqual(httpResponses.http500(unexpectedError))
    expect(getUsersUsecase.execute).toHaveBeenCalledTimes(1)
  })
})
