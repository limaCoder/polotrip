import { db } from "@polotrip/db";
import { albums } from "@polotrip/db/schema";
import { and, desc, eq } from "drizzle-orm";
import { z } from "zod";
import type { RegisterableMcpTool } from "../types";

export const zodInputSchema = z.object({
  userId: z.string().describe("User ID"),
  limit: z.number().optional().default(10).describe("Max albums to return"),
});

export const getUserAlbumsTool: RegisterableMcpTool = {
  zodInputSchema,
  name: "getUserAlbums",
  description:
    "Get all albums for a specific user. Use this when the user asks to see their albums, lists albums, or when you need to find an album ID. Returns an array of albums with cover images, dates, photo counts, and other metadata.",
  inputSchema: {
    type: "object",
    properties: {
      userId: { type: "string", description: "User ID" },
      limit: {
        type: "number",
        description: "Max albums to return",
        default: 10,
      },
    },
    required: ["userId"],
  },
  handler: async (params: unknown) => {
    const { userId, limit } = zodInputSchema.parse(params);

    const userAlbums = await db
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
      .where(and(eq(albums.userId, userId), eq(albums.isPaid, true)))
      .limit(limit)
      .orderBy(desc(albums.createdAt));

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(userAlbums, null, 2),
        },
      ],
    };
  },
};
