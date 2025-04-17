'use server';

import { Stripe } from '@stripe/stripe-js';

import { createAlbum } from '@/http/create-album';
import { albumFormSchema } from './schema/album-schema';
import { uploadImage } from './utils/upload-image';
import { env } from '@/lib/env';
import { createCheckout } from '@/http/create-checkout';
import { getAlbumStripePrice } from '@/utils/getAlbumPrice';
import { getCurrency } from '@/utils/getCurrency';

export async function createAlbumWithCheckout(
  extra: { locale: string; stripePromise: Stripe | null },
  prevState: unknown,
  formData: FormData,
) {
  try {
    const title = formData.get('title') as string;
    const dateString = formData.get('date') as string;
    const description = formData.get('description') as string;
    const coverImageFile = formData.get('cover') as File;

    const dateWithDay = `${dateString}-15`;

    const validationResult = albumFormSchema.safeParse({
      title,
      date: dateWithDay,
      description,
      coverImage: coverImageFile?.size > 0 ? coverImageFile : null,
    });

    if (!validationResult.success) {
      return {
        status: 'invalidData',
        error: {
          message: 'Invalid data',
          errors: validationResult.error.flatten().fieldErrors,
        },
      };
    }

    let coverImageUrl = null;
    if (coverImageFile && coverImageFile.size > 0) {
      coverImageUrl = await uploadImage(coverImageFile);
    }

    const { album } = await createAlbum({
      body: {
        title,
        date: dateWithDay,
        description: description || null,
        coverImageUrl,
      },
    });

    const origin = env.NEXT_PUBLIC_WEB_URL;
    const successUrl = `${origin}/${extra?.locale}/dashboard/album/${album?.id}/upload`;
    const cancelUrl = `${origin}/${extra?.locale}/create-album`;

    const albumPrice = getAlbumStripePrice(extra?.locale as string);
    const currency = getCurrency(extra?.locale as string);

    const { checkoutSession } = await createCheckout({
      body: {
        albumId: album?.id as string,
        successUrl,
        cancelUrl,
        paymentMethod: 'credit_card',
        amount: albumPrice,
        currency,
        isAdditionalPhotos: false,
      },
    });

    if (checkoutSession?.id) {
      return {
        status: 'success',
        sessionId: checkoutSession.id,
        message: 'Redirecting to checkout',
      };
    } else {
      return {
        status: 'error',
        error: {
          message: 'Failed to generate checkout session',
        },
      };
    }
  } catch (error) {
    console.error('Error creating album and checkout:', error);

    return {
      status: 'error',
      error: {
        message: 'An error occurred while processing the order',
      },
    };
  }
}
