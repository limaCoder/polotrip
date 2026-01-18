import { db } from "@polotrip/db";
import { albums, photos } from "@polotrip/db/schema";
import { and, desc, eq, ilike, or } from "drizzle-orm";
import { z } from "zod";
import type { RegisterableMcpTool } from "../types";
import { commonWords } from "./utils/common-words";

const WORD_SPLIT_REGEX = /\s+/;

export const zodInputSchema = z.object({
  userId: z.string().describe("User ID (for authorization)"),
  searchTerm: z
    .string()
    .describe(
      "Search term to find in location name or description (case-insensitive). Can be a place name, person name, situation, or moment description."
    ),
  limit: z.number().optional().default(50).describe("Max photos to return"),
});

export const searchPhotosAcrossAlbumsTool: RegisterableMcpTool = {
  zodInputSchema,
  name: "searchPhotosAcrossAlbums",
  description:
    "Search for photos across ALL user albums by searching in location name AND description fields (case-insensitive partial match). CRITICAL: Use this tool when the user asks for photos but does NOT mention a specific album/trip name. The description field is often more important than locationName as it contains detailed information about places, people, situations, and moments. This tool searches all albums automatically, so you don't need to ask the user which album. Returns photos matching the term in either locationName or description with images, descriptions, album information, and metadata.",
  inputSchema: {
    type: "object",
    properties: {
      userId: { type: "string", description: "User ID (for authorization)" },
      searchTerm: {
        type: "string",
        description:
          "Search term to find in location name or description (case-insensitive). Can be a place name, person name, situation, or moment description.",
      },
      limit: {
        type: "number",
        description: "Max photos to return",
        default: 50,
      },
    },
    required: ["userId", "searchTerm"],
  },
  handler: async (params: unknown) => {
    const { userId, searchTerm, limit } = zodInputSchema.parse(params);

    const trimmedTerm = searchTerm.trim().toLowerCase();

    const searchWords = trimmedTerm
      .split(WORD_SPLIT_REGEX)
      .filter((word) => word.length > 1 && !commonWords.has(word))
      .map((word) => word.toLowerCase());

    if (searchWords.length === 0 && trimmedTerm.length === 0) {
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              {
                searchTerm,
                totalPhotos: 0,
                photos: [],
                error: "Invalid search term",
              },
              null,
              2
            ),
          },
        ],
      };
    }

    const termCondition =
      trimmedTerm.length > 3
        ? or(
            ilike(photos.locationName, `%${trimmedTerm}%`),
            ilike(photos.description, `%${trimmedTerm}%`)
          )
        : null;

    const searchCondition = (() => {
      if (searchWords.length === 0) {
        return (
          termCondition ??
          or(
            ilike(photos.locationName, `%${trimmedTerm}%`),
            ilike(photos.description, `%${trimmedTerm}%`)
          )
        );
      }

      if (searchWords.length === 1) {
        const word = searchWords[0];
        const wordCondition = or(
          ilike(photos.locationName, `%${word}%`),
          ilike(photos.description, `%${word}%`)
        );
        return termCondition ? or(termCondition, wordCondition) : wordCondition;
      }

      const wordConditions = searchWords.map((word) =>
        or(
          ilike(photos.locationName, `%${word}%`),
          ilike(photos.description, `%${word}%`)
        )
      );
      const allWordsCondition = and(...wordConditions);
      return termCondition
        ? or(termCondition, allWordsCondition)
        : allWordsCondition;
    })();

    const matchingPhotos = await db
      .select({
        id: photos.id,
        albumId: photos.albumId,
        imageUrl: photos.imageUrl,
        thumbnailUrl: photos.thumbnailUrl,
        dateTaken: photos.dateTaken,
        latitude: photos.latitude,
        longitude: photos.longitude,
        locationName: photos.locationName,
        description: photos.description,
        albumTitle: albums.title,
      })
      .from(photos)
      .innerJoin(albums, eq(photos.albumId, albums.id))
      .where(
        and(eq(albums.userId, userId), eq(albums.isPaid, true), searchCondition)
      )
      .limit(limit)
      .orderBy(desc(photos.dateTaken), desc(photos.createdAt));

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(
            {
              searchTerm,
              totalPhotos: matchingPhotos.length,
              photos: matchingPhotos,
            },
            null,
            2
          ),
        },
      ],
    };
  },
};
