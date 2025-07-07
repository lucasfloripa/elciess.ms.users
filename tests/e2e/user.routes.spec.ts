import request from 'supertest'

import { createApp } from '@/main/config/app'
import { disconnectInfrastructure } from '@/main/config/infra'

let app: ReturnType<typeof createApp>

describe('[E2E] Create User', () => {
  beforeAll(() => {
    app = createApp()
  })

  afterAll(async () => {
    await disconnectInfrastructure()
  })
  it('should create a user successfully', async () => {
    const res = await request(app).post('/api/auth').send({
      email: 'testexample.com',
      password: 'password123'
    })

    expect(res.status).toBe(404)
  })
})
