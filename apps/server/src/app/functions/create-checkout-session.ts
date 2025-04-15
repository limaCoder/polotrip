import { eq } from 'drizzle-orm';
import { db } from '@polotrip/db';
import { albums, payments } from '@polotrip/db/schema';
import stripe from '@/app/lib/stripe';

interface CreateCheckoutSessionRequest {
  userId: string;
  albumId: string;
  successUrl: string;
  cancelUrl: string;
  paymentMethod: 'credit_card' | 'pix';
  amount: number;
  currency: 'brl' | 'usd';
  isAdditionalPhotos?: boolean;
  additionalPhotosCount?: number;
}

async function createCheckoutSession({
  userId,
  albumId,
  successUrl,
  cancelUrl,
  paymentMethod,
  amount,
  currency,
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

  let description = `Photos album: ${album.title}`;

  if (isAdditionalPhotos && additionalPhotosCount > 0) {
    // R$9,99 or USD 9,99 for each 100 additional photos
    amount = 999 * Math.ceil(additionalPhotosCount / 100);
    description = `${additionalPhotosCount} additional photos to the album: ${album.title}`;
  }

  if (paymentMethod === 'credit_card') {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: currency,
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
        currency,
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
      checkoutSession: session,
    };
  } else {
    throw new Error('Método de pagamento PIX não implementado ainda');
  }
}

export { createCheckoutSession };
