export interface EventStreamProducer {
  produce: (topic: string, messages: Messages[]) => Promise<void>
}

export interface Messages {
  key?: string
  value: string
}
