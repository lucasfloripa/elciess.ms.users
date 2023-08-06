import { DbCreateUserUseCase } from '../../../src/application/usecases'
import { CheckUserByEmailRepository, CreateUserRepository, Hasher, IdGenerator } from '../../../src/application/protocols'
import { mockDbCreateUserUseCaseRequest, mockIdGeneratorStub, mockHasherStub, mockCheckUserByEmailRepositoryStub, mockCreateUserRepositoryStub } from '../../application/mocks'

const mockRequest = mockDbCreateUserUseCaseRequest()

interface SutTypes {
  sut: DbCreateUserUseCase
  checkUserByEmailRepositoryStub: CheckUserByEmailRepository
  idGeneratorStub: IdGenerator
  hasherStub: Hasher
  createUserRepositoryStub: CreateUserRepository
}

const makeSut = (): SutTypes => {
  const checkUserByEmailRepositoryStub = mockCheckUserByEmailRepositoryStub()
  const idGeneratorStub = mockIdGeneratorStub()
  const hasherStub = mockHasherStub()
  const createUserRepositoryStub = mockCreateUserRepositoryStub()
  const sut = new DbCreateUserUseCase(checkUserByEmailRepositoryStub, idGeneratorStub, hasherStub, createUserRepositoryStub)
  return { sut, checkUserByEmailRepositoryStub, idGeneratorStub, hasherStub, createUserRepositoryStub }
}

describe('DbCreateUserUseCase', () => {
  test('Should call checkUserByEmailRepository with correct params', async () => {
    const { sut, checkUserByEmailRepositoryStub } = makeSut()
    const spyCheckByEmail = jest.spyOn(checkUserByEmailRepositoryStub, 'checkByEmail')
    await sut.execute(mockRequest)
    expect(spyCheckByEmail).toHaveBeenCalledWith(mockRequest.email)
  })
  test('Should return false if checkUserByEmailRepository returns an true', async () => {
    const { sut, checkUserByEmailRepositoryStub } = makeSut()
    jest.spyOn(checkUserByEmailRepositoryStub, 'checkByEmail').mockReturnValueOnce(Promise.resolve(true))
    const isValid = await sut.execute(mockRequest)
    expect(isValid).toBe(false)
  })
  test('Should throw if checkUserByEmailRepository throws', async () => {
    const { sut, checkUserByEmailRepositoryStub } = makeSut()
    jest.spyOn(checkUserByEmailRepositoryStub, 'checkByEmail').mockImplementationOnce(async () => (await Promise.reject(new Error())))
    const isValid = sut.execute(mockRequest)
    await expect(isValid).rejects.toThrow()
  })
  test('Should call idGenerator correctly', async () => {
    const { sut, idGeneratorStub } = makeSut()
    const spyGenerate = jest.spyOn(idGeneratorStub, 'generate')
    await sut.execute(mockRequest)
    expect(spyGenerate).toHaveBeenCalled()
  })
  test('Should throw if idGenerator throws', async () => {
    const { sut, idGeneratorStub } = makeSut()
    jest.spyOn(idGeneratorStub, 'generate').mockImplementationOnce(async () => (await Promise.reject(new Error())))
    const isValid = sut.execute(mockRequest)
    await expect(isValid).rejects.toThrow()
  })
  test('Should call hasher with correct params', async () => {
    const { sut, hasherStub } = makeSut()
    const spyHash = jest.spyOn(hasherStub, 'hash')
    await sut.execute(mockRequest)
    expect(spyHash).toHaveBeenCalledWith(mockRequest.password)
  })
  test('Should throw if hasher throws', async () => {
    const { sut, hasherStub } = makeSut()
    jest.spyOn(hasherStub, 'hash').mockImplementationOnce(async () => (await Promise.reject(new Error())))
    const isValid = sut.execute(mockRequest)
    await expect(isValid).rejects.toThrow()
  })
  test('Should call createUserRepository with correct params', async () => {
    const { sut, idGeneratorStub, hasherStub, createUserRepositoryStub } = makeSut()
    const spyCreate = jest.spyOn(createUserRepositoryStub, 'create')
    const spyGenerate = jest.spyOn(idGeneratorStub, 'generate')
    const spyHash = jest.spyOn(hasherStub, 'hash')
    await sut.execute(mockRequest)
    expect(spyCreate).toHaveBeenCalledWith({
      id: await spyGenerate.mock.results[0].value,
      email: mockRequest.email,
      password: await spyHash.mock.results[0].value
    })
  })
  test('Should throw if createUserRepository throws', async () => {
    const { sut, createUserRepositoryStub } = makeSut()
    jest.spyOn(createUserRepositoryStub, 'create').mockImplementationOnce(async () => (await Promise.reject(new Error())))
    const isValid = sut.execute(mockRequest)
    await expect(isValid).rejects.toThrow()
  })
  test('Should return true on success', async () => {
    const { sut } = makeSut()
    const isValid = sut.execute(mockRequest)
    expect(isValid).toBeTruthy()
  })
})
