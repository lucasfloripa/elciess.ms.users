export interface IMessagerService {
  sendMessage: (
    exchange: string,
    routingKey: string,
    payload: string
  ) => Promise<void>
}
