import { badRequest, forbidden, serverError, ok } from '../helpers'
import { EmailInUseError, ServerError } from '../errors'
import { Controller, HttpResponse, Validation } from '../protocols'
import { CreateUserRequestDTO, CreateUserResponseDTO } from '../dtos'
import { CreateUserImplementation } from '../../domain/implementation'

export class CreateUserController implements Controller {
  constructor (
    private readonly createUserImplementation: CreateUserImplementation,
    private readonly validation: Validation
  ) {}

  async handle (request: CreateUserRequestDTO): Promise<HttpResponse<CreateUserResponseDTO>> {
    try {
      const error = this.validation.validate(request)
      if (error != null) return badRequest(error)
      const isValid = await this.createUserImplementation.create(request)
      if (!isValid) return forbidden(new EmailInUseError())
      return ok(`${request.email} registered successfully`)
    } catch (error) {
      return serverError(new ServerError(error))
    }
  }
}
