import { type IValidation } from '@/presentation/contracts'
import { ValidationComposite } from '@/presentation/validators/validation-composite'

describe('ValidationComposite', () => {
  let validationComposite: ValidationComposite
  let validation1: jest.Mocked<IValidation>
  let validation2: jest.Mocked<IValidation>

  beforeEach(() => {
    validation1 = {
      validate: jest.fn()
    }
    validation2 = {
      validate: jest.fn()
    }
    validationComposite = new ValidationComposite([validation1, validation2])
  })

  it('should return the first error found', () => {
    const input = { field: 'value' }
    const error1 = new Error('Error 1')
    const error2 = new Error('Error 2')

    validation1.validate.mockReturnValueOnce(error1)
    validation2.validate.mockReturnValueOnce(error2)

    const result = validationComposite.validate(input)

    expect(result).toBe(error1)
    expect(validation1.validate).toHaveBeenCalledWith(input)
    expect(validation2.validate).not.toHaveBeenCalled()
  })

  it('should not return an error if all validations pass', () => {
    const input = { field: 'value' }

    validation1.validate.mockReturnValueOnce(undefined)
    validation2.validate.mockReturnValueOnce(undefined)

    const result = validationComposite.validate(input)

    expect(result).toBeUndefined()
    expect(validation1.validate).toHaveBeenCalledWith(input)
    expect(validation2.validate).toHaveBeenCalledWith(input)
  })
})
