import { db } from '@/db';
import { albums, payments } from '@/db/schema';
import { eq } from 'drizzle-orm';
import stripe from '../lib/stripe';

interface CreateCheckoutSessionRequest {
  userId: string;
  albumId: string;
  successUrl: string;
  cancelUrl: string;
  paymentMethod: 'credit_card' | 'pix';
  isAdditionalPhotos?: boolean;
  additionalPhotosCount?: number;
}

async function createCheckoutSession({
  userId,
  albumId,
  successUrl,
  cancelUrl,
  paymentMethod,
  isAdditionalPhotos = false,
  additionalPhotosCount = 0,
}: CreateCheckoutSessionRequest) {
  const album = await db
    .select()
    .from(albums)
    .where(eq(albums.id, albumId))
    .then(rows => rows[0]);

  if (!album) {
    throw new Error('Album not found');
  }

  if (album.userId !== userId) {
    throw new Error('Album does not belong to the user');
  }

  let amount = 2999; // R$29,99 to new album
  let description = `Photos album: ${album.title}`;

  if (isAdditionalPhotos && additionalPhotosCount > 0) {
    // R$9,99 for each 100 additional photos
    amount = 999 * Math.ceil(additionalPhotosCount / 100);
    description = `${additionalPhotosCount} additional photos to the album: ${album.title}`;
  }

  if (paymentMethod === 'credit_card') {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'brl',
            product_data: {
              name: description,
            },
            unit_amount: amount,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        albumId,
        userId,
        isAdditionalPhotos: isAdditionalPhotos ? 'true' : 'false',
        additionalPhotosCount: additionalPhotosCount.toString(),
      },
    });

    const [payment] = await db
      .insert(payments)
      .values({
        userId,
        albumId,
        amount,
        currency: 'BRL',
        status: 'pending',
        paymentMethod: 'credit_card',
        paymentGateway: 'stripe',
        gatewayPaymentId: session.id,
        gatewayCheckoutUrl: session.url!,
        isAdditionalPhotos,
        additionalPhotosCount: isAdditionalPhotos ? additionalPhotosCount : 0,
      })
      .returning();

    return {
      payment,
      checkoutUrl: session.url,
    };
  } else {
    throw new Error('Método de pagamento PIX não implementado ainda');
  }
}

export { createCheckoutSession };
