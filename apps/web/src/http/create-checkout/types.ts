import type { NewPayment } from '@polotrip/db/models';
import type { Stripe } from 'stripe';

type CreateCheckoutRequest = {
  body: {
    albumId: string;
    successUrl: string;
    cancelUrl: string;
    paymentMethod: 'credit_card' | 'pix';
    isAdditionalPhotos: boolean;
    additionalPhotosCount?: number | undefined;
  };
};

type CreateCheckoutResponse = {
  checkoutSession: Stripe.Response<Stripe.Checkout.Session>;
  payment: NewPayment;
};

export type { CreateCheckoutRequest, CreateCheckoutResponse };
