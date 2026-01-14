import { db } from "@polotrip/db";
import { albums, photos } from "@polotrip/db/schema";
import { and, eq, ilike, or } from "drizzle-orm";
import { z } from "zod";
import type { MCPTool } from "../types.js";

const inputSchema = z.object({
  albumId: z.string(),
  userId: z.string(),
  location: z.string(),
  limit: z.number().optional().default(20),
});

export const getPhotosByLocationTool: MCPTool = {
  name: "getPhotosByLocation",
  description:
    "Get photos from an album by searching in location name AND description fields (case-insensitive partial match). CRITICAL: The description field is often more important than locationName as it contains detailed information about places, people, situations, and moments. Use this when the user asks for photos from a specific location, person, situation, or moment (e.g., 'Praia de Poá', 'Congonhas', 'avião', 'Vivi', 'aeroporto', etc.). Requires albumId and search term. Returns photos matching the term in either locationName or description with images, descriptions, and metadata.",
  inputSchema: {
    type: "object",
    properties: {
      albumId: { type: "string", description: "Album ID" },
      userId: { type: "string", description: "User ID (for authorization)" },
      location: {
        type: "string",
        description:
          "Search term to find in location name or description (case-insensitive). Can be a place name, person name, situation, or moment description.",
      },
      limit: {
        type: "number",
        description: "Max photos to return",
        default: 20,
      },
    },
    required: ["albumId", "userId", "location"],
  },
  handler: async (params: unknown) => {
    const { albumId, userId, location, limit } = inputSchema.parse(params);

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

    // Get photos matching the search term in locationName OR description
    // The description field is critical as it often contains more detailed information
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
        and(
          eq(photos.albumId, albumId),
          or(
            ilike(photos.locationName, `%${location}%`),
            ilike(photos.description, `%${location}%`)
          )
        )
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
              location,
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
