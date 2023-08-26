import { HttpResponse } from './http-response'

export interface Middleware<T = any> {
  handle: (request: T) => Promise<HttpResponse>
}
