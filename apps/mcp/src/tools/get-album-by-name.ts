import { db } from "@polotrip/db";
import { albums } from "@polotrip/db/schema";
import { and, desc, eq, ilike } from "drizzle-orm";
import { z } from "zod";
import type { MCPTool } from "../types.js";

const inputSchema = z.object({
  userId: z.string(),
  query: z.string(),
});

export const getAlbumByNameTool: MCPTool = {
  name: "getAlbumByName",
  description:
    'Search for albums by name/title (case-insensitive partial match). Use this when the user mentions a specific album name like "Beto Carrero", "São Paulo", "Campos do Jordão", etc. Returns matching albums with full details including cover images.',
  inputSchema: {
    type: "object",
    properties: {
      userId: { type: "string", description: "User ID" },
      query: {
        type: "string",
        description: "Search query for album title",
      },
    },
    required: ["userId", "query"],
  },
  handler: async (params: unknown) => {
    const { userId, query } = inputSchema.parse(params);

    const matchingAlbums = await db
      .select({
        id: albums.id,
        title: albums.title,
        date: albums.date,
        description: albums.description,
        coverImageUrl: albums.coverImageUrl,
        photoCount: albums.photoCount,
        photoLimit: albums.photoLimit,
        isPublished: albums.isPublished,
        plan: albums.plan,
        createdAt: albums.createdAt,
      })
      .from(albums)
      .where(
        and(
          eq(albums.userId, userId),
          eq(albums.isPaid, true),
          ilike(albums.title, `%${query}%`)
        )
      )
      .orderBy(desc(albums.createdAt));

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(
            {
              query,
              count: matchingAlbums.length,
              albums: matchingAlbums,
            },
            null,
            2
          ),
        },
      ],
    };
  },
};
