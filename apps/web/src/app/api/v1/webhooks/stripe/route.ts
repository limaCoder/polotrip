import { db } from "@polotrip/db";
import { albums, payments } from "@polotrip/db/schema";
import { QueryClient } from "@tanstack/react-query";
import { eq } from "drizzle-orm";
import { revalidatePath, revalidateTag } from "next/cache";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { albumKeys } from "@/hooks/network/keys/albumKeys";
import { env } from "@/lib/env";
import PostHogClient from "@/lib/posthog";
import stripe from "@/lib/stripe";

const secret = env.STRIPE_WEBHOOK_SECRET;

export async function POST(req: Request) {
  let posthog: ReturnType<typeof PostHogClient> | null = null;

  try {
    const body = await req.text();
    const signature = (await headers()).get("stripe-signature");

    if (!(secret && signature)) {
      throw new Error("Missing secret or signature");
    }

    const event = stripe.webhooks.constructEvent(body, signature, secret);

    const queryClient = new QueryClient();
    posthog = PostHogClient();

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;
        const userId = session.metadata?.userId;
        const albumId = session.metadata?.albumId;

        if (session.payment_status === "paid" && albumId) {
          const [updatedPayment] = await db
            .update(payments)
            .set({ status: "completed" })
            .where(eq(payments.gatewayPaymentId, session.id))
            .returning();

          await db
            .update(albums)
            .set({ isPaid: true, currentStepAfterPayment: "upload" })
            .where(eq(albums.id, albumId))
            .returning();

          queryClient.invalidateQueries({
            queryKey: [albumKeys.all],
          });

          revalidateTag("albums-list");
          revalidatePath("/[locale]/dashboard", "page");

          if (userId && updatedPayment) {
            posthog.capture({
              distinctId: userId,
              event: "payment_completed",
              properties: {
                album_id: albumId,
                payment_id: updatedPayment.id,
                payment_method: updatedPayment.paymentMethod,
                amount: updatedPayment.amount / 100, // Convert from cents
                currency: updatedPayment.currency,
                gateway: "stripe",
                is_additional_photos: updatedPayment.isAdditionalPhotos,
                additional_photos_count: updatedPayment.additionalPhotosCount,
                payment_type: "credit_card",
                session_id: session.id,
              },
            });
          }

          /* if (session.customer_details?.email) {
              await sendEmail({
                to: session.customer_details.email,
                subject: 'Seu álbum foi criado com sucesso!',
                text: `Seu álbum foi criado e está pronto para uso. Acesse sua conta para adicionar fotos.`,
              });
            } */
        }

        if (session.payment_status === "unpaid" && session.payment_intent) {
          const paymentIntent = await stripe.paymentIntents.retrieve(
            session.payment_intent.toString()
          );

          const hostedVoucherUrl =
            paymentIntent.next_action?.boleto_display_details
              ?.hosted_voucher_url;

          if (hostedVoucherUrl) {
            const userEmail = session.customer_details?.email;

            if (userId && albumId) {
              posthog.capture({
                distinctId: userId,
                event: "boleto_generated",
                properties: {
                  album_id: albumId,
                  session_id: session.id,
                  payment_intent_id: paymentIntent.id,
                  amount: paymentIntent.amount
                    ? paymentIntent.amount / 100
                    : null,
                  currency: paymentIntent.currency,
                  has_voucher_url: !!hostedVoucherUrl,
                },
              });
            }

            if (userEmail) {
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

      case "checkout.session.expired": {
        const session = event.data.object;
        const userId = session.metadata?.userId;
        const albumId = session.metadata?.albumId;

        if (session.payment_status === "unpaid") {
          const [updatedPayment] = await db
            .update(payments)
            .set({ status: "expired" })
            .where(eq(payments.gatewayPaymentId, session.id))
            .returning();

          if (userId && albumId && updatedPayment) {
            posthog.capture({
              distinctId: userId,
              event: "checkout_expired",
              properties: {
                album_id: albumId,
                payment_id: updatedPayment.id,
                payment_method: updatedPayment.paymentMethod,
                amount: updatedPayment.amount / 100,
                currency: updatedPayment.currency,
                session_id: session.id,
                expiration_reason: "session_timeout",
              },
            });
          }

          if (albumId) {
            await db.delete(albums).where(eq(albums.id, albumId));
          }
        }

        break;
      }

      case "checkout.session.async_payment_succeeded": {
        const session = event.data.object;
        const userId = session.metadata?.userId;
        const albumId = session.metadata?.albumId;

        if (session.payment_status === "paid" && albumId) {
          const [updatedPayment] = await db
            .update(payments)
            .set({ status: "completed" })
            .where(eq(payments.gatewayPaymentId, session.id))
            .returning();

          await db
            .update(albums)
            .set({ isPaid: true, currentStepAfterPayment: "upload" })
            .where(eq(albums.id, albumId))
            .returning();

          revalidateTag("albums-list");
          revalidatePath("/[locale]/dashboard", "page");

          if (userId && updatedPayment) {
            posthog.capture({
              distinctId: userId,
              event: "payment_completed",
              properties: {
                album_id: albumId,
                payment_id: updatedPayment.id,
                payment_method: updatedPayment.paymentMethod,
                amount: updatedPayment.amount / 100,
                currency: updatedPayment.currency,
                gateway: "stripe",
                is_additional_photos: updatedPayment.isAdditionalPhotos,
                additional_photos_count: updatedPayment.additionalPhotosCount,
                payment_type: "boleto",
                session_id: session.id,
              },
            });
          }

          if (session.customer_details?.email) {
            /* await sendEmail({
                to: session.customer_details.email,
                subject: 'Pagamento confirmado',
                text: `Seu pagamento por boleto foi confirmado. Seu álbum está pronto para uso!`,
              }); */
          }
        }

        break;
      }

      case "checkout.session.async_payment_failed": {
        const session = event.data.object;
        const userId = session.metadata?.userId;
        const albumId = session.metadata?.albumId;

        if (session.payment_status === "unpaid") {
          const [updatedPayment] = await db
            .update(payments)
            .set({ status: "failed" })
            .where(eq(payments.gatewayPaymentId, session.id))
            .returning();

          if (userId && albumId && updatedPayment) {
            posthog.capture({
              distinctId: userId,
              event: "payment_failed",
              properties: {
                album_id: albumId,
                payment_id: updatedPayment.id,
                payment_method: updatedPayment.paymentMethod,
                amount: updatedPayment.amount / 100,
                currency: updatedPayment.currency,
                payment_type: "boleto",
                failure_reason: "boleto_expired",
                session_id: session.id,
              },
            });
          }

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

      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object;
        const paymentIntentId = paymentIntent.id;
        const albumId = paymentIntent.metadata?.albumId;
        const userId = paymentIntent.metadata?.userId;

        const [updatedPayment] = await db
          .update(payments)
          .set({ status: "failed" })
          .where(eq(payments.gatewayPaymentId, paymentIntentId))
          .returning();

        if (userId && updatedPayment) {
          posthog.capture({
            distinctId: userId,
            event: "payment_failed",
            properties: {
              album_id: albumId || null,
              payment_id: updatedPayment.id,
              payment_method: updatedPayment.paymentMethod,
              amount: updatedPayment.amount / 100,
              currency: updatedPayment.currency,
              payment_type: "credit_card",
              failure_reason:
                paymentIntent.last_payment_error?.message || "unknown",
              failure_code: paymentIntent.last_payment_error?.code || null,
              payment_intent_id: paymentIntentId,
            },
          });
        }

        if (albumId) {
          await db.delete(albums).where(eq(albums.id, albumId));
        }

        break;
      }

      case "payment_intent.canceled": {
        const paymentIntent = event.data.object;
        const paymentIntentId = paymentIntent.id;
        const albumId = paymentIntent.metadata?.albumId;
        const userId = paymentIntent.metadata?.userId;

        const [updatedPayment] = await db
          .update(payments)
          .set({ status: "canceled" })
          .where(eq(payments.gatewayPaymentId, paymentIntentId))
          .returning();

        if (userId && updatedPayment) {
          posthog.capture({
            distinctId: userId,
            event: "payment_canceled",
            properties: {
              album_id: albumId || null,
              payment_id: updatedPayment.id,
              payment_method: updatedPayment.paymentMethod,
              amount: updatedPayment.amount / 100,
              currency: updatedPayment.currency,
              payment_type: "credit_card",
              cancellation_reason: "user_canceled",
              payment_intent_id: paymentIntentId,
            },
          });
        }

        if (albumId) {
          await db.delete(albums).where(eq(albums.id, albumId));
        }

        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object;

        const customerId = subscription.customer?.toString();
        const userId = subscription.metadata?.userId;

        if (userId) {
          posthog.capture({
            distinctId: userId,
            event: "subscription_canceled",
            properties: {
              subscription_id: subscription.id,
              customer_id: customerId || null,
              canceled_at: subscription.canceled_at
                ? new Date(subscription.canceled_at * 1000).toISOString()
                : null,
              cancellation_reason: "user_requested",
            },
          });
        }

        break;
      }

      default:
        break;
    }

    return NextResponse.json({ result: event, ok: true });
  } catch (error) {
    return NextResponse.json(
      {
        message: `Webhook error: ${error}`,
        ok: false,
      },
      { status: 500 }
    );
  } finally {
    if (posthog) {
      await posthog.shutdown();
    }
  }
}
