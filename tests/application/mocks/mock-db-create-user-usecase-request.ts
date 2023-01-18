import { CreateUserImplementationParams } from '../../../src/domain/implementation'

import { faker } from '@faker-js/faker'

export const mockDbCreateUserUseCaseRequest = (): CreateUserImplementationParams => ({
  email: faker.internet.email(),
  password: faker.internet.password()
})
