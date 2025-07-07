export interface IHttpResponse<T = any> {
  statusCode: number
  body?: T
}

export const httpResponses = {
  http200: <T>(data: T): IHttpResponse => ({
    statusCode: 200,
    body: data
  }),
  http201: <T>(data: T): IHttpResponse => ({
    statusCode: 201,
    body: data
  }),
  http204: (): IHttpResponse => ({
    statusCode: 204
  }),
  http400: (error: Error): IHttpResponse => ({
    statusCode: 400,
    body: error
  }),
  http401: (error: Error): IHttpResponse => ({
    statusCode: 401,
    body: error
  }),
  http403: (error: Error): IHttpResponse => ({
    statusCode: 403,
    body: error
  }),
  http404: (error: Error): IHttpResponse => ({
    statusCode: 404,
    body: error
  }),
  http409: (error: Error): IHttpResponse => ({
    statusCode: 409,
    body: error
  }),
  http500: (error: Error): IHttpResponse => ({
    statusCode: 500,
    body: error.message
  })
}
