import request from 'supertest'

import { AuthUserUsecase } from '@/application/usecases'
import { MongoHelper } from '@/infra/mongo'
import { createApp } from '@/main/config/app'
import {
  disconnectInfrastructure,
  initializeInfrastructure
} from '@/main/config/infra'

let app: ReturnType<typeof createApp>
let mongoInstance: MongoHelper

describe('[E2E] Auth User', () => {
  beforeAll(async () => {
    await initializeInfrastructure()
    mongoInstance = MongoHelper.getInstance()
    const userCollection = await mongoInstance.getCollection('users')
    await userCollection.deleteMany({})
    app = createApp()

    await request(app).post('/api/users').send({
      email: 'test@example.com',
      password: 'password123',
      confirmPassword: 'password123'
    })
  })

  afterAll(async () => {
    await disconnectInfrastructure()
  })
  it('should return 200 with accessToken and refreshToken', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: 'test@example.com',
      password: 'password123'
    })

    expect(res.status).toBe(200)
    expect(res.body.accessToken).toBeDefined()
    expect(res.body.refreshToken).toBeDefined()
  })

  it('should return 400 when some required input is missing', async () => {
    const res = await request(app).post('/api/auth/login').send({
      password: '123'
    })

    expect(res.status).toBe(400)
    expect(res.body).toEqual({ error: 'Missing param: email' })
  })

  it('should return 400 when email is not valid', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: 'invalid_email',
      password: 'password123'
    })

    expect(res.status).toBe(400)
    expect(res.body).toEqual({ error: 'Invalid email format' })
  })

  it('should return 401 when user is not found', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: 'notfounduser@email.com',
      password: 'password123'
    })

    expect(res.status).toBe(401)
    expect(res.body).toEqual({ error: 'User not found' })
  })

  it('should return 403 when user is not found', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: 'test@example.com',
      password: 'failemail'
    })

    expect(res.status).toBe(403)
    expect(res.body).toEqual({ error: 'Invalid password' })
  })

  it('should return 500 when something not expected happens', async () => {
    jest
      .spyOn(AuthUserUsecase.prototype, 'execute')
      .mockRejectedValueOnce(new Error('Simulated Database Error'))

    const res = await request(app).post('/api/auth/login').send({
      email: 'valid@email.com',
      password: 'password123'
    })

    expect(res.status).toBe(500)
  })
})
