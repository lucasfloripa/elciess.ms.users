export interface Controller<T = any> {
  handle: (request: T) => Promise<HttpResponse>
}

export interface HttpResponse<T = any> {
  statusCode: number
  body: T
}
