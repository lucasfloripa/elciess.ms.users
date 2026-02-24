export interface IHttpResponse<T = any> {
  statusCode: number
  body?: T
}

const errorResponse = (statusCode: number, error: Error): any => {
  const newDate = new Date()
  const gmtLess3 = new Date(newDate.getTime() - 3 * 60 * 60 * 1000)
  const dateNow = gmtLess3.toISOString().split('.')[0]

  return {
    timestamp: dateNow,
    statusCode,
    error: error.name,
    message: error.message
  }
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
    body: errorResponse(401, error)
  }),
  http403: (error: Error): IHttpResponse => ({
    statusCode: 403,
    body: errorResponse(403, error)
  }),
  http404: (error: Error): IHttpResponse => ({
    statusCode: 404,
    body: errorResponse(404, error)
  }),
  http409: (error: Error): IHttpResponse => ({
    statusCode: 409,
    body: errorResponse(409, error)
  }),
  http500: (error: Error): IHttpResponse => ({
    statusCode: 500,
    body: errorResponse(500, error)
  })
}
