import { DbCreateUserUseCase } from '../../../src/application/usecases'
import { CheckUserByEmailRepository, Hasher, IdGenerator } from '../../../src/application/protocols'
import { mockDbCreateUserUseCaseRequest, mockIdGeneratorStub, mockHasherStub, mockCheckUserByEmailRepositoryStub } from '../../application/mocks'

const mockRequest = mockDbCreateUserUseCaseRequest()

interface SutTypes {
  sut: DbCreateUserUseCase
  checkUserByEmailRepositoryStub: CheckUserByEmailRepository
  idGeneratorStub: IdGenerator
  hasherStub: Hasher
}

const makeSut = (): SutTypes => {
  const checkUserByEmailRepositoryStub = mockCheckUserByEmailRepositoryStub()
  const idGeneratorStub = mockIdGeneratorStub()
  const hasherStub = mockHasherStub()
  const sut = new DbCreateUserUseCase(checkUserByEmailRepositoryStub, idGeneratorStub, hasherStub)
  return { sut, checkUserByEmailRepositoryStub, idGeneratorStub, hasherStub }
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
  test('Should throw if idGenerator throws', async () => {
    const { sut, idGeneratorStub } = makeSut()
    jest.spyOn(idGeneratorStub, 'generate').mockImplementationOnce(async () => (await Promise.reject(new Error())))
    const exists = sut.create(mockRequest)
    await expect(exists).rejects.toThrow()
  })
  test('Should call hasher with correct params', async () => {
    const { sut, hasherStub } = makeSut()
    const spyHash = jest.spyOn(hasherStub, 'hash')
    await sut.create(mockRequest)
    expect(spyHash).toHaveBeenCalledWith(mockRequest.password)
  })
})
