import { db } from '@polotrip/db'
import { albums } from '@polotrip/db/schema'
import { and, desc, eq } from 'drizzle-orm'
import { z } from 'zod'
import type { MCPTool } from '../types.js'

const inputSchema = z.object({
  userId: z.string(),
  limit: z.number().optional().default(10),
})

export const getUserAlbumsTool: MCPTool = {
  name: 'getUserAlbums',
  description: 'Get all albums for a specific user',
  inputSchema: {
    type: 'object',
    properties: {
      userId: { type: 'string', description: 'User ID' },
      limit: { type: 'number', description: 'Max albums to return', default: 10 },
    },
    required: ['userId'],
  },
  handler: async (params: unknown) => {
    const { userId, limit } = inputSchema.parse(params)

    const userAlbums = await db
      .select({
        id: albums.id,
        title: albums.title,
        date: albums.date,
        description: albums.description,
        photoCount: albums.photoCount,
        photoLimit: albums.photoLimit,
        isPublished: albums.isPublished,
        plan: albums.plan,
        createdAt: albums.createdAt,
      })
      .from(albums)
      .where(and(eq(albums.userId, userId), eq(albums.isPaid, true)))
      .limit(limit)
      .orderBy(desc(albums.createdAt))

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(userAlbums, null, 2),
        },
      ],
    }
  },
}
