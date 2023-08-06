import { badRequest, forbidden, serverError, ok } from '../helpers'
import { EmailInUseError, ServerError } from '../errors'
import { Controller, HttpResponse, Validation } from '../protocols'
import { CreateUserRequestDTO, CreateUserResponseDTO } from '../dtos'
import { CreateUser } from '../../domain/implementations'

export class CreateUserController implements Controller {
  constructor (
    private readonly createUserUsecase: CreateUser,
    private readonly validation: Validation
  ) {}

  async handle (request: CreateUserRequestDTO): Promise<HttpResponse<CreateUserResponseDTO>> {
    try {
      const error = this.validation.validate(request)
      if (error != null) return badRequest(error)
      const isValid = await this.createUserUsecase.execute(request)
      if (!isValid) return forbidden(new EmailInUseError())
      return ok(`${request.email} registered successfully`)
    } catch (error) {
      return serverError(new ServerError(error))
    }
  }
}
