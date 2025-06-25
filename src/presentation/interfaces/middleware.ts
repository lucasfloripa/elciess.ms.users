import { type IHttpResponse } from './http'

export interface IMiddleware {
  handle: (request: any) => Promise<IHttpResponse>
}
