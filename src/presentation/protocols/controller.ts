import { type IHttpResponse } from './http'

export interface IController {
  handle: (request: any) => Promise<IHttpResponse>
}
