import * as amqp from 'amqplib'
import { type Channel, type ChannelModel } from 'amqplib'

export class RabbitMQHelper {
  private static instance: RabbitMQHelper
  private connection: ChannelModel | null = null
  private channel: Channel | null = null
  private uri: string = ''

  private constructor() {}

  public static getInstance(): RabbitMQHelper {
    if (!RabbitMQHelper.instance) {
      RabbitMQHelper.instance = new RabbitMQHelper()
    }
    return RabbitMQHelper.instance
  }

  async connect(uri: string): Promise<void> {
    try {
      if (!this.connection) {
        this.uri = uri
        this.connection = await amqp.connect(uri)
        this.channel = await this.connection.createChannel()

        this.connection.on('close', () => {
          this.reconnect()
        })
        this.connection.on('error', (err) => {
          console.error('RabbitMQ connection error:', err)
          this.reconnect()
        })
      }
    } catch (err) {
      this.connection = this.channel = null
      setTimeout(() => {
        this.connect(uri).catch((err) => {
          console.error(err)
        })
      }, 5000)
    }
  }

  private reconnect(): void {
    if (this.uri && !this.connection) {
      setTimeout(() => {
        this.connect(this.uri).catch((err) => {
          console.error('RabbitMQ reconnect failed', err)
        })
      }, 5000)
    }
  }

  async disconnect(): Promise<void> {
    if (this.channel) {
      await this.channel.close()
      this.channel = null
    }
    if (this.connection) {
      await this.connection.close()
      this.connection = null
    }
    console.log('Disconnected from RabbitMQ.')
  }

  getChannel(): Channel {
    if (!this.channel) throw new Error('RabbitMQ channel is not connected.')
    return this.channel
  }
}
