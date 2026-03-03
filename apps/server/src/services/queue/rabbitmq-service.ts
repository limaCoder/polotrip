import amqplib from "amqplib";

import { env } from "@/env";
import { InternalServerError } from "@/http/errors";

const VIDEO_GENERATION_QUEUE = "video-generation";
const VIDEO_GENERATION_DLQ = "video-generation-dlq";

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

      this.connection.on("error", () => {
        this.connection = null;
        this.channel = null;
      });

      this.connection.on("close", () => {
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
        deadLetterExchange: "",
        deadLetterRoutingKey: VIDEO_GENERATION_DLQ,
      });
    } catch (error: unknown) {
      const err = error as { code?: number; message?: string };
      if (
        err?.code === 406 ||
        err?.message?.includes("406") ||
        err?.message?.includes("PRECONDITION")
      ) {
        const errorMessage =
          `Queue configuration mismatch. The queue '${VIDEO_GENERATION_QUEUE}' exists with different settings. ` +
          `Please delete the queue manually using: rabbitmqadmin delete queue name=${VIDEO_GENERATION_QUEUE} ` +
          "or delete it through the RabbitMQ management UI.";

        throw new InternalServerError(
          errorMessage,
          "RABBITMQ_QUEUE_CONFIG_MISMATCH",
          { originalError: err }
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
      throw new InternalServerError(
        "Error closing RabbitMQ connection",
        "RABBITMQ_CLOSE_ERROR",
        { originalError: error }
      );
    }
  }

  async publish(
    message: unknown,
    queue: string = VIDEO_GENERATION_QUEUE
  ): Promise<boolean> {
    if (!this.isEnabled()) {
      return false;
    }

    try {
      await this.ensureConnection();

      if (!this.channel) {
        throw new InternalServerError(
          "Failed to create RabbitMQ channel",
          "RABBITMQ_ERROR"
        );
      }

      const messageBuffer = Buffer.from(JSON.stringify(message));

      const result = this.channel.sendToQueue(queue, messageBuffer, {
        persistent: true,
        contentType: "application/json",
        timestamp: Date.now(),
      });

      return result;
    } catch (error) {
      throw new InternalServerError(
        "Failed to publish message to RabbitMQ",
        "RABBITMQ_PUBLISH_ERROR",
        { originalError: error }
      );
    }
  }
}

export const rabbitmqService = new RabbitMQService();
