import { InvalidDateFormatError } from '@/domain/errors'
import { DateValidation } from '@/presentation/validators'

describe('DateValidation', () => {
  let dateValidation: DateValidation

  beforeEach(() => {
    dateValidation = new DateValidation()
  })

  it('should return undefined for a valid date in yyyy-mm-dd format', () => {
    const input = { date: '2025-10-04' }
    const result = dateValidation.validate(input)
    expect(result).toBeUndefined()
  })

  it('should return InvalidDateFormatError if date is not a string', () => {
    const input = { date: 20251004 }
    const result = dateValidation.validate(input)
    expect(result).toBeInstanceOf(InvalidDateFormatError)
  })

  it('should return InvalidDateFormatError if date format is invalid', () => {
    const inputs = [
      { date: '04-10-2025' }, // formato invertido
      { date: '2025/10/04' }, // separador incorreto
      { date: '20251004' }, // sem separadores
      { date: '2025-1-4' } // mês/dia sem zero à esquerda
    ]

    for (const input of inputs) {
      const result = dateValidation.validate(input)
      expect(result).toBeInstanceOf(InvalidDateFormatError)
    }
  })

  it('should return InvalidDateFormatError for invalid calendar dates', () => {
    const inputs = [
      { date: '2025-02-30' }, // fevereiro 30 não existe
      { date: '2025-13-01' }, // mês 13 inválido
      { date: '2025-00-10' }, // mês 0 inválido
      { date: '2025-04-31' } // abril tem 30 dias
    ]

    for (const input of inputs) {
      const result = dateValidation.validate(input)
      expect(result).toBeInstanceOf(InvalidDateFormatError)
    }
  })

  it('should return undefined for a valid leap year date', () => {
    const input = { date: '2024-02-29' }
    const result = dateValidation.validate(input)
    expect(result).toBeUndefined()
  })
})
