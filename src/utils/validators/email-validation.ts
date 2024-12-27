import { InvalidEmailFormatError } from '../../domain/errors'
import { type IValidation } from '../../presentation/contracts'

export class EmailValidation implements IValidation {
  validate(input: any): Error | undefined {
    const emailRegex: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(input.email)) return new InvalidEmailFormatError()
  }
}
