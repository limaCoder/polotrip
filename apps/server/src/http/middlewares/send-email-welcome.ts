import { sessions, users } from "@polotrip/db/schema";
import { fromNodeHeaders } from "better-auth/node";
import { eq } from "drizzle-orm";
import type { FastifyRequest } from "fastify";
import { UnauthorizedError } from "@/http/errors";
import { sendWelcomeEmail } from "@/services/email/email-notifications";

async function sendEmailWelcome(request: FastifyRequest) {
  try {
    const cookies = request.cookies;

    const sessionCookie = cookies["polotrip.state"]?.trim().split(".")[0];

    if (sessionCookie) {
      const [session] = await request.server.db
        .select()
        .from(sessions)
        .where(eq(sessions.token, sessionCookie))
        .limit(1);

      if (session) {
        const userId = session.userId;

        const [user] = await request.server.db
          .select()
          .from(users)
          .where(eq(users.id, userId))
          .limit(1);

        if (user && !user.welcomeEmailSent) {
          const authUser = await request.server.auth.api.getSession({
            headers: fromNodeHeaders(request.headers),
          });

          if (authUser) {
            await sendWelcomeEmail(
              authUser?.user?.name || "User",
              authUser?.user?.email
            );

            await request.server.db
              .update(users)
              .set({ welcomeEmailSent: true })
              .where(eq(users.id, userId));
          }
        }
      }
    }
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";

    request.log.error(
      {
        error:
          error instanceof Error
            ? {
                message: error.message,
                stack: error.stack,
              }
            : error,
        path: request.url,
      },
      "Error in send email welcome"
    );

    throw new UnauthorizedError(
      "Invalid or expired session",
      "INVALID_SESSION",
      {
        originalError: errorMessage,
      }
    );
  }
}

export { sendEmailWelcome };
