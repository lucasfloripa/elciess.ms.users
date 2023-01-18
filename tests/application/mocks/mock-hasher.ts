import { Hasher } from '../../../src/application/protocols'

import { faker } from '@faker-js/faker'

export const mockHasherStub = (): Hasher => {
  class HasherStub implements Hasher {
    async hash (plaintext: string): Promise<string> {
      return await Promise.resolve(faker.random.word())
    }
  }
  return new HasherStub()
}
