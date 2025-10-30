'use server';

import { Stripe } from '@stripe/stripe-js';

import { createAlbum } from '@/http/create-album';
import { getAlbumFormSchema } from './schema/album-schema';
import { uploadImage } from './utils/upload-image';
import { env } from '@/lib/env';
import { createCheckout } from '@/http/create-checkout';
import { getCurrency } from '@/utils/getCurrency';
import { AlbumPlan } from '@/constants/pricingEnum';
import { getTranslations } from 'next-intl/server';

export async function createAlbumWithCheckout(
  extra: { locale: string; stripePromise: Stripe | null; plan: AlbumPlan },
  prevState: unknown,
  formData: FormData,
) {
  try {
    const t = await getTranslations({
      locale: extra.locale,
      namespace: 'ServerActions.CreateAlbumWithCheckout',
    });
    const albumFormSchema = await getAlbumFormSchema(extra.locale);

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
          message: t('invalid_data'),
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
        plan: extra.plan,
      },
    });

    const origin = env.NEXT_PUBLIC_WEB_URL;
    const successUrl = `${origin}/${extra?.locale}/dashboard/album/${album?.id}/upload`;
    const cancelUrl = `${origin}/${extra?.locale}/dashboard/create-album`;

    const currency = getCurrency(extra?.locale as string);

    const { checkoutSession } = await createCheckout({
      body: {
        albumId: album?.id as string,
        successUrl,
        cancelUrl,
        paymentMethod: 'credit_card',
        currency,
        isAdditionalPhotos: false,
      },
    });

    if (checkoutSession?.id) {
      return {
        status: 'success',
        sessionId: checkoutSession.id,
        message: t('redirecting_to_checkout'),
      };
    } else {
      return {
        status: 'error',
        error: {
          message: t('checkout_session_error'),
        },
      };
    }
  } catch (error) {
    console.error('Error creating album and checkout:', error);

    const t = await getTranslations({
      locale: extra.locale,
      namespace: 'ServerActions.CreateAlbumWithCheckout',
    });
    return {
      status: 'error',
      error: {
        message: t('order_processing_error'),
      },
    };
  }
}
