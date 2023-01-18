import { IdGenerator } from '../../../src/application/protocols'

import { faker } from '@faker-js/faker'

export const mockIdGeneratorStub = (): IdGenerator => {
  class IdGeneratorStub implements IdGenerator {
    async generate (): Promise<string> {
      return faker.random.numeric()
    }
  }
  return new IdGeneratorStub()
}
