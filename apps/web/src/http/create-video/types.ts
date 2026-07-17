type VideoStyle = "emotional" | "documentary" | "fun";
type VideoStatus = "pending" | "processing" | "success" | "failed";

type CreateVideoRequest = {
  albumId: string;
  body: {
    style: VideoStyle;
  };
};

type CreateVideoResponse = {
  video: {
    id: string;
    albumId: string;
    status: VideoStatus;
    style: VideoStyle;
    createdAt: string;
  };
};

export type { CreateVideoRequest, CreateVideoResponse, VideoStyle, VideoStatus };
