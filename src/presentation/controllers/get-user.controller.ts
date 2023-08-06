import { badRequest, notFound, ok, serverError } from '../helpers'
import { Controller, HttpResponse, Validation } from '../protocols'
import { GetUserRequestDTO, GetUserResponseDTO } from '../dtos'
import { GetUser } from '../../domain/implementations'

export class GetUserController implements Controller {
  constructor (
    private readonly getUserUsecase: GetUser,
    private readonly validation: Validation
  ) {}

  async handle (request: GetUserRequestDTO): Promise<HttpResponse<GetUserResponseDTO>> {
    try {
      const error = this.validation.validate(request)
      if (error != null) return badRequest(error)
      const user = await this.getUserUsecase.execute(request.id)
      if (!user) return notFound('User not found')
      return ok(user)
    } catch (error) {
      return serverError(error)
    }
  }
}
