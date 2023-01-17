import { CreateUserImplementation } from 'domain/implementation'
import { Controller, HttpResponse, Validation } from '../protocols'

export class CreateUserController implements Controller {
  constructor (
    private readonly createUserImplementation: CreateUserImplementation,
    private readonly validation: Validation
  ) {}

  async handle (request: CreateUserController.Params): Promise<HttpResponse<string>> {
    this.validation.validate(request)

    await this.createUserImplementation.create(request)

    return {
      statusCode: 200,
      body: 'user created successfully'
    }
  }
}

export namespace CreateUserController {
  export interface Params {
    email: string
    password: string
    confirmPassword: string
  }
}
