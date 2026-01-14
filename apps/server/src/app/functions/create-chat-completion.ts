import { openai } from '@ai-sdk/openai'
import { streamText, tool } from 'ai'
import { z } from 'zod'
import { mcpClient } from '@/app/lib/mcp-client'

type CreateChatCompletionRequest = {
  userId: string
  messages: Array<{ role: 'user' | 'assistant'; content: string }>
}

const SYSTEM_PROMPT = `You are a helpful AI assistant for Polotrip, a travel photo album platform.
You can help users:
- Find and browse their travel albums
- Get information about photos from their trips
- Search for photos by date or location
- Get statistics about their trips (number of photos, locations visited, date ranges)

When displaying information:
- Be friendly, conversational, and enthusiastic about travel
- When showing photos or albums, mention key details like titles, dates, and photo counts
- If a user asks about a specific location or date, use the appropriate tools to find that information
- Format dates in a human-readable way (e.g., "January 15, 2024" instead of "2024-01-15")
- When showing statistics, present them in an engaging way

Always prioritize accuracy - use the tools to get real data instead of guessing.`

export async function createChatCompletion({
  userId,
  messages,
}: CreateChatCompletionRequest) {
  try {
    // Connect to MCP server
    await mcpClient.connect()

    // Define tools that call MCP
    const result = await streamText({
      model: openai('gpt-4o-mini'),
      system: SYSTEM_PROMPT,
      messages,
      tools: {
        getUserAlbums: tool({
          description: 'Get all albums for the current user',
          parameters: z.object({
            limit: z
              .number()
              .optional()
              .default(10)
              .describe('Maximum number of albums to return'),
          }),
          execute: async ({ limit }) => {
            const response = await mcpClient.callTool('getUserAlbums', {
              userId,
              limit,
            })
            return JSON.parse(response.content[0].text)
          },
        }),
        getAlbumPhotos: tool({
          description: 'Get photos from a specific album',
          parameters: z.object({
            albumId: z.string().describe('The ID of the album'),
            limit: z
              .number()
              .optional()
              .default(20)
              .describe('Maximum number of photos to return'),
          }),
          execute: async ({ albumId, limit }) => {
            const response = await mcpClient.callTool('getAlbumPhotos', {
              albumId,
              userId,
              limit,
            })
            return JSON.parse(response.content[0].text)
          },
        }),
        getTripStats: tool({
          description:
            'Get statistics about a trip album (total photos, locations visited, date range)',
          parameters: z.object({
            albumId: z.string().describe('The ID of the album'),
          }),
          execute: async ({ albumId }) => {
            const response = await mcpClient.callTool('getTripStats', {
              albumId,
              userId,
            })
            return JSON.parse(response.content[0].text)
          },
        }),
        getPhotosByDate: tool({
          description: 'Get photos from an album taken on a specific date',
          parameters: z.object({
            albumId: z.string().describe('The ID of the album'),
            date: z
              .string()
              .describe('Date in ISO format (YYYY-MM-DD), e.g., 2024-01-15'),
            limit: z
              .number()
              .optional()
              .default(20)
              .describe('Maximum number of photos to return'),
          }),
          execute: async ({ albumId, date, limit }) => {
            const response = await mcpClient.callTool('getPhotosByDate', {
              albumId,
              userId,
              date,
              limit,
            })
            return JSON.parse(response.content[0].text)
          },
        }),
        getPhotosByLocation: tool({
          description: 'Get photos from an album by location name',
          parameters: z.object({
            albumId: z.string().describe('The ID of the album'),
            location: z
              .string()
              .describe('Location name to search for (case-insensitive)'),
            limit: z
              .number()
              .optional()
              .default(20)
              .describe('Maximum number of photos to return'),
          }),
          execute: async ({ albumId, location, limit }) => {
            const response = await mcpClient.callTool('getPhotosByLocation', {
              albumId,
              userId,
              location,
              limit,
            })
            return JSON.parse(response.content[0].text)
          },
        }),
        getAlbumByName: tool({
          description: 'Search for albums by name/title',
          parameters: z.object({
            query: z.string().describe('Search query for album title'),
          }),
          execute: async ({ query }) => {
            const response = await mcpClient.callTool('getAlbumByName', {
              userId,
              query,
            })
            return JSON.parse(response.content[0].text)
          },
        }),
      },
      maxSteps: 5,
    })

    return result
  } catch (error) {
    console.error('Error creating chat completion:', error)
    throw error
  }
}
