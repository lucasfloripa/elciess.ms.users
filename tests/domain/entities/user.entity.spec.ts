import * as shortUuid from 'short-uuid'

import { User } from '@/domain/entities'
import { UserRoles } from '@/domain/enums'
import { type ICreateUserRequestDTO } from '@/domain/ports/inbounds'
import { Email, Password } from '@/domain/value-objects'

jest.mock('short-uuid')
jest.mock('@/domain/value-objects/email.value-object')
jest.mock('@/domain/value-objects/password.value-object')

describe('User Entity', () => {
  const mockShortUuid = shortUuid as jest.Mocked<typeof shortUuid>
  const mockEmail = Email as jest.Mocked<typeof Email>
  const mockPassword = Password as jest.Mocked<typeof Password>

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

      const mockEmailInstance = {
        value: jest.fn().mockReturnValue(input.email)
      } as unknown as Email

      const mockPasswordInstance = {
        value: jest.fn().mockReturnValue('hashed-password')
      } as unknown as Password

      mockShortUuid.generate.mockReturnValue(generatedId as shortUuid.SUUID)
      mockEmail.create.mockReturnValue(mockEmailInstance)
      mockPassword.create.mockResolvedValue(mockPasswordInstance)

      const user = await User.create(input)

      expect(mockShortUuid.generate).toHaveBeenCalled()
      expect(mockEmail.create).toHaveBeenCalledWith(input.email)
      expect(mockPassword.create).toHaveBeenCalledWith(input.password)

      expect(user).toEqual(
        new User(
          generatedId,
          mockEmailInstance,
          mockPasswordInstance,
          UserRoles.DEFAULT
        )
      )
    })
  })

  describe('toReturn', () => {
    it('should return sanitized user data', () => {
      const user = new User(
        'user-id',
        { value: () => 'email@example.com' } as unknown as Email,
        { value: () => 'hashed-password' } as unknown as Password,
        UserRoles.DEFAULT
      )

      expect(user.toReturn()).toEqual({
        userId: 'user-id',
        email: 'email@example.com',
        role: UserRoles.DEFAULT
      })
    })
  })

  describe('toPersistence', () => {
    it('should return user data for persistence', () => {
      const user = new User(
        'user-id',
        { value: () => 'email@example.com' } as unknown as Email,
        { value: () => 'hashed-password' } as unknown as Password,
        UserRoles.DEFAULT
      )

      expect(user.toPersistence()).toEqual({
        userId: 'user-id',
        email: 'email@example.com',
        password: 'hashed-password',
        role: UserRoles.DEFAULT
      })
    })
  })
})
