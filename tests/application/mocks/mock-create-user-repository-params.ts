import { CreateUserRepository } from '../../../src/application/protocols'

import { faker } from '@faker-js/faker'

export const mockCreateUserRepositoryParam = (): CreateUserRepository.Params => ({
  id: faker.random.alphaNumeric(),
  email: faker.internet.email(),
  password: faker.random.word()
})
