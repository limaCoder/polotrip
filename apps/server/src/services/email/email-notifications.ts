import VideoReadyEmail from "@polotrip/transactional/video-ready";
import WelcomeEmail from "@polotrip/transactional/welcome";
import { render } from "@react-email/render";
import React from "react";
import { InternalServerError } from "@/http/errors";
import { emailService } from "./resend-service";

export async function sendWelcomeEmail(
  name: string,
  email: string
): Promise<void> {
  try {
    const emailContent = await render(
      React.createElement(WelcomeEmail, { name })
    );

    await emailService.send({
      from: "Polotrip <contact@polotrip.com>",
      to: [email],
      subject: "Bem-vindo ao Polotrip!",
      html: emailContent,
    });
  } catch (error) {
    throw new InternalServerError(
      "Error when sending welcome email",
      "INTERNAL_ERROR",
      {
        originalError: error,
      }
    );
  }
}

export async function sendVideoReadyEmail(
  name: string,
  email: string,
  albumTitle: string,
  albumLink: string
): Promise<void> {
  try {
    const emailContent = await render(
      React.createElement(VideoReadyEmail, {
        name,
        albumTitle,
        albumUrl: albumLink,
      })
    );

    await emailService.send({
      from: "Polotrip <contact@polotrip.com>",
      to: [email],
      subject: `Your video for "${albumTitle}" is ready!`,
      html: emailContent,
    });
  } catch (error) {
    throw new InternalServerError(
      "Error when sending video ready email",
      "INTERNAL_ERROR",
      {
        originalError: error,
      }
    );
  }
}
