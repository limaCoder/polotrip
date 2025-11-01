'use client';

import { useActionState, useEffect, useRef, useState } from 'react';
import { useParams } from 'next/navigation';
import { Stripe } from '@stripe/stripe-js';
import { createAlbumWithCheckout } from '@/actions/createAlbumWithCheckout';
import { AlbumPlan } from '@/constants/pricingEnum';
import getStripe from '@/lib/stripe/get-stripejs';
import { getAlbumPrice } from '@/utils/getAlbumPrice';
import { usePostHog } from '@/hooks/usePostHog';

export function useAlbumForm() {
  const { locale } = useParams();
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<AlbumPlan>('standard');
  const [hasInteracted, setHasInteracted] = useState(false);
  const stripeClientRef = useRef<Stripe | null>(null);
  const { capture } = usePostHog();

  const createAlbumWithCheckoutAction = createAlbumWithCheckout.bind(null, {
    locale: locale as string,
    stripePromise: stripeClientRef?.current,
    plan: selectedPlan,
  });

  const [state, formAction, isPending] = useActionState(createAlbumWithCheckoutAction, null);

  const formState = {
    hasError: state?.status === 'error',
    hasInvalidData: state?.status === 'invalidData',
    hasSuccess: state?.status === 'success',
    errorMessage: state?.error?.message,
    sessionId: state?.sessionId,
    titleError: state?.error?.errors?.title,
    dateError: state?.error?.errors?.date,
    descriptionError: state?.error?.errors?.description,
    coverImageError: state?.error?.errors?.coverImage,
  };

  const albumPrice = getAlbumPrice(selectedPlan, locale as string);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setSelectedImage(file);

    if (file) {
      capture('album_cover_uploaded', {
        file_size_mb: (file.size / 1024 / 1024).toFixed(2),
        file_type: file.type,
      });
    }

    if (!hasInteracted) {
      setHasInteracted(true);
      capture('album_form_started', {
        plan: selectedPlan,
      });
    }
  };

  const handlePlanChange = (value: string) => {
    setSelectedPlan(value as AlbumPlan);

    capture('album_plan_selected', {
      plan: value,
      price: getAlbumPrice(value as AlbumPlan, locale as string),
    });

    if (!hasInteracted) {
      setHasInteracted(true);
      capture('album_form_started', {
        plan: value,
      });
    }
  };

  useEffect(() => {
    async function loadStripeClient() {
      const stripe = await getStripe();

      if (!stripe) throw new Error('Stripe failed to initialize.');

      stripeClientRef.current = stripe;
    }

    loadStripeClient();
  }, []);

  useEffect(() => {
    if (formState?.hasSuccess && formState?.sessionId) {
      capture('album_payment_initiated', {
        plan: selectedPlan,
        price: albumPrice,
        has_cover_image: selectedImage !== null,
      });

      stripeClientRef?.current?.redirectToCheckout({ sessionId: formState?.sessionId });
    }
  }, [
    formState?.hasSuccess,
    formState?.sessionId,
    capture,
    selectedPlan,
    albumPrice,
    selectedImage,
  ]);

  useEffect(() => {
    if (formState?.hasError) {
      capture('album_creation_failed', {
        error_type: formState.hasInvalidData ? 'validation' : 'server',
        error_message: formState.errorMessage,
        plan: selectedPlan,
        has_cover_image: selectedImage !== null,
      });

      setSelectedImage(null);
      setSelectedPlan('standard');
    }
  }, [
    formState?.hasError,
    formState?.hasInvalidData,
    formState?.errorMessage,
    selectedPlan,
    selectedImage,
    capture,
  ]);

  useEffect(() => {
    return () => {
      setSelectedImage(null);
    };
  }, []);

  return {
    formState,
    albumPrice,
    handleImageChange,
    handlePlanChange,
    formAction,
    isPending,
    selectedImage,
    selectedPlan,
    locale,
  };
}
