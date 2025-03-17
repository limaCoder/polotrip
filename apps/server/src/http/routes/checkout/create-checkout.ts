import { createCheckoutSession } from '@/app/functions/create-checkout-session';
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import { z } from 'zod';
import { authenticate } from '../../middlewares/authenticate';

const bodySchema = z.object({
  userId: z.string(),
  albumId: z.string(),
  successUrl: z.string().url(),
  cancelUrl: z.string().url(),
  paymentMethod: z.enum(['credit_card', 'pix']),
  isAdditionalPhotos: z.boolean().optional().default(false),
  additionalPhotosCount: z.number().int().min(1).optional(),
});

type CreateCheckoutBody = z.infer<typeof bodySchema>;

export const createCheckoutRoute: FastifyPluginAsyncZod = async app => {
  app.post<{
    Body: CreateCheckoutBody;
  }>(
    '/checkout',
    {
      onRequest: [authenticate],
      schema: {
        body: bodySchema,
        response: {
          200: z.object({
            checkoutUrl: z.string().url().nullable(),
            payment: z.object({
              id: z.string(),
              userId: z.string(),
              albumId: z.string().nullable(),
              amount: z.number(),
              currency: z.string(),
              status: z.string(),
              paymentMethod: z.string(),
              paymentGateway: z.string(),
              gatewayPaymentId: z.string(),
              gatewayCheckoutUrl: z.string().url().nullable(),
              isAdditionalPhotos: z.boolean(),
              additionalPhotosCount: z.number(),
              createdAt: z.date(),
              updatedAt: z.date(),
            }),
          }),
          400: z.object({
            message: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      const {
        userId,
        albumId,
        successUrl,
        cancelUrl,
        paymentMethod,
        isAdditionalPhotos,
        additionalPhotosCount,
      } = request.body;

      try {
        const { payment, checkoutUrl } = await createCheckoutSession({
          userId,
          albumId,
          successUrl,
          cancelUrl,
          paymentMethod,
          isAdditionalPhotos,
          additionalPhotosCount,
        });

        return { payment, checkoutUrl };
      } catch (error) {
        console.error('Error when creating checkout session:', error);

        return reply.status(400).send({
          message: error instanceof Error ? error.message : 'Error when processing payment',
        });
      }
    },
  );
};
