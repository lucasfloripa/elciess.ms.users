import { type IValidation } from '@/presentation/contracts'

export class ValidationComposite implements IValidation {
  constructor(private readonly validations: IValidation[]) {}

  validate(input: any): Error | undefined {
    for (const validation of this.validations) {
      const error = validation.validate(input)
      if (error) {
        return error
      }
    }
  }
}
