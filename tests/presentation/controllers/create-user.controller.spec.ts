import { CreateUserController } from '../../../src/presentation/controllers'
import { Validation } from '../../../src/presentation/protocols'
import { CreateUserImplementation } from '../../../src/domain/implementation'
import { mockCreateUserRequest, mockValidationStub } from '../mocks'
import { mockCreateUserImplementationStub } from '../../domain/mocks'

const mockRequest = mockCreateUserRequest()

interface SutTypes {
  sut: CreateUserController
  createUserImplementationStub: CreateUserImplementation
  validationStub: Validation
}

const makeSut = (): SutTypes => {
  const createUserImplementationStub = mockCreateUserImplementationStub()
  const validationStub = mockValidationStub()
  const sut = new CreateUserController(createUserImplementationStub, validationStub)
  return { sut, createUserImplementationStub, validationStub }
}

describe('CreateUserController', () => {
  test('Should call createUserImplementation with correct params', async () => {
    const { sut, createUserImplementationStub } = makeSut()
    const spyCreateUserImplementation = jest.spyOn(createUserImplementationStub, 'create')
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
    expect(httpResponse.statusCode).toBe(400)
  })
})
