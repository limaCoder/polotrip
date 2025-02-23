import { createTest } from '@/app/functions/create-test';
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import { z } from 'zod';

export const createTestRoute: FastifyPluginAsyncZod = async app => {
  app.post(
    '/tests',
    {
      schema: {
        body: z.object({
          title: z.string(),
          desiredWeeklyFrequency: z.number().int().min(1).max(7),
        }),
      },
    },
    async request => {
      const { title } = request.body;

      const { test } = await createTest({
        title,
      });

      return { goalId: test.id };
    },
  );
};
