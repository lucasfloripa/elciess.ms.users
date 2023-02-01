import { Kafka, Partitioners, Producer } from 'kafkajs'

export const KafkaHelper = {
  kafka: new Kafka({
    clientId: process.env.KAFKA_CLIENT_ID,
    brokers: ['localhost:9092']
  }),
  producer: null as unknown as Producer,

  async producerConnect (): Promise<void> {
    if (this.producer === null) this.producer = this.kafka.producer({ createPartitioner: Partitioners.LegacyPartitioner })
    await this.producer.connect()
  },
  useProducer (): Producer {
    return this.producer
  }
}
