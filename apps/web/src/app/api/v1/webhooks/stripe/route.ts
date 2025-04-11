import stripe from '@/lib/stripe';
import { env } from '@/lib/env';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { db } from '@polotrip/db';
import { albums, payments } from '@polotrip/db/schema';
import { eq } from 'drizzle-orm';

const secret = env.STRIPE_WEBHOOK_SECRET;

export async function POST(req: Request) {
  try {
    const body = await req.text();
    const signature = (await headers()).get('stripe-signature');

    if (!secret || !signature) {
      throw new Error('Missing secret or signature');
    }

    const event = stripe.webhooks.constructEvent(body, signature, secret);

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;

        if (session.payment_status === 'paid') {
          const albumId = session.metadata?.albumId;
          const userId = session.metadata?.userId;

          console.log(`Payment by card completed for album: ${albumId}, user: ${userId}`);

          if (albumId) {
            await db
              .update(payments)
              .set({ status: 'completed' })
              .where(eq(payments.gatewayPaymentId, session.id))
              .returning();

            await db
              .update(albums)
              .set({ isPaid: true, currentStepAfterPayment: 'upload' })
              .where(eq(albums.id, albumId))
              .returning();

            /* if (session.customer_details?.email) {
              await sendEmail({
                to: session.customer_details.email,
                subject: 'Seu álbum foi criado com sucesso!',
                text: `Seu álbum foi criado e está pronto para uso. Acesse sua conta para adicionar fotos.`,
              });
            } */
          }
        }

        if (session.payment_status === 'unpaid' && session.payment_intent) {
          const paymentIntent = await stripe.paymentIntents.retrieve(
            session.payment_intent.toString(),
          );

          const hostedVoucherUrl =
            paymentIntent.next_action?.boleto_display_details?.hosted_voucher_url;

          if (hostedVoucherUrl) {
            const userEmail = session.customer_details?.email;

            if (userEmail) {
              console.log(`Boleto generated for ${userEmail}: ${hostedVoucherUrl}`);

              /* await sendEmail({
                to: userEmail,
                subject: 'Seu boleto para pagamento do álbum',
                text: `Seu boleto foi gerado com sucesso. Acesse o link para efetuar o pagamento: ${hostedVoucherUrl}`,
              }); */
            }
          }
        }
        break;
      }

      case 'checkout.session.expired': {
        const session = event.data.object;

        if (session.payment_status === 'unpaid') {
          const albumId = session.metadata?.albumId;
          console.log(`Checkout expired for album: ${albumId}`);

          await db
            .update(payments)
            .set({ status: 'expired' })
            .where(eq(payments.gatewayPaymentId, session.id))
            .returning();

          if (albumId) {
            await db.delete(albums).where(eq(albums.id, albumId));
          }
        }
        break;
      }

      case 'checkout.session.async_payment_succeeded': {
        const session = event.data.object;

        if (session.payment_status === 'paid') {
          const albumId = session.metadata?.albumId;
          console.log(`Boleto payment confirmed for album: ${albumId}`);

          if (albumId) {
            await db
              .update(payments)
              .set({ status: 'completed' })
              .where(eq(payments.gatewayPaymentId, session.id))
              .returning();

            await db
              .update(albums)
              .set({ isPaid: true, currentStepAfterPayment: 'upload' })
              .where(eq(albums.id, albumId))
              .returning();

            if (session.customer_details?.email) {
              /* await sendEmail({
                to: session.customer_details.email,
                subject: 'Pagamento confirmado',
                text: `Seu pagamento por boleto foi confirmado. Seu álbum está pronto para uso!`,
              }); */
            }
          }
        }
        break;
      }

      case 'checkout.session.async_payment_failed': {
        const session = event.data.object;

        if (session.payment_status === 'unpaid') {
          const albumId = session.metadata?.albumId;
          console.log(`Boleto payment failed for album: ${albumId}`);

          await db
            .update(payments)
            .set({ status: 'failed' })
            .where(eq(payments.gatewayPaymentId, session.id))
            .returning();

          /* if (session.customer_details?.email) {
            await sendEmail({
              to: session.customer_details.email,
              subject: 'Seu boleto venceu',
              text: `Seu boleto venceu sem que o pagamento fosse realizado. Acesse sua conta para gerar um novo pagamento.`,
            });
          } */
        }
        break;
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object;
        const paymentIntentId = paymentIntent.id;
        const albumId = paymentIntent.metadata?.albumId;

        await db
          .update(payments)
          .set({ status: 'failed' })
          .where(eq(payments.gatewayPaymentId, paymentIntentId))
          .returning();

        if (albumId) {
          await db.delete(albums).where(eq(albums.id, albumId));
        }

        break;
      }

      case 'payment_intent.canceled': {
        const paymentIntent = event.data.object;
        const paymentIntentId = paymentIntent.id;
        const albumId = paymentIntent.metadata?.albumId;

        await db
          .update(payments)
          .set({ status: 'canceled' })
          .where(eq(payments.gatewayPaymentId, paymentIntentId))
          .returning();

        if (albumId) {
          await db.delete(albums).where(eq(albums.id, albumId));
        }

        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object;
        console.log(`Subscription canceled: ${subscription.id}`);

        break;
      }

      default:
        console.log(`Unhandled event: ${event.type}`);
    }

    return NextResponse.json({ result: event, ok: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        message: `Webhook error: ${error}`,
        ok: false,
      },
      { status: 500 },
    );
  }
}
