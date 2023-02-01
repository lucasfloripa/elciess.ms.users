import { EventStreamProducer, Messages } from 'application/protocols'
import { KafkaHelper } from './kafka-helper'

export class Kafka implements EventStreamProducer {
  async produce (topic: string, messages: Messages[]): Promise<void> {
    const producer = KafkaHelper.useProducer()
    await producer.send({
      topic,
      messages
    })
  }
}
