import { CreateUserImplementationParams } from 'domain/implementation'

import { faker } from '@faker-js/faker'

const fakePassword = faker.internet.password()

export const mockCreateUserRequest = (): CreateUserImplementationParams => ({
  email: faker.internet.email(),
  password: fakePassword,
  confirmPassword: fakePassword
})
