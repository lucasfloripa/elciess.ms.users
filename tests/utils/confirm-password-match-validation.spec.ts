import { InvalidPasswordMatchError } from '@/domain/errors'
import { ConfirmPasswordValidation } from '@/presentation/validators'

describe('ConfirmPasswordValidation', () => {
  let confirmPasswordValidation: ConfirmPasswordValidation

  beforeEach(() => {
    confirmPasswordValidation = new ConfirmPasswordValidation()
  })

  it('should return an error if passwords do not match', () => {
    const input = {
      password: 'password123',
      confirmPassword: 'password321'
    }

    const result = confirmPasswordValidation.validate(input)

    expect(result).toEqual(new InvalidPasswordMatchError())
  })

  it('should not return an error if passwords match', () => {
    const input = {
      password: 'password123',
      confirmPassword: 'password123'
    }

    const result = confirmPasswordValidation.validate(input)

    expect(result).toBeUndefined()
  })
})
