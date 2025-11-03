"use server";

import type { Stripe } from "@stripe/stripe-js";
import { getTranslations } from "next-intl/server";
import type { AlbumPlan } from "@/constants/pricingEnum";
import { createAlbum } from "@/http/create-album";
import { createCheckout } from "@/http/create-checkout";
import { env } from "@/lib/env";
import { getCurrency } from "@/utils/getCurrency";
import { getAlbumFormSchema } from "./schema/album-schema";
import { uploadImage } from "./utils/upload-image";

export async function createAlbumWithCheckout(
  extra: { locale: string; stripePromise: Stripe | null; plan: AlbumPlan },
  _prevState: unknown,
  formData: FormData
) {
  try {
    const t = await getTranslations({
      locale: extra.locale,
      namespace: "ServerActions.CreateAlbumWithCheckout",
    });
    const albumFormSchema = await getAlbumFormSchema(extra.locale);

    const title = formData.get("title") as string;
    const dateString = formData.get("date") as string;
    const description = formData.get("description") as string;
    const coverImageFile = formData.get("cover") as File;

    const dateWithDay = `${dateString}-15`;

    const validationResult = albumFormSchema.safeParse({
      title,
      date: dateWithDay,
      description,
      coverImage: coverImageFile?.size > 0 ? coverImageFile : null,
    });

    if (!validationResult.success) {
      return {
        status: "invalidData",
        error: {
          message: t("invalid_data"),
          errors: validationResult.error.flatten().fieldErrors,
        },
      };
    }

    // biome-ignore lint/suspicious/noEvolvingTypes: coverImageUrl can be null
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
        paymentMethod: "credit_card",
        currency,
        isAdditionalPhotos: false,
      },
    });

    if (checkoutSession?.id) {
      return {
        status: "success",
        sessionId: checkoutSession.id,
        message: t("redirecting_to_checkout"),
      };
    }
    return {
      status: "error",
      error: {
        message: t("checkout_session_error"),
      },
    };
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }

    const t = await getTranslations({
      locale: extra.locale,
      namespace: "ServerActions.CreateAlbumWithCheckout",
    });
    return {
      status: "error",
      error: {
        message: t("order_processing_error"),
      },
    };
  }
}
