import { InvalidEmailFormatError } from '../../src/domain/errors'
import { EmailValidation } from '../../src/utils/validators'

describe('EmailValidation', () => {
  let emailValidation: EmailValidation

  beforeEach(() => {
    emailValidation = new EmailValidation()
  })

  it('should return an error if email format is invalid', () => {
    const input = {
      email: 'invalid-email'
    }

    const result = emailValidation.validate(input)

    expect(result).toEqual(new InvalidEmailFormatError())
  })

  it('should not return an error if email format is valid', () => {
    const input = {
      email: 'valid.email@example.com'
    }

    const result = emailValidation.validate(input)

    expect(result).toBeUndefined()
  })
})
