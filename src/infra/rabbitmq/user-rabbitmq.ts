import { type IMessagerService } from '@/application/contracts/messager-service.contract'

import { RabbitMQHelper } from './rabbitmq-helper'

export class UserRabbitMq implements IMessagerService {
  private readonly rabbitMqHelper: RabbitMQHelper

  constructor() {
    this.rabbitMqHelper = RabbitMQHelper.getInstance()
  }

  async sendMessage(
    exchange: string,
    routingKey: string,
    payload: string
  ): Promise<void> {
    const channel = this.rabbitMqHelper.getChannel()

    channel.publish(
      exchange,
      routingKey,
      Buffer.from(JSON.stringify(payload)),
      {
        persistent: true,
        contentType: 'application/json',
        messageId: 'messageId',
        timestamp: Date.now()
      }
    )
  }
}
