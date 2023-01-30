import { DbGetUserUseCase } from '../../../src/application/usecases'
import { GetUserRepository } from '../../../src/application/protocols'
import { mockGetUserRepositoryStub } from '../../application/mocks'

const mockRequest = '1'

interface SutTypes {
  sut: DbGetUserUseCase
  getUserRepositoryStub: GetUserRepository
}

const makeSut = (): SutTypes => {
  const getUserRepositoryStub = mockGetUserRepositoryStub()
  const sut = new DbGetUserUseCase(getUserRepositoryStub)
  return { sut, getUserRepositoryStub }
}

describe('DbGetUserUseCase', () => {
  test('Should call getUserRepositoryStub with correct params', async () => {
    const { sut, getUserRepositoryStub } = makeSut()
    const spyGet = jest.spyOn(getUserRepositoryStub, 'get')
    await sut.getUser(mockRequest)
    expect(spyGet).toHaveBeenCalledWith(mockRequest)
  })
  test('Should return null if getUserRepositoryStub returns not found user', async () => {
    const { sut, getUserRepositoryStub } = makeSut()
    jest.spyOn(getUserRepositoryStub, 'get').mockReturnValueOnce(Promise.resolve(null))
    const user = await sut.getUser(mockRequest)
    expect(user).toBe(null)
  })
  test('Should throw if getUserRepositoryStub throws', async () => {
    const { sut, getUserRepositoryStub } = makeSut()
    jest.spyOn(getUserRepositoryStub, 'get').mockImplementationOnce(async () => (await Promise.reject(new Error())))
    const user = sut.getUser(mockRequest)
    await expect(user).rejects.toThrow()
  })
  test('Should call getUserRepository with correct params', async () => {
    const { sut, getUserRepositoryStub } = makeSut()
    const spyCreate = jest.spyOn(getUserRepositoryStub, 'get')
    await sut.getUser(mockRequest)
    expect(spyCreate).toHaveBeenCalledWith(mockRequest)
  })
  test('Should throw if getUserRepository throws', async () => {
    const { sut, getUserRepositoryStub } = makeSut()
    jest.spyOn(getUserRepositoryStub, 'get').mockImplementationOnce(async () => (await Promise.reject(new Error())))
    const user = sut.getUser(mockRequest)
    await expect(user).rejects.toThrow()
  })
  test('Should return an user on success', async () => {
    const { sut } = makeSut()
    const user = sut.getUser(mockRequest)
    expect(user).toBeTruthy()
  })
})
