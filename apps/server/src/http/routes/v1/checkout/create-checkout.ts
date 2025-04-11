import { z } from 'zod';
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';

import DOMPurify from 'isomorphic-dompurify';

import { createCheckoutSession } from '@/app/functions/create-checkout-session';
import { authenticate } from '@/http/middlewares/authenticate';
import { fromNodeHeaders } from 'better-auth/node';
import { UnauthorizedError } from '@/http/errors';

const bodySchema = z.object({
  albumId: z.string(),
  successUrl: z.string().url(),
  cancelUrl: z.string().url(),
  paymentMethod: z.enum(['credit_card', 'pix']),
  isAdditionalPhotos: z.boolean().optional().default(false),
  additionalPhotosCount: z.number().int().min(1).optional(),
});

type CreateCheckoutBody = z.infer<typeof bodySchema>;

const createCheckoutRoute: FastifyPluginAsyncZod = async app => {
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
            checkoutSession: z.object({
              id: z.string(),
              url: z.string().url().nullable(),
            }),
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
        albumId,
        successUrl,
        cancelUrl,
        paymentMethod,
        isAdditionalPhotos,
        additionalPhotosCount,
      } = request.body;

      const session = await request.server.auth.api.getSession({
        headers: fromNodeHeaders(request.headers),
      });

      if (!session) {
        throw new UnauthorizedError();
      }

      const userId = session.user.id;

      const sanitizedInput = {
        albumId: DOMPurify.sanitize(albumId),
        successUrl: DOMPurify.sanitize(successUrl),
        cancelUrl: DOMPurify.sanitize(cancelUrl),
      };

      try {
        const { payment, checkoutSession } = await createCheckoutSession({
          userId,
          albumId: sanitizedInput.albumId,
          successUrl: sanitizedInput.successUrl,
          cancelUrl: sanitizedInput.cancelUrl,
          paymentMethod: paymentMethod,
          isAdditionalPhotos: isAdditionalPhotos ?? false,
          additionalPhotosCount: additionalPhotosCount ?? 0,
        });

        return { payment, checkoutSession };
      } catch (error) {
        app.log.error('Error when creating checkout session:', error);

        reply.status(500).send({ error: 'Failed to process the request.' });
      }
    },
  );
};

export default createCheckoutRoute;
