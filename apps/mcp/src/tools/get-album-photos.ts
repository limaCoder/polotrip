import { db } from '@polotrip/db'
import { albums, photos } from '@polotrip/db/schema'
import { desc, eq } from 'drizzle-orm'
import { z } from 'zod'
import type { MCPTool } from '../types.js'

const inputSchema = z.object({
  albumId: z.string(),
  userId: z.string(),
  limit: z.number().optional().default(20),
})

export const getAlbumPhotosTool: MCPTool = {
  name: 'getAlbumPhotos',
  description: 'Get photos from a specific album',
  inputSchema: {
    type: 'object',
    properties: {
      albumId: { type: 'string', description: 'Album ID' },
      userId: { type: 'string', description: 'User ID (for authorization)' },
      limit: { type: 'number', description: 'Max photos to return', default: 20 },
    },
    required: ['albumId', 'userId'],
  },
  handler: async (params: unknown) => {
    const { albumId, userId, limit } = inputSchema.parse(params)

    // Verify album ownership
    const album = await db
      .select()
      .from(albums)
      .where(eq(albums.id, albumId))
      .then((rows) => rows[0])

    if (!album || album.userId !== userId) {
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({ error: 'Album not found or unauthorized' }),
          },
        ],
      }
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
      .orderBy(desc(photos.createdAt))

    return {
      content: [
        {
          type: 'text',
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
    }
  },
}
