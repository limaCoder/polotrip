import { db } from "@polotrip/db";
import { albums, photos } from "@polotrip/db/schema";
import { desc, eq } from "drizzle-orm";
import { z } from "zod";
import type { RegisterableMcpTool } from "../types.js";

export const zodInputSchema = z.object({
  albumId: z.string().describe("Album ID"),
  userId: z.string().describe("User ID (for authorization)"),
  limit: z.number().optional().default(20).describe("Max photos to return"),
});

export const getAlbumPhotosTool: RegisterableMcpTool = {
  zodInputSchema,
  name: "getAlbumPhotos",
  description:
    "Get photos from a specific album. Use this when the user asks to see photos from an album (e.g., 'me mostre as fotos do álbum X', 'quero ver as fotos'). Requires albumId (get it from getUserAlbums or getAlbumByName first). Returns album info and an array of photos with images, descriptions, locations, and dates.",
  inputSchema: {
    type: "object",
    properties: {
      albumId: { type: "string", description: "Album ID" },
      userId: { type: "string", description: "User ID (for authorization)" },
      limit: {
        type: "number",
        description: "Max photos to return",
        default: 20,
      },
    },
    required: ["albumId", "userId"],
  },
  handler: async (params: unknown) => {
    const { albumId, userId, limit } = zodInputSchema.parse(params);

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
      .where(eq(photos.albumId, albumId))
      .limit(limit)
      .orderBy(desc(photos.createdAt));

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(
            {
              album: {
                id: album.id,
                title: album.title,
                photoCount: album.photoCount,
              },
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
