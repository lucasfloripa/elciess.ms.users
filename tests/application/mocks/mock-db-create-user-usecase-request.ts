import { CreateUserParams } from '../../domain/implementations'

import { faker } from '@faker-js/faker'

export const mockDbCreateUserUseCaseRequest = (): CreateUserParams => ({
  email: faker.internet.email(),
  password: faker.internet.password()
})
