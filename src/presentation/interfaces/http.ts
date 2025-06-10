export interface IHttpResponse<T = any> {
  statusCode: number
  body: T
}

export const htttpResponses = {
  http200: (data: any): IHttpResponse => ({
    statusCode: 200,
    body: data
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
  http500: (error: Error): IHttpResponse => ({
    statusCode: 500,
    body: error
  })
}
