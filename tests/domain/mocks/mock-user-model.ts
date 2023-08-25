import { User } from '../../domain/models'

import { faker } from '@faker-js/faker'

export const mockUserModel = (): User => ({
  id: faker.random.numeric(),
  email: faker.internet.email(),
  password: faker.random.word()
})
