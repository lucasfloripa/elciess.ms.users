import { MissingParamError } from '../../domain/errors'
import { type IUser } from '../../domain/interfaces/user.interfaces'
import { type IValidation } from '../../presentation/contracts'

export class OneFieldValidation implements IValidation {
  constructor(private readonly requiredFields: Array<keyof IUser>) {}

  validate(input: any): Error | undefined {
    const hasAtLeastOneField = this.requiredFields.some(
      (field) => field in input
    )

    if (!hasAtLeastOneField) {
      return new MissingParamError(
        `At least one of: ${this.requiredFields.join(', ')}`
      )
    }
  }
}
