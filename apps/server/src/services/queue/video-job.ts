import { InternalServerError } from "@/http/errors";
import { rabbitmqService } from "./rabbitmq-service";

const VIDEO_GENERATION_QUEUE = "video-generation";

export type VideoGenerationJob = {
  albumId: string;
  videoId: string;
  style: "emotional" | "documentary" | "fun";
  callbackUrl: string;
};

export async function publishVideoJob(
  job: VideoGenerationJob
): Promise<boolean> {
  try {
    return await rabbitmqService.publish(job, VIDEO_GENERATION_QUEUE);
  } catch (error) {
    throw new InternalServerError(
      "Failed to queue video generation job",
      "RABBITMQ_PUBLISH_ERROR",
      { originalError: error }
    );
  }
}
