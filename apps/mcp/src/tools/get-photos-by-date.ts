import { db } from "@polotrip/db";
import { albums, photos } from "@polotrip/db/schema";
import { and, eq, like } from "drizzle-orm";
import { z } from "zod";
import type { MCPTool } from "../types.js";

const inputSchema = z.object({
  albumId: z.string(),
  userId: z.string(),
  date: z.string(), // ISO date string (YYYY-MM-DD)
  limit: z.number().optional().default(20),
});

export const getPhotosByDateTool: MCPTool = {
  name: "getPhotosByDate",
  description: "Get photos from an album by specific date",
  inputSchema: {
    type: "object",
    properties: {
      albumId: { type: "string", description: "Album ID" },
      userId: { type: "string", description: "User ID (for authorization)" },
      date: {
        type: "string",
        description: "Date in ISO format (YYYY-MM-DD)",
      },
      limit: {
        type: "number",
        description: "Max photos to return",
        default: 20,
      },
    },
    required: ["albumId", "userId", "date"],
  },
  handler: async (params: unknown) => {
    const { albumId, userId, date, limit } = inputSchema.parse(params);

    const album = await db
      .select()
      .from(albums)
      .where(eq(albums.id, albumId))
      .then((rows) => rows[0]);

    if (!album || album.userId !== userId) {
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({ error: "Album not found or unauthorized" }),
          },
        ],
      };
    }

    const albumPhotos = await db
      .select({
        id: photos.id,
        imageUrl: photos.imageUrl,
        thumbnailUrl: photos.thumbnailUrl,
        dateTaken: photos.dateTaken,
        latitude: photos.latitude,
        longitude: photos.longitude,
        locationName: photos.locationName,
        description: photos.description,
      })
      .from(photos)
      .where(
        and(eq(photos.albumId, albumId), like(photos.dateTaken, `${date}%`))
      )
      .limit(limit);

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(
            {
              album: {
                id: album.id,
                title: album.title,
              },
              date,
              photos: albumPhotos,
            },
            null,
            2
          ),
        },
      ],
    };
  },
};
