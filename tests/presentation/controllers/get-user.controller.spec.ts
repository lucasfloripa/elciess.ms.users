import { GetUserController } from '../../../src/presentation/controllers'
import { Validation } from '../../../src/presentation/protocols'
import { badRequest, serverError, ok, notFound } from '../../../src/presentation/helpers'
import { ServerError } from '../../../src/presentation/errors'
import { GetUser } from '../../domain/implementations'
import { mockGetUserStub } from '../../domain/mocks'
import { mockValidationStub } from '../mocks'

const mockRequest = { id: '1' }

interface SutTypes {
  sut: GetUserController
  getUserImplementation: GetUser
  validationStub: Validation
}

const makeSut = (): SutTypes => {
  const getUserImplementation = mockGetUserStub()
  const validationStub = mockValidationStub()
  const sut = new GetUserController(getUserImplementation, validationStub)
  return { sut, getUserImplementation, validationStub }
}

describe('GetUserController', () => {
  test('Should call getUserImplementation with correct params', async () => {
    const { sut, getUserImplementation } = makeSut()
    const spyGetUserImplementation = jest.spyOn(getUserImplementation, 'execute')
    await sut.handle(mockRequest)
    expect(spyGetUserImplementation).toHaveBeenCalledWith('1')
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
  test('Should return 404 if getUserImplementation returns null', async () => {
    const { sut, getUserImplementation } = makeSut()
    jest.spyOn(getUserImplementation, 'execute').mockReturnValueOnce(Promise.resolve(null))
    const httpResponse = await sut.handle(mockRequest)
    expect(httpResponse).toEqual(notFound('User not found'))
  })
  test('Should return 500 if getUserImplementation throws', async () => {
    const { sut, getUserImplementation } = makeSut()
    jest.spyOn(getUserImplementation, 'execute').mockImplementationOnce(async () => (await Promise.reject(new Error())))
    const httpResponse = await sut.handle(mockRequest)
    expect(httpResponse).toEqual(serverError(new ServerError()))
  })
  test('Should return 200 on success', async () => {
    const { sut, getUserImplementation } = makeSut()
    const spyGetUser = jest.spyOn(getUserImplementation, 'execute')
    const httpResponse = await sut.handle(mockRequest)
    expect(httpResponse).toEqual(ok(await spyGetUser.mock.results[0].value))
  })
})
