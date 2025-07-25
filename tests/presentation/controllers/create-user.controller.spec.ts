import { type ILogger, type ICreateUserUsecase } from '@/domain/contracts'
import { EmailInUseError } from '@/domain/errors'
import { type ICreateUserRequestDTO } from '@/domain/ports/inbounds'
import { type ICreateUserResponseDTO } from '@/domain/ports/outbounds'
import { type IValidation } from '@/presentation/contracts'
import { CreateUserController } from '@/presentation/controllers'
import { httpResponses } from '@/presentation/interfaces'

describe('CreateUserController', () => {
  let createUserUsecase: jest.Mocked<ICreateUserUsecase>
  let validator: jest.Mocked<IValidation>
  let createUserController: CreateUserController
  let logger: ILogger

  beforeEach(() => {
    logger = {
      debug: jest.fn(),
      error: jest.fn(),
      info: jest.fn(),
      warn: jest.fn()
    } as unknown as jest.Mocked<ILogger>
    createUserUsecase = {
      execute: jest.fn()
    }
    validator = {
      validate: jest.fn()
    }
    createUserController = new CreateUserController(
      createUserUsecase,
      validator,
      logger
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

    expect(response).toEqual(httpResponses.http201(newUser))
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

    expect(response).toEqual(httpResponses.http400(validationError))
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

    expect(response).toEqual(httpResponses.http400(emailInUseError))
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

    expect(response).toEqual(httpResponses.http500(error))
    expect(validator.validate).toHaveBeenCalledWith(createUserData)
    expect(createUserUsecase.execute).toHaveBeenCalledWith(createUserData)
  })
})
