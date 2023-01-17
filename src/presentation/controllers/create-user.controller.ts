import { CreateUserImplementation } from 'domain/implementation'
import { Controller, HttpResponse } from '../protocols'

export class CreateUserController implements Controller {
  constructor (
    private readonly createUserImplementation: CreateUserImplementation
  ) {}

  async handle (request: CreateUserController.Params): Promise<HttpResponse<string>> {
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
