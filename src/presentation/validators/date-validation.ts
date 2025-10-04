import { InvalidDateFormatError } from '@/domain/errors'
import { type IValidation } from '@/presentation/contracts'

export class DateValidation implements IValidation {
  validate(input: any): Error | undefined {
    const value = input.date
    if (typeof value !== 'string') return new InvalidDateFormatError()

    const dateRegex: RegExp = /^\d{4}-\d{2}-\d{2}$/
    if (!dateRegex.test(value)) return new InvalidDateFormatError()

    const [year, month, day] = value.split('-').map(Number)
    const date = new Date(year, month - 1, day)

    if (
      date.getFullYear() !== year ||
      date.getMonth() + 1 !== month ||
      date.getDate() !== day
    ) {
      return new InvalidDateFormatError()
    }
  }
}
