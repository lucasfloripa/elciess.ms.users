import request from 'supertest'

import { DeleteUserUsecase } from '@/application/usecases'
import { MongoHelper } from '@/infra/mongo'
import { createApp } from '@/main/config/app'
import {
  disconnectInfrastructure,
  initializeInfrastructure
} from '@/main/config/infra'

let app: ReturnType<typeof createApp>
let mongoInstance: MongoHelper
let userId: string

describe('[E2E] Auth User', () => {
  beforeAll(async () => {
    await initializeInfrastructure()
    mongoInstance = MongoHelper.getInstance()
    const userCollection = await mongoInstance.getCollection('users')
    await userCollection.deleteMany({})
    app = createApp()

    const res = await request(app).post('/api/users').send({
      email: 'test@example.com',
      password: 'password123',
      confirmPassword: 'password123'
    })

    userId = res.body.user.userId
  })

  afterAll(async () => {
    await disconnectInfrastructure()
  })
  it('should return 204 when user is deleted', async () => {
    const res = await request(app).delete(`/api/user/${userId}`)

    expect(res.status).toBe(204)
  })

  it('should return 400 when some required input is missing', async () => {
    const res = await request(app).post('/api/user').send({})

    expect(res.status).toBe(400)
    expect(res.body).toEqual({ error: 'Missing param: id' })
  })

  it('should return 500 when something not expected happens', async () => {
    jest
      .spyOn(DeleteUserUsecase.prototype, 'execute')
      .mockRejectedValueOnce(new Error('Simulated Database Error'))

    const res = await request(app).post('/api/user').send({
      email: 'valid@email.com',
      password: 'password123'
    })

    expect(res.status).toBe(500)
  })
})
