import { type ICreateUserUsecase } from '../../../src/domain/contracts'
import { EmailInUseError } from '../../../src/domain/errors'
import { type ICreateUserRequestDTO } from '../../../src/domain/ports/inbounds'
import { type ICreateUserResponseDTO } from '../../../src/domain/ports/outbounds'
import { type IValidation } from '../../../src/presentation/contracts'
import { CreateUserController } from '../../../src/presentation/controllers'
import { htttpResponses } from '../../../src/presentation/interfaces'

describe('CreateUserController', () => {
  let createUserUsecase: jest.Mocked<ICreateUserUsecase>
  let validator: jest.Mocked<IValidation>
  let createUserController: CreateUserController

  beforeEach(() => {
    createUserUsecase = {
      execute: jest.fn()
    }
    validator = {
      validate: jest.fn()
    }
    createUserController = new CreateUserController(
      createUserUsecase,
      validator
    )
  })

  it('should return 201 if user is created successfully', async () => {
    const createUserData: ICreateUserRequestDTO = {
      email: 'valid_email@mail.com',
      password: 'valid_password',
      confirmPassword: 'valid_password'
    }
    const newUser: ICreateUserResponseDTO = {
      user: {
        email: createUserData.email,
        userId: 'valid_id',
        role: 'DEFAULT'
      }
    }
    validator.validate.mockReturnValue(undefined)
    createUserUsecase.execute.mockResolvedValue(newUser)

    const response = await createUserController.handle(createUserData)

    expect(response).toEqual(htttpResponses.http201(newUser))
    expect(validator.validate).toHaveBeenCalledWith(createUserData)
    expect(createUserUsecase.execute).toHaveBeenCalledWith(createUserData)
  })

  it('should return 400 if validation fails', async () => {
    const createUserData: ICreateUserRequestDTO = {
      email: 'invalid_email',
      password: 'valid_password',
      confirmPassword: 'valid_password'
    }
    const validationError = new Error('Validation error')
    validator.validate.mockReturnValue(validationError)

    const response = await createUserController.handle(createUserData)

    expect(response).toEqual(htttpResponses.http400(validationError))
    expect(validator.validate).toHaveBeenCalledWith(createUserData)
    expect(createUserUsecase.execute).not.toHaveBeenCalled()
  })

  it('should return 400 if email is already in use', async () => {
    const createUserData: ICreateUserRequestDTO = {
      email: 'already_taken@mail.com',
      password: 'valid_password',
      confirmPassword: 'valid_password'
    }
    const emailInUseError = new EmailInUseError()
    validator.validate.mockReturnValue(undefined)
    createUserUsecase.execute.mockResolvedValue(emailInUseError)

    const response = await createUserController.handle(createUserData)

    expect(response).toEqual(htttpResponses.http400(emailInUseError))
    expect(validator.validate).toHaveBeenCalledWith(createUserData)
    expect(createUserUsecase.execute).toHaveBeenCalledWith(createUserData)
  })

  it('should return 500 if an unexpected error accurs', async () => {
    const createUserData: ICreateUserRequestDTO = {
      email: 'valid_email@mail.com',
      password: 'valid_password',
      confirmPassword: 'valid_password'
    }
    const error = new Error('Some error')
    validator.validate.mockReturnValue(undefined)
    createUserUsecase.execute.mockRejectedValue(error)

    const response = await createUserController.handle(createUserData)

    expect(response).toEqual(htttpResponses.http500(error))
    expect(validator.validate).toHaveBeenCalledWith(createUserData)
    expect(createUserUsecase.execute).toHaveBeenCalledWith(createUserData)
  })
})
