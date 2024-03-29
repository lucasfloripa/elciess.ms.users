import { CreateUserController } from '../../../src/presentation/controllers'
import { Validation } from '../../../src/presentation/protocols'
import { forbidden, badRequest, serverError, ok } from '../../../src/presentation/helpers'
import { EmailInUseError, ServerError } from '../../../src/presentation/errors'
import { CreateUser } from '../../domain/implementations'
import { mockCreateUserStub } from '../../domain/mocks'
import { mockCreateUserRequestDTO } from '../../presentation/mocks'
import { mockValidationStub } from '../mocks'

const mockRequest = mockCreateUserRequestDTO()

interface SutTypes {
  sut: CreateUserController
  createUserImplementationStub: CreateUser
  validationStub: Validation
}

const makeSut = (): SutTypes => {
  const createUserImplementationStub = mockCreateUserStub()
  const validationStub = mockValidationStub()
  const sut = new CreateUserController(createUserImplementationStub, validationStub)
  return { sut, createUserImplementationStub, validationStub }
}

describe('CreateUserController', () => {
  test('Should call createUserImplementation with correct params', async () => {
    const { sut, createUserImplementationStub } = makeSut()
    const spyCreateUserImplementation = jest.spyOn(createUserImplementationStub, 'execute')
    await sut.handle(mockRequest)
    expect(spyCreateUserImplementation).toHaveBeenCalledWith(mockRequest)
  })
  test('Should call validation with correct params', async () => {
    const { sut, validationStub } = makeSut()
    const spyValidation = jest.spyOn(validationStub, 'validate')
    await sut.handle(mockRequest)
    expect(spyValidation).toHaveBeenCalledWith(mockRequest)
  })
  test('Should return 400 if validation returns an error', async () => {
    const { sut, validationStub } = makeSut()
    jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new Error())
    const httpResponse = await sut.handle(mockRequest)
    expect(httpResponse).toEqual(badRequest(new Error()))
  })
  test('Should return 403 if createUserImplementation returns null', async () => {
    const { sut, createUserImplementationStub } = makeSut()
    jest.spyOn(createUserImplementationStub, 'execute').mockReturnValueOnce(Promise.resolve(false))
    const httpResponse = await sut.handle(mockRequest)
    expect(httpResponse).toEqual(forbidden(new EmailInUseError()))
  })
  test('Should return 500 if createUserImplementation throws', async () => {
    const { sut, createUserImplementationStub } = makeSut()
    jest.spyOn(createUserImplementationStub, 'execute').mockImplementationOnce(async () => (await Promise.reject(new Error())))
    const httpResponse = await sut.handle(mockRequest)
    expect(httpResponse).toEqual(serverError(new ServerError()))
  })
  test('Should return 200 on success', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(mockRequest)
    expect(httpResponse).toEqual(ok(`${mockRequest.email} registered successfully`))
  })
})
