import { db } from '@/db';
import { tests } from '@/db/schema';

interface CreateTestRequest {
  title: string;
}

export async function createTest({ title }: CreateTestRequest) {
  const [test] = await db
    .insert(tests)
    .values({
      title,
    })
    .returning();

  return { test };
}
