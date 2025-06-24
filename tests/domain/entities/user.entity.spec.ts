import * as bcrypt from 'bcryptjs'
import * as jwt from 'jsonwebtoken'
import * as shortUuid from 'short-uuid'

import { User } from '../../../src/domain/entities'
import { type ICreateUserRequestDTO } from '../../../src/domain/ports/inbounds'

jest.mock('bcryptjs')
jest.mock('jsonwebtoken')
jest.mock('short-uuid')

describe('User Entity', () => {
  const mockBcrypt = bcrypt as jest.Mocked<typeof bcrypt>
  const mockJwt = jwt as jest.Mocked<typeof jwt>
  const mockShortUuid = shortUuid as jest.Mocked<typeof shortUuid>

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('create', () => {
    it('should create a user with hashed password and generated ID', async () => {
      const input: ICreateUserRequestDTO = {
        email: 'test@example.com',
        password: 'password123',
        confirmPassword: 'password123'
      }
      const generatedId = 'generated-id'
      const hashedPassword = 'hashed-password'

      mockShortUuid.generate.mockReturnValue(generatedId as shortUuid.SUUID)
      mockBcrypt.hash.mockResolvedValue(hashedPassword as never)

      const user = await User.create(input)

      expect(mockShortUuid.generate).toHaveBeenCalled()
      expect(mockBcrypt.hash).toHaveBeenCalledWith(input.password, User.SALT)
      expect(user).toEqual(new User(generatedId, input.email, hashedPassword))
    })
  })

  describe('comparePassword', () => {
    it('should return true if passwords match', async () => {
      const password = 'password123'
      const hashedPassword = 'hashed-password'

      mockBcrypt.compare.mockResolvedValue(true as never)

      const result = await User.comparePassword(password, hashedPassword)

      expect(mockBcrypt.compare).toHaveBeenCalledWith(password, hashedPassword)
      expect(result).toBe(true)
    })

    it('should return false if passwords do not match', async () => {
      const password = 'password123'
      const hashedPassword = 'hashed-password'

      mockBcrypt.compare.mockResolvedValue(false as never)

      const result = await User.comparePassword(password, hashedPassword)

      expect(mockBcrypt.compare).toHaveBeenCalledWith(password, hashedPassword)
      expect(result).toBe(false)
    })
  })

  describe('generateToken', () => {
    it('should generate a JWT token', async () => {
      const userId = 'user-id'
      const token = 'jwt-token'

      mockJwt.sign.mockReturnValue(token as unknown as void)

      const result = await User.generateToken(userId)

      expect(mockJwt.sign).toHaveBeenCalledWith({ userId }, User.JWT_SECRET)
      expect(result).toBe(token)
    })
  })
})
