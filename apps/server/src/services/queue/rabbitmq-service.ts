import amqplib from 'amqplib';

import { env } from '@/env';
import { InternalServerError } from '@/http/errors';

const VIDEO_GENERATION_QUEUE = 'video-generation';
const VIDEO_GENERATION_DLQ = 'video-generation-dlq';

type VideoGenerationJob = {
  albumId: string;
  videoId: string;
  style: 'emotional' | 'documentary' | 'fun';
  callbackUrl: string;
};

type AmqpConnection = Awaited<ReturnType<typeof amqplib.connect>>;

class RabbitMQService {
  private connection: AmqpConnection | null = null;
  private channel: amqplib.Channel | null = null;
  private readonly url: string | undefined;

  constructor() {
    this.url = env.RABBITMQ_URL;
  }

  private isEnabled(): boolean {
    return !!this.url;
  }

  private async ensureConnection(): Promise<void> {
    if (!this.isEnabled()) {
      return;
    }

    if (!this.connection) {
      this.connection = await amqplib.connect(this.url!);

      this.connection.on('error', err => {
        console.error('RabbitMQ connection error:', err);
        this.connection = null;
        this.channel = null;
      });

      this.connection.on('close', () => {
        console.log('RabbitMQ connection closed');
        this.connection = null;
        this.channel = null;
      });
    }

    if (!this.channel) {
      this.channel = await this.connection.createChannel();
      await this.setupQueues();
    }
  }

  private async setupQueues(): Promise<void> {
    if (!this.channel) {
      return;
    }

    try {
      await this.channel.assertQueue(VIDEO_GENERATION_DLQ, {
        durable: true,
      });

      await this.channel.assertQueue(VIDEO_GENERATION_QUEUE, {
        durable: true,
        deadLetterExchange: '',
        deadLetterRoutingKey: VIDEO_GENERATION_DLQ,
      });
    } catch (error: any) {
      // Erro 406 (PRECONDITION_FAILED) indica que a fila existe com configuração diferente
      if (error?.code === 406 || error?.message?.includes('406') || error?.message?.includes('PRECONDITION')) {
        const errorMessage =
          `Queue configuration mismatch. The queue '${VIDEO_GENERATION_QUEUE}' exists with different settings. ` +
          `Please delete the queue manually using: rabbitmqadmin delete queue name=${VIDEO_GENERATION_QUEUE} ` +
          `or delete it through the RabbitMQ management UI.`;
        
        console.error('RabbitMQ queue setup error:', errorMessage);
        console.error('Original error:', error);
        
        throw new InternalServerError(
          errorMessage,
          'RABBITMQ_QUEUE_CONFIG_MISMATCH',
          { originalError: error },
        );
      }
      throw error;
    }
  }

  async close(): Promise<void> {
    try {
      if (this.channel) {
        await this.channel.close();
        this.channel = null;
      }
      if (this.connection) {
        await this.connection.close();
        this.connection = null;
      }
    } catch (error) {
      console.error('Error closing RabbitMQ connection:', error);
    }
  }

  async publishVideoJob(job: VideoGenerationJob): Promise<boolean> {
    if (!this.isEnabled()) {
      console.warn('RabbitMQ is not configured. Video job not published.');
      return false;
    }

    try {
      await this.ensureConnection();

      if (!this.channel) {
        throw new InternalServerError('Failed to create RabbitMQ channel', 'RABBITMQ_ERROR');
      }

      const messageBuffer = Buffer.from(JSON.stringify(job));

      const result = this.channel.sendToQueue(VIDEO_GENERATION_QUEUE, messageBuffer, {
        persistent: true,
        contentType: 'application/json',
        timestamp: Date.now(),
      });

      return result;
    } catch (error) {
      console.error('Failed to publish video job:', error);
      throw new InternalServerError(
        'Failed to queue video generation job',
        'RABBITMQ_PUBLISH_ERROR',
        { originalError: error },
      );
    }
  }
}

export const rabbitmqService = new RabbitMQService();
export type { VideoGenerationJob };
