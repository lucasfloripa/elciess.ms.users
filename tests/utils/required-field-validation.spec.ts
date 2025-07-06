import { MissingParamError } from '@/domain/errors'
import { RequiredFieldValidation } from '@/utils/validators'

describe('RequiredFieldValidation', () => {
  let requiredFieldValidation: RequiredFieldValidation

  beforeEach(() => {
    requiredFieldValidation = new RequiredFieldValidation('field')
  })

  it('should return an error if required field is missing', () => {
    const input = {
      anotherField: 'value'
    }

    const result = requiredFieldValidation.validate(input)

    expect(result).toEqual(new MissingParamError('field'))
  })

  it('should not return an error if required field is present', () => {
    const input = {
      field: 'value'
    }

    const result = requiredFieldValidation.validate(input)

    expect(result).toBeUndefined()
  })
})
