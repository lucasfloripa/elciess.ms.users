import { CreateUserController } from 'presentation/controllers'

import { faker } from '@faker-js/faker'

const fakePassword = faker.internet.password()

export const mockDbCreateUserUseCaseRequest = (): CreateUserController.Params => ({
  email: faker.internet.email(),
  password: fakePassword,
  confirmPassword: fakePassword
})
