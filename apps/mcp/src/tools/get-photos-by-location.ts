import { db } from '@polotrip/db'
import { albums, photos } from '@polotrip/db/schema'
import { and, eq, ilike } from 'drizzle-orm'
import { z } from 'zod'
import type { MCPTool } from '../types.js'

const inputSchema = z.object({
  albumId: z.string(),
  userId: z.string(),
  location: z.string(),
  limit: z.number().optional().default(20),
})

export const getPhotosByLocationTool: MCPTool = {
  name: 'getPhotosByLocation',
  description: 'Get photos from an album by location name',
  inputSchema: {
    type: 'object',
    properties: {
      albumId: { type: 'string', description: 'Album ID' },
      userId: { type: 'string', description: 'User ID (for authorization)' },
      location: {
        type: 'string',
        description: 'Location name to search for (case-insensitive)',
      },
      limit: { type: 'number', description: 'Max photos to return', default: 20 },
    },
    required: ['albumId', 'userId', 'location'],
  },
  handler: async (params: unknown) => {
    const { albumId, userId, location, limit } = inputSchema.parse(params)

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

    // Get photos for the specified location
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
          ilike(photos.locationName, `%${location}%`)
        )
      )
      .limit(limit)

    return {
      content: [
        {
          type: 'text',
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
    }
  },
}
