import { DbCreateUserUseCase } from '../../../src/application/usecases'
import { CheckUserByEmailRepository, IdGenerator } from '../../../src/application/protocols'
import { mockDbCreateUserUseCaseRequest, mockIdGeneratorStub } from '../../application/mocks'
import { mockCheckUserByEmailRepositoryStub } from '../mocks'

const mockRequest = mockDbCreateUserUseCaseRequest()

interface SutTypes {
  sut: DbCreateUserUseCase
  checkUserByEmailRepositoryStub: CheckUserByEmailRepository
  idGeneratorStub: IdGenerator
}

const makeSut = (): SutTypes => {
  const checkUserByEmailRepositoryStub = mockCheckUserByEmailRepositoryStub()
  const idGeneratorStub = mockIdGeneratorStub()
  const sut = new DbCreateUserUseCase(checkUserByEmailRepositoryStub, idGeneratorStub)
  return { sut, checkUserByEmailRepositoryStub, idGeneratorStub }
}

describe('DbCreateUserUseCase', () => {
  test('Should call checkUserByEmailRepository with correct params', async () => {
    const { sut, checkUserByEmailRepositoryStub } = makeSut()
    const spyCheckByEmail = jest.spyOn(checkUserByEmailRepositoryStub, 'checkByEmail')
    await sut.create(mockRequest)
    expect(spyCheckByEmail).toHaveBeenCalledWith(mockRequest.email)
  })
  test('Should return false if checkUserByEmailRepository returns an true', async () => {
    const { sut, checkUserByEmailRepositoryStub } = makeSut()
    jest.spyOn(checkUserByEmailRepositoryStub, 'checkByEmail').mockReturnValueOnce(Promise.resolve(true))
    const exists = await sut.create(mockRequest)
    expect(exists).toBe(false)
  })
  test('Should throw if checkUserByEmailRepository throws', async () => {
    const { sut, checkUserByEmailRepositoryStub } = makeSut()
    jest.spyOn(checkUserByEmailRepositoryStub, 'checkByEmail').mockImplementationOnce(async () => (await Promise.reject(new Error())))
    const exists = sut.create(mockRequest)
    await expect(exists).rejects.toThrow()
  })
  test('Should call idGenerator correctly', async () => {
    const { sut, idGeneratorStub } = makeSut()
    const spyGenerate = jest.spyOn(idGeneratorStub, 'generate')
    await sut.create(mockRequest)
    expect(spyGenerate).toHaveBeenCalled()
  })
})
