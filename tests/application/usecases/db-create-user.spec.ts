import { DbCreateUserUseCase } from '../../../src/application/usecases'
import { CheckUserByEmailRepository } from '../../../src/application/protocols'
import { mockCreateUserRequest } from '../../domain/mocks'
import { mockCheckUserByEmailRepositoryStub } from '../mocks'

const mockRequest = mockCreateUserRequest()

interface SutTypes {
  sut: DbCreateUserUseCase
  checkUserByEmailRepositoryStub: CheckUserByEmailRepository
}

const makeSut = (): SutTypes => {
  const checkUserByEmailRepositoryStub = mockCheckUserByEmailRepositoryStub()
  const sut = new DbCreateUserUseCase(checkUserByEmailRepositoryStub)
  return { sut, checkUserByEmailRepositoryStub }
}

describe('DbCreateUserUseCase', () => {
  test('Should call checkUserByEmailRepository with correct params', async () => {
    const { sut, checkUserByEmailRepositoryStub } = makeSut()
    const spyCreateUserImplementation = jest.spyOn(checkUserByEmailRepositoryStub, 'checkByEmail')
    await sut.create(mockRequest)
    expect(spyCreateUserImplementation).toHaveBeenCalledWith(mockRequest.email)
  })
  test('Should return false if checkUserByEmailRepository returns an true', async () => {
    const { sut, checkUserByEmailRepositoryStub } = makeSut()
    jest.spyOn(checkUserByEmailRepositoryStub, 'checkByEmail').mockReturnValueOnce(Promise.resolve(true))
    const exists = await sut.create(mockRequest)
    expect(exists).toBe(false)
  })
})
