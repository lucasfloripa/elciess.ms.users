import { UserType } from '../../domain/enums'
import { InvalidUserTypeError } from '../../domain/errors'
import { type IValidation } from '../../presentation/contracts'

export class UserTypeValidation implements IValidation {
  validate(input: any): Error | undefined {
    const validTypes = Object.values(UserType)
    if (!validTypes.includes(input.type)) {
      return new InvalidUserTypeError()
    }
  }
}
