import { CreateUserRequestDTO } from '../../presentation/dtos'

import { faker } from '@faker-js/faker'

const fakePassword = faker.internet.password()

export const mockCreateUserRequestDTO = (): CreateUserRequestDTO => ({
  email: faker.internet.email(),
  password: fakePassword,
  confirmPassword: fakePassword
})
