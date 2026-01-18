import { db } from "@polotrip/db";
import { albums, photos } from "@polotrip/db/schema";
import { eq, sql } from "drizzle-orm";
import { z } from "zod";
import type { RegisterableMcpTool } from "../types";

export const zodInputSchema = z.object({
  albumId: z.string().describe("Album ID"),
  userId: z.string().describe("User ID (for authorization)"),
});

export const getTripStatsTool: RegisterableMcpTool = {
  zodInputSchema,
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
    const { albumId, userId } = zodInputSchema.parse(params);

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
        totalPhotos: sql<number>`COUNT(*)`.mapWith(Number),
        photosWithLocation:
          sql<number>`COUNT(*) FILTER (WHERE ${photos.latitude} IS NOT NULL AND ${photos.longitude} IS NOT NULL)`.mapWith(
            Number
          ),
        uniqueLocations:
          sql<number>`COUNT(DISTINCT ${photos.locationName}) FILTER (WHERE ${photos.locationName} IS NOT NULL)`.mapWith(
            Number
          ),
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
                totalPhotos: Number(stats?.totalPhotos) || 0,
                photosWithLocation: Number(stats?.photosWithLocation) || 0,
                uniqueLocations: Number(stats?.uniqueLocations) || 0,
                dateRange: {
                  start: stats?.earliestDate || null,
                  end: stats?.latestDate || null,
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
