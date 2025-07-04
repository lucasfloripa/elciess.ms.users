import { MissingParamError } from '@/domain/errors'
import { type IValidation } from '@/presentation/contracts'

export class RequiredFieldValidation implements IValidation {
  constructor(private readonly fieldName: string) {}

  validate(input: any): Error | undefined {
    if (!input[this.fieldName]) {
      return new MissingParamError(this.fieldName)
    }
  }
}
