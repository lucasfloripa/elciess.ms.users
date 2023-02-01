import { EventStreamProducer, Messages } from '../../../src/application/protocols'

export const mockEventStreamProducerStub = (): EventStreamProducer => {
  class EventStreamProducerStub implements EventStreamProducer {
    async produce (topic: string, messages: Messages[]): Promise<void> {}
  }
  return new EventStreamProducerStub()
}
