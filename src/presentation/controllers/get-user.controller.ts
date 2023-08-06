import { badRequest, notFound, ok, serverError } from '../helpers'
import { Controller, HttpResponse, Validation } from '../protocols'
import { GetUserRequestDTO, GetUserResponseDTO } from '../dtos'
import { GetUserImplementation } from '../../domain/implementation'

export class GetUserController implements Controller {
  constructor (
    private readonly getUserImplementation: GetUserImplementation,
    private readonly validation: Validation
  ) {}

  async handle (request: GetUserRequestDTO): Promise<HttpResponse<GetUserResponseDTO>> {
    try {
      const error = this.validation.validate(request)
      if (error != null) return badRequest(error)
      const user = await this.getUserImplementation.getUser(request.id)
      if (!user) return notFound('User not found')
      return ok(user)
    } catch (error) {
      return serverError(error)
    }
  }
}
