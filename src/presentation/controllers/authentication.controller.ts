import { badRequest, ok } from '../helpers'
import { Controller, HttpResponse, Validation } from '../protocols'
import { AuthenticationRequestDTO, AuthenticationResponse } from '../dtos'
import { Authentication } from '../../domain/implementations'

export class AuthenticationController implements Controller {
  constructor (
    private readonly authenticationUsecase: Authentication,
    private readonly validation: Validation
  ) {}

  async handle (request: AuthenticationRequestDTO): Promise<HttpResponse<AuthenticationResponse>> {
    try {
      const error = this.validation.validate(request)
      if (error != null) return badRequest(error)
      const token = await this.authenticationUsecase.execute(request)
      return ok({ token })
    } catch (error) {
      return error
    }
  }
}
