import { Email } from '@/domain/value-objects/email.value-object'

describe('Email Value Object', () => {
  it('should create an instance of Email with the provided string', () => {
    const emailStr = 'user@example.com'
    const email = Email.create(emailStr)

    expect(email).toBeInstanceOf(Email)
    expect(email.value()).toBe(emailStr)
  })

  it('should return the correct email value', () => {
    const emailStr = 'another@example.com'
    const email = Email.create(emailStr)

    const value = email.value()

    expect(value).toBe(emailStr)
  })
})
