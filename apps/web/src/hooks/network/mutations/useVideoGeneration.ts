import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useState } from "react";
import { createVideo } from "@/http/create-video";
import type { VideoStyle } from "@/http/create-video/types";
import { getVideo } from "@/http/get-video";
import type { VideoData } from "@/http/get-video/types";
import { albumKeys } from "../keys/albumKeys";

const POLLING_INTERVAL = 5000;

type UseVideoGenerationOptions = {
  albumId: string;
  enabled?: boolean;
};

type UseVideoGenerationReturn = {
  video: VideoData | null;
  isLoading: boolean;
  isGenerating: boolean;
  isPolling: boolean;
  error: Error | null;
  generateVideo: (style: VideoStyle) => Promise<void>;
};

export function useVideoGeneration({
  albumId,
  enabled = true,
}: UseVideoGenerationOptions): UseVideoGenerationReturn {
  const queryClient = useQueryClient();
  const [isPolling, setIsPolling] = useState(false);

  const {
    data: videoData,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: albumKeys.video(albumId),
    queryFn: async ({ signal }) => {
      const response = await getVideo({ albumId, signal });
      return response.video;
    },
    enabled,
    staleTime: POLLING_INTERVAL,
  });

  const shouldPoll =
    videoData?.status === "pending" || videoData?.status === "processing";

  useEffect(() => {
    if (!shouldPoll) {
      setIsPolling(false);
      return;
    }

    setIsPolling(true);
    const interval = setInterval(() => {
      refetch();
    }, POLLING_INTERVAL);

    return () => {
      clearInterval(interval);
      setIsPolling(false);
    };
  }, [shouldPoll, refetch]);

  const createVideoMutation = useMutation({
    mutationFn: async (style: VideoStyle) => {
      const response = await createVideo({
        albumId,
        body: { style },
      });
      return response.video;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: albumKeys.video(albumId) });
    },
  });

  const generateVideo = useCallback(
    async (style: VideoStyle) => {
      await createVideoMutation.mutateAsync(style);
    },
    [createVideoMutation]
  );

  return {
    video: videoData ?? null,
    isLoading,
    isGenerating: createVideoMutation.isPending,
    isPolling,
    error: (error as Error) ?? createVideoMutation.error ?? null,
    generateVideo,
  };
}
