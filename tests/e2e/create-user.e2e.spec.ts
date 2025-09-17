import request from 'supertest'

import { CreateUserUsecase } from '@/application/usecases'
import { MongoHelper } from '@/infra/mongo'
import { createApp } from '@/main/config/app'
import {
  disconnectInfrastructure,
  initializeInfrastructure
} from '@/main/config/infra'

let app: ReturnType<typeof createApp>
let mongoInstance: MongoHelper

describe('[E2E] Create User', () => {
  beforeAll(async () => {
    await initializeInfrastructure()
    mongoInstance = MongoHelper.getInstance()
    app = createApp()
  })

  afterAll(async () => {
    mongoInstance = MongoHelper.getInstance()
    const userCollection = await mongoInstance.getCollection('users')
    await userCollection.deleteMany({})
    await disconnectInfrastructure()
  })
  it('should return 201 and a new user', async () => {
    const res = await request(app).post('/api/users').send({
      email: 'test@example.com',
      password: 'password123',
      confirmPassword: 'password123'
    })

    expect(res.status).toBe(201)
    expect(res.body.user).toBeDefined()
  })

  it('should return 400 when some required input is missing', async () => {
    const res = await request(app).post('/api/users').send({
      email: 'invalid_email'
    })

    expect(res.status).toBe(400)
    expect(res.body).toEqual({ error: 'Missing param: password' })
  })

  it('should return 400 when email is not valid', async () => {
    const res = await request(app).post('/api/users').send({
      email: 'invalid_email',
      password: 'password123',
      confirmPassword: 'password123'
    })

    expect(res.status).toBe(400)
    expect(res.body).toEqual({ error: 'Invalid email format' })
  })

  it('should return 400 when password dont match confirmPassword', async () => {
    const res = await request(app).post('/api/users').send({
      email: 'valid@email.com',
      password: 'password123',
      confirmPassword: 'password321'
    })

    expect(res.status).toBe(400)
    expect(res.body).toEqual({ error: 'Password dont match confirmPassword' })
  })

  it('should return 500 when something not expected happens', async () => {
    jest
      .spyOn(CreateUserUsecase.prototype, 'execute')
      .mockRejectedValueOnce(new Error('Simulated Database Error'))

    const res = await request(app).post('/api/users').send({
      email: 'valid@email.com',
      password: 'password123',
      confirmPassword: 'password123'
    })

    expect(res.status).toBe(500)
  })
})
