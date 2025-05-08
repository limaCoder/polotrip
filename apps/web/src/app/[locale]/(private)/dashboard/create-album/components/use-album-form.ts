import { useActionState, useEffect, useRef, useState } from 'react';
import { useParams } from 'next/navigation';
import { Stripe } from '@stripe/stripe-js';
import { createAlbumWithCheckout } from '@/actions/createAlbumWithCheckout';
import { AlbumPlan } from '@/constants/pricingEnum';
import getStripe from '@/lib/stripe/get-stripejs';
import { getAlbumPrice } from '@/utils/getAlbumPrice';

export function useAlbumForm() {
  const { locale } = useParams();
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<AlbumPlan>('standard');
  const stripeClientRef = useRef<Stripe | null>(null);

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
  };

  const handlePlanChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedPlan(e.target.value as AlbumPlan);
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
      stripeClientRef?.current?.redirectToCheckout({ sessionId: formState?.sessionId });
    }
  }, [formState?.hasSuccess, formState?.sessionId]);

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
