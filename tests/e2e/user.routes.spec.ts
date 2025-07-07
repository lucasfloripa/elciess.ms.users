import request from 'supertest'

import { createApp } from '@/main/config/app'

describe('[E2E] Create User', () => {
  it('should create a user successfully', async () => {
    const res = await request(createApp()).post('/api/auth').send({
      email: 'testexample.com',
      password: 'password123'
    })

    expect(res.status).toBe(201)
  })
})
