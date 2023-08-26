import { UserValidation } from '../../domain/implementations'
import { UserValidationDTO, UserValidationResponse } from '../dtos'
import { ok } from '../helpers'
import { HttpResponse, Middleware } from '../protocols'

export class UserValidationMiddleware implements Middleware {
  constructor (
    private readonly userValidation: UserValidation
  ) {}

  async handle (request: UserValidationDTO): Promise<HttpResponse<UserValidationResponse>> {
    try {
      const userId = await this.userValidation.execute(request.token)
      return ok({ userId })
    } catch (error) {
      return error
    }
  }
}
