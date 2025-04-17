import { db } from '@polotrip/db';
import { photos } from '@polotrip/db/schema';
import { eq, sql } from 'drizzle-orm';

interface DbTransaction {
  update: typeof db.update;
  select: typeof db.select;
  execute: typeof db.execute;
}

interface PhotoUpdate {
  id: string;
  locationName?: string | null;
  description?: string | null;
  order?: string | null;
  dateTaken?: string | null;
}

/**
 * Group photo updates by fields to be updated
 */
function groupPhotoUpdates(photoUpdates: PhotoUpdate[]): PhotoUpdate[][] {
  const groups = new Map<string, PhotoUpdate[]>();

  for (const update of photoUpdates) {
    const updateKey = [
      update.dateTaken !== undefined ? 'dateTaken' : '',
      update.locationName !== undefined ? 'locationName' : '',
      update.description !== undefined ? 'description' : '',
      update.order !== undefined ? 'order' : '',
    ].join('_');

    if (!groups.has(updateKey)) {
      groups.set(updateKey, []);
    }

    const group = groups.get(updateKey);
    if (group) {
      group.push(update);
    }
  }

  return Array.from(groups.values());
}

/**
 * Update a single photo using the Drizzle API
 */
async function updateSinglePhoto(tx: DbTransaction, photoUpdate: PhotoUpdate): Promise<void> {
  const updateData: Record<string, unknown> = {
    updatedAt: new Date(),
  };

  if (photoUpdate.locationName !== undefined) updateData.locationName = photoUpdate.locationName;
  if (photoUpdate.description !== undefined) updateData.description = photoUpdate.description;
  if (photoUpdate.dateTaken !== undefined) updateData.dateTaken = photoUpdate.dateTaken;
  if (photoUpdate.order !== undefined) updateData.order = photoUpdate.order;

  await tx.update(photos).set(updateData).where(eq(photos.id, photoUpdate.id));
}

/**
 * Update multiple photos with a single SQL query
 */
async function updateMultiplePhotos(tx: DbTransaction, photoUpdates: PhotoUpdate[]): Promise<void> {
  if (!photoUpdates.length) return;

  const photoIds = photoUpdates.map(update => update.id);
  const sampleUpdate = photoUpdates[0];

  const fieldsToUpdate = {
    locationName: sampleUpdate.locationName !== undefined,
    description: sampleUpdate.description !== undefined,
    dateTaken: sampleUpdate.dateTaken !== undefined,
    order: sampleUpdate.order !== undefined,
  };

  const currentDateISOString = new Date().toISOString();
  let batchUpdateSQL = sql`UPDATE "photos" SET "updated_at" = ${currentDateISOString}`;

  if (fieldsToUpdate.locationName) {
    batchUpdateSQL = sql`${batchUpdateSQL}, "location_name" = 
      CASE "id" 
        ${sql.join(
          photoUpdates.map(update => sql`WHEN ${update.id} THEN ${update.locationName}`),
          sql` `,
        )}
        ELSE "location_name" 
      END`;
  }

  if (fieldsToUpdate.description) {
    batchUpdateSQL = sql`${batchUpdateSQL}, "description" = 
      CASE "id" 
        ${sql.join(
          photoUpdates.map(update => sql`WHEN ${update.id} THEN ${update.description}`),
          sql` `,
        )}
        ELSE "description" 
      END`;
  }

  if (fieldsToUpdate.dateTaken) {
    batchUpdateSQL = sql`${batchUpdateSQL}, "date_taken" = 
      CASE "id" 
        ${sql.join(
          photoUpdates.map(update => sql`WHEN ${update.id} THEN ${update.dateTaken}`),
          sql` `,
        )}
        ELSE "date_taken" 
      END`;
  }

  if (fieldsToUpdate.order) {
    batchUpdateSQL = sql`${batchUpdateSQL}, "order" = 
      CASE "id" 
        ${sql.join(
          photoUpdates.map(update => sql`WHEN ${update.id} THEN ${update.order}`),
          sql` `,
        )}
        ELSE "order" 
      END`;
  }

  batchUpdateSQL = sql`${batchUpdateSQL} WHERE "id" IN (${sql.join(photoIds, sql`, `)})`;

  await tx.execute(batchUpdateSQL);
}

export { groupPhotoUpdates, updateSinglePhoto, updateMultiplePhotos };

export type { DbTransaction, PhotoUpdate };
