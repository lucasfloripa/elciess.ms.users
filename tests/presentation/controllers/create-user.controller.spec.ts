import { CreateUserController } from '../../../src/presentation/controllers'
import { CreateUserImplementation } from '../../../src/domain/implementation'
import { mockCreateUserRequest } from '../mocks'
import { mockCreateUserImplementationStub } from '../../domain/mocks'

const mockRequest = mockCreateUserRequest()

interface SutTypes {
  sut: CreateUserController
  createUserImplementationStub: CreateUserImplementation
}

const makeSut = (): SutTypes => {
  const createUserImplementationStub = mockCreateUserImplementationStub()
  const sut = new CreateUserController(createUserImplementationStub)
  return { sut, createUserImplementationStub }
}

describe('CreateUserController', () => {
  test('Should call createUserImplementation with correct params', async () => {
    const { sut, createUserImplementationStub } = makeSut()
    const spyCreateUserImplementation = jest.spyOn(createUserImplementationStub, 'create')
    await sut.handle(mockRequest)
    expect(spyCreateUserImplementation).toHaveBeenCalledWith(mockRequest)
  })
})
