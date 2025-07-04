import { Password } from '@/domain/value-objects/password.value-object'

describe('Password Value Object', () => {
  const rawPassword = 'mySecret123'

  describe('create', () => {
    it('should create a hashed password instance', async () => {
      const password = await Password.create(rawPassword)

      expect(password).toBeInstanceOf(Password)
      expect(password.value()).not.toBe(rawPassword)
      expect(password.value().length).toBeGreaterThan(0)
    })
  })

  describe('value', () => {
    it('should return the hashed password', async () => {
      const password = await Password.create(rawPassword)
      const hashed = password.value()

      expect(typeof hashed).toBe('string')
      expect(hashed).not.toBe(rawPassword)
    })
  })

  describe('comparePassword', () => {
    it('should return true when password matches the hash', async () => {
      const password = await Password.create(rawPassword)
      const hashed = password.value()

      const result = await Password.comparePassword(rawPassword, hashed)

      expect(result).toBe(true)
    })

    it('should return false when password does not match the hash', async () => {
      const password = await Password.create(rawPassword)
      const hashed = password.value()

      const result = await Password.comparePassword('wrongPassword', hashed)

      expect(result).toBe(false)
    })
  })
})
