import { PostgresHelper, UserPostgresRepository } from '../../../src/infra/db/postgres'

import { Client } from 'pg'
import { mockCreateUserRepositoryParam } from '../../application/mocks'

jest.mock('pg', () => {
  const mockPgClient = {
    connect: jest.fn(),
    query: jest.fn(),
    end: jest.fn()
  }
  return { Client: jest.fn(() => mockPgClient) }
})

const mockCreateUserRepositoryParams = mockCreateUserRepositoryParam()

describe('UserPostgresRepository', () => {
  let client
  const userPostgresRepository = new UserPostgresRepository()

  beforeAll(async () => {
    client = new Client()
    await PostgresHelper.connect()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  afterAll(async () => {
    await PostgresHelper.disconnect()
  })

  describe('checkByEmail()', () => {
    test('Should return true if successful', async () => {
      client.query.mockResolvedValueOnce({
        rows: [
          mockCreateUserRepositoryParams
        ],
        rowCount: 1
      })

      const exists = await userPostgresRepository.checkByEmail('any_email')

      expect(exists).toBeTruthy()
    })
    test('Should return false if fail', async () => {
      client.query.mockResolvedValueOnce({
        rows: [],
        rowCount: 0
      })

      const exists = await userPostgresRepository.checkByEmail('any_email')

      expect(exists).toBeFalsy()
    })
  })
  describe('create()', () => {
    test('Should return true if user are created', async () => {
      client.query.mockResolvedValueOnce({
        rows: [
          mockCreateUserRepositoryParams
        ],
        rowCount: 1
      })

      const exists = await userPostgresRepository.create(mockCreateUserRepositoryParams)

      expect(exists).toBeTruthy()
    })
    test('Should return false if user dont create', async () => {
      client.query.mockResolvedValueOnce({
        rows: [],
        rowCount: 0
      })

      const exists = await userPostgresRepository.create(mockCreateUserRepositoryParams)

      expect(exists).toBeFalsy()
    })
  })
})
