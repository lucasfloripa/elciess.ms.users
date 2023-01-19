import { BcryptAdapter } from '../../../src/infra/cryptography'

import bcrypt from 'bcrypt'
import { faker } from '@faker-js/faker'

jest.mock('bcrypt', () => ({
  async hash (): Promise<string> {
    return await Promise.resolve('hash')
  }
}))

const fakeValue = faker.random.word()
const salt = 12
const makeSut = (): BcryptAdapter => {
  return new BcryptAdapter(salt)
}

describe('Bcrypt Adapter', () => {
  describe('hash()', () => {
    test('Should call hash with correct values', async () => {
      const sut = makeSut()
      const hashSpy = jest.spyOn(bcrypt, 'hash')
      await sut.hash(fakeValue)
      expect(hashSpy).toHaveBeenCalledWith(fakeValue, salt)
    })
    test('Should throw if hash throws', async () => {
      const sut = makeSut()
      jest.spyOn(bcrypt, 'hash').mockImplementationOnce(async () => {
        throw new Error()
      })
      const promise = sut.hash(fakeValue)
      await expect(promise).rejects.toThrow()
    })
    test('Should return a valid hash on hash success', async () => {
      const sut = makeSut()
      const hash = await sut.hash(fakeValue)
      expect(hash).toBe('hash')
    })
  })
})
