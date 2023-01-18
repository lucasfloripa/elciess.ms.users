import { CreateUserImplementation } from '../../domain/implementation'
import { badRequest, forbidden, serverError, ok } from '../helpers'
import { EmailInUseError, ServerError } from '../errors'
import { Controller, HttpResponse, Validation } from '../protocols'

export class CreateUserController implements Controller {
  constructor (
    private readonly createUserImplementation: CreateUserImplementation,
    private readonly validation: Validation
  ) {}

  async handle (request: CreateUserController.Params): Promise<HttpResponse<CreateUserController.Response>> {
    try {
      const error = this.validation.validate(request)
      if (error != null) return badRequest(error)
      const isValid = await this.createUserImplementation.create(request)
      if (isValid == null) return forbidden(new EmailInUseError())
      return ok(`${request.email} registered successfully`)
    } catch (error) {
      return serverError(new ServerError(error))
    }
  }
}

export namespace CreateUserController {
  export interface Params {
    email: string
    password: string
    confirmPassword: string
  }
  export interface Response {
    message: string
  }
}
