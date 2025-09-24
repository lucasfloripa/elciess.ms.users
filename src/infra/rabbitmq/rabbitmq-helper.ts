import * as amqp from 'amqplib'
import { type Channel, type ChannelModel } from 'amqplib'
import config from 'config'

import { type RabbitMqConfig } from '@/main/interfaces'

export class RabbitMQHelper {
  private static instance: RabbitMQHelper
  private connection: ChannelModel | null = null
  private channel: Channel | null = null
  private uri: string = ''

  private readonly EXCHANGE_EMAIL_PASSWORD_RESET: string
  private readonly QUEUE_EMAIL_PASSWORD_RESET: string
  private readonly ROUTING_EMAIL_PASSWORD_RESET: string

  private constructor() {
    const rabbiMqConfig = config.get<RabbitMqConfig>('rabbitMqConfig')
    this.EXCHANGE_EMAIL_PASSWORD_RESET =
      rabbiMqConfig.exchangeEmailPasswordReset
    this.QUEUE_EMAIL_PASSWORD_RESET = rabbiMqConfig.queueEmailPasswordReset
    this.ROUTING_EMAIL_PASSWORD_RESET = rabbiMqConfig.routingEmailPasswordReset
  }

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

        await this.initializeRabbitMQInfrastructure()

        this.connection.on('close', () => {
          this.reconnect()
        })
        this.connection.on('error', (err) => {
          console.error('RabbitMQ connection error:', err)
          this.reconnect()
        })
      }
    } catch (err) {
      console.error('Erro ao connectar no rabbitmq', err)
      this.connection = this.channel = null
      setTimeout(() => {
        this.connect(uri).catch((err) => {
          console.error(err)
        })
      }, 5000)
    }
  }

  private async initializeRabbitMQInfrastructure(): Promise<void> {
    if (!this.channel) {
      throw new Error(
        'Channel is not available to initialize RabbitMQ infrastructure.'
      )
    }

    await this.channel.assertExchange(
      this.EXCHANGE_EMAIL_PASSWORD_RESET,
      'direct',
      {
        durable: true
      }
    )
    await this.channel.assertQueue(this.QUEUE_EMAIL_PASSWORD_RESET, {
      durable: true
    })
    await this.channel.bindQueue(
      this.QUEUE_EMAIL_PASSWORD_RESET,
      this.EXCHANGE_EMAIL_PASSWORD_RESET,
      this.ROUTING_EMAIL_PASSWORD_RESET
    )
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
  }

  getChannel(): Channel {
    if (!this.channel) throw new Error('RabbitMQ channel is not connected.')
    return this.channel
  }
}
