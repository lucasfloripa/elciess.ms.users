import { GetUserImplementation } from '@src/domain/implementation'
import { User } from '@src/domain/models'
import { badRequest, notFound, ok, serverError } from '@src/presentation/helpers'
import { Controller, HttpResponse, Validation } from '@src/presentation/protocols'

export class GetUserController implements Controller {
  constructor (
    private readonly getUserImplementation: GetUserImplementation,
    private readonly validation: Validation
  ) {}

  async handle (request: GetUserController.Params): Promise<HttpResponse<GetUserController.Result>> {
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

export namespace GetUserController {
  export interface Params {
    id: string
  }

  export interface Result {
    user: User
  }
}
