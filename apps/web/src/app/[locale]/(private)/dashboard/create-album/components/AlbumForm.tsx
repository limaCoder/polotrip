'use client';

import { useActionState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import { Upload, CreditCard, Loader, AlertCircle } from 'lucide-react';

import { Button } from '@/components/Button';
import { createAlbumWithCheckout } from '@/actions/createAlbumWithCheckout';
import getStripe from '@/lib/stripe/get-stripejs';
import { Stripe } from '@stripe/stripe-js';

export function AlbumForm() {
  const { locale } = useParams();

  const stripeClientRef = useRef<Stripe | null>(null);

  const createAlbumWithCheckoutAction = createAlbumWithCheckout.bind(null, {
    locale: locale as string,
    stripePromise: stripeClientRef?.current,
  });

  const [state, formAction, isPending] = useActionState(createAlbumWithCheckoutAction, null);

  const hasError = state?.status === 'error';
  const hasInvalidData = state?.status === 'invalidData';

  const hasSuccess = state?.status === 'success';
  const sessionId = state?.sessionId;

  useEffect(() => {
    async function loadStripeClient() {
      const stripe = await getStripe();

      if (!stripe) throw new Error('Stripe failed to initialize.');

      stripeClientRef.current = stripe;
    }

    loadStripeClient();
  }, []);

  useEffect(() => {
    if (hasSuccess && sessionId) {
      stripeClientRef?.current?.redirectToCheckout({ sessionId });
    }
  }, [hasSuccess, sessionId]);

  return (
    <form action={formAction} className="bg-background p-8 rounded-lg shadow-md">
      <h1 className="font-title_three mb-6 font-bold">Criar Novo Álbum</h1>

      {hasError && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4 flex items-start gap-2">
          <AlertCircle size={18} className="mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-body_two font-bold">Erro ao criar álbum</p>
            <p className="text-sm">{state?.error?.message}</p>
            {state?.error?.errors?.title && (
              <p className="text-sm mt-1">Título: {state?.error?.errors?.title?.join(', ')}</p>
            )}
            {state?.error?.errors?.description && (
              <p className="text-sm">Descrição: {state?.error?.errors?.description?.join(', ')}</p>
            )}
            {state?.error?.errors?.coverImage && (
              <p className="text-sm">Imagem: {state?.error?.errors?.coverImage?.join(', ')}</p>
            )}
          </div>
        </div>
      )}

      <div className="space-y-4 mb-6">
        <div className="flex flex-col gap-1">
          <label htmlFor="title" className="font-body_two">
            Título do Álbum
          </label>
          <input
            id="title"
            name="title"
            type="text"
            placeholder="Ex: Viagem para Paris"
            className="border border-text/25 rounded p-3 font-body_two text-sm"
          />
          {hasInvalidData && state?.error?.errors?.title && (
            <p className="text-sm text-red-500">Título é obrigatório</p>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="description" className="font-body_two">
            Descrição
          </label>
          <textarea
            id="description"
            name="description"
            placeholder="Conte um pouco sobre esta viagem..."
            className="border border-text/25 rounded p-3 h-24 font-body_two text-sm"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="cover" className="font-body_two">
            Capa do álbum
          </label>
          <div className="border border-dashed border-text/25 rounded p-3 h-[116px] flex flex-col items-center justify-center text-center relative">
            <input
              type="file"
              id="cover"
              name="cover"
              accept="image/png, image/jpeg, image/jpg"
              className="absolute inset-0 opacity-0 cursor-pointer z-10"
            />
            <Upload size={24} className="text-text/25 mb-2" />
            <p className="font-body_two text-sm">
              <span className="text-primary font-bold">Faça upload de uma foto</span>
              <br />
              ou arraste e solte
            </p>
            <span className="text-primary text-xs mt-1">PNG, JPG até 10MB</span>
          </div>
          {hasInvalidData && state?.error?.errors?.coverImage && (
            <p className="text-sm text-red-500">{state.error.errors.coverImage.join(', ')}</p>
          )}
        </div>
      </div>

      <hr className="border-text/25 my-6" />

      <div className="flex flex-col items-start bg-secondary/5 p-6 rounded-lg mb-6">
        <h2 className="font-body_one font-bold text-primary mb-6">Resumo do Pedido</h2>

        <div className="w-full flex justify-between">
          <div>
            <h3 className="font-body_two font-bold">Criação do álbum</h3>
            <p className="text-xs">Inclui até 100 fotos e todas as funcionalidades premium</p>
          </div>
          <span className="font-body_two text-primary">R$ 19,99</span>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <Button
          type="submit"
          disabled={isPending}
          className="bg-primary text-background p-3 flex items-center justify-center gap-3 rounded"
        >
          {isPending ? (
            <>
              <Loader size={20} className="animate-spin" color="#F7FCFD" />
              <span>Processando...</span>
            </>
          ) : (
            <>
              <CreditCard size={20} color="#F7FCFD" />
              <span>Pagar com cartão</span>
            </>
          )}
        </Button>

        {/* TO-DO: Implement payment with Pix */}
        {/* <Button className="bg-primary text-background p-3 flex items-center justify-center gap-3 rounded">
          <QrCode size={20} color="#F7FCFD" />
          <span>Pagar com Pix</span>
        </Button> */}
      </div>
    </form>
  );
}
