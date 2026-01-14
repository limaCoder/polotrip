import { db } from "@polotrip/db";
import { albums, photos } from "@polotrip/db/schema";
import { eq, sql } from "drizzle-orm";
import { z } from "zod";
import type { MCPTool } from "../types.js";

const inputSchema = z.object({
  albumId: z.string(),
  userId: z.string(),
});

export const getTripStatsTool: MCPTool = {
  name: "getTripStats",
  description:
    "Get statistics about a trip album (total photos, locations visited, date range). Use this when the user asks for statistics, counts, or summaries about a trip (e.g., 'quantas fotos', 'quais locais visitamos', 'estatísticas da viagem'). Requires albumId. Returns a statistics card with total photos, photos with location data, unique locations, and date range.",
  inputSchema: {
    type: "object",
    properties: {
      albumId: { type: "string", description: "Album ID" },
      userId: { type: "string", description: "User ID (for authorization)" },
    },
    required: ["albumId", "userId"],
  },
  handler: async (params: unknown) => {
    const { albumId, userId } = inputSchema.parse(params);

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

    const stats = await db
      .select({
        totalPhotos: sql<number>`COUNT(*)`,
        photosWithLocation: sql<number>`COUNT(*) FILTER (WHERE ${photos.latitude} IS NOT NULL AND ${photos.longitude} IS NOT NULL)`,
        uniqueLocations: sql<number>`COUNT(DISTINCT ${photos.locationName}) FILTER (WHERE ${photos.locationName} IS NOT NULL)`,
        earliestDate: sql<string>`MIN(${photos.dateTaken})`,
        latestDate: sql<string>`MAX(${photos.dateTaken})`,
      })
      .from(photos)
      .where(eq(photos.albumId, albumId))
      .then((rows) => rows[0]);

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(
            {
              album: {
                id: album.id,
                title: album.title,
                date: album.date,
              },
              stats: {
                totalPhotos: stats?.totalPhotos || 0,
                photosWithLocation: stats?.photosWithLocation || 0,
                uniqueLocations: stats?.uniqueLocations || 0,
                dateRange: {
                  start: stats?.earliestDate,
                  end: stats?.latestDate,
                },
              },
            },
            null,
            2
          ),
        },
      ],
    };
  },
};
