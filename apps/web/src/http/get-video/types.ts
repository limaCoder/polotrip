type VideoStyle = "emotional" | "documentary" | "fun";
type VideoStatus = "pending" | "processing" | "success" | "failed";

type GetVideoRequest = {
  albumId: string;
  signal?: AbortSignal;
};

type VideoData = {
  id: string;
  albumId: string;
  status: VideoStatus;
  style: VideoStyle;
  videoUrl: string | null;
  thumbnailUrl: string | null;
  durationSeconds: number | null;
  scriptText: string | null;
  narrationUrl: string | null;
  errorMessage: string | null;
  retryCount: number;
  createdAt: string;
  updatedAt: string;
  startedAt: string | null;
  completedAt: string | null;
};

type GetVideoResponse = {
  video: VideoData | null;
};

export type { GetVideoRequest, GetVideoResponse, VideoData, VideoStyle, VideoStatus };
