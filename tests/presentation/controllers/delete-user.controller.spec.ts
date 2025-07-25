import { type ILogger, type IDeleteUserUsecase } from '@/domain/contracts'
import { NotFoundError } from '@/domain/errors'
import { type IDeleteUserRequestDTO } from '@/domain/ports/inbounds'
import { type IValidation } from '@/presentation/contracts'
import { DeleteUserController } from '@/presentation/controllers'
import { httpResponses } from '@/presentation/interfaces'

describe('DeleteUserController', () => {
  let deleteUserUsecase: jest.Mocked<IDeleteUserUsecase>
  let validator: jest.Mocked<IValidation>
  let deleteUserController: DeleteUserController
  let logger: ILogger

  beforeEach(() => {
    logger = {
      debug: jest.fn(),
      error: jest.fn(),
      info: jest.fn(),
      warn: jest.fn()
    } as unknown as jest.Mocked<ILogger>
    deleteUserUsecase = {
      execute: jest.fn()
    }
    validator = {
      validate: jest.fn()
    }
    deleteUserController = new DeleteUserController(
      deleteUserUsecase,
      validator,
      logger
    )
  })

  it('should return 204 if user is deleted successfully', async () => {
    const deleteUserData: IDeleteUserRequestDTO = {
      id: 'valid_id'
    }
    validator.validate.mockReturnValue(undefined)
    deleteUserUsecase.execute.mockResolvedValue(true)

    const response = await deleteUserController.handle(deleteUserData)

    expect(response).toEqual(httpResponses.http204())
    expect(validator.validate).toHaveBeenCalledWith(deleteUserData)
    expect(deleteUserUsecase.execute).toHaveBeenCalledWith(deleteUserData.id)
  })

  it('should return 400 if validation fails', async () => {
    const deleteUserData: IDeleteUserRequestDTO = {
      id: ''
    }
    const validationError = new Error('ID is required')
    validator.validate.mockReturnValue(validationError)

    const response = await deleteUserController.handle(deleteUserData)

    expect(response).toEqual(httpResponses.http400(validationError))
    expect(validator.validate).toHaveBeenCalledWith(deleteUserData)
    expect(deleteUserUsecase.execute).not.toHaveBeenCalled()
  })

  it('should return 404 if user is not found', async () => {
    const deleteUserData: IDeleteUserRequestDTO = {
      id: 'non_existent_id'
    }
    const notFoundError = new NotFoundError('User not found')
    validator.validate.mockReturnValue(undefined)
    deleteUserUsecase.execute.mockResolvedValue(notFoundError)

    const response = await deleteUserController.handle(deleteUserData)

    expect(response).toEqual(httpResponses.http404(notFoundError))
    expect(validator.validate).toHaveBeenCalledWith(deleteUserData)
    expect(deleteUserUsecase.execute).toHaveBeenCalledWith(deleteUserData.id)
  })

  it('should return 500 if an unexpected error occurs', async () => {
    const deleteUserData: IDeleteUserRequestDTO = {
      id: 'any_id'
    }
    const unexpectedError = new Error('Internal server error')
    validator.validate.mockReturnValue(undefined)
    deleteUserUsecase.execute.mockRejectedValue(unexpectedError)

    const response = await deleteUserController.handle(deleteUserData)

    expect(response).toEqual(httpResponses.http500(unexpectedError))
    expect(validator.validate).toHaveBeenCalledWith(deleteUserData)
    expect(deleteUserUsecase.execute).toHaveBeenCalledWith(deleteUserData.id)
  })
})
