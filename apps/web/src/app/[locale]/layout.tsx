import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";

import Providers from "@/app/providers";
import "@/styles/globals.css";
import { NextIntlClientProvider } from "next-intl";

import { getMessages, getTranslations } from "next-intl/server";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { CookieConsentWrapper } from "@/components/blocks/cookie-consent-wrapper";
import { PostHogIdentifier } from "@/components/PostHogIdentifier";
import { Toaster } from "@/components/ui/sooner";
import { routing } from "@/i18n/routing";
import type { Locale } from "@/i18n/types";
import { getCurrentUser } from "@/lib/auth/server";
import { cn } from "@/lib/cn";
import { fontEpilogueVariable } from "@/styles/fonts";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "RootLayout" });

  return {
    title: t("title"),
    description: t("description"),
    authors: {
      name: "Polotrip",
    },
    creator: "Polotrip",
    category: "photo-sharing",
    keywords: t("keywords"),
    icons: {
      icon: "/brand/favicon.ico",
    },
    openGraph: {
      type: "website",
      siteName: "Polotrip",
      description: t("description"),
      title: t("title"),
      url: "https://polotrip.com",
      images: [
        {
          url: "https://polotrip.com/opengraph-image",
          alt: t("og_alt"),
        },
      ],
    },
  };
}

export default async function RootLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as Locale)) {
    notFound();
  }

  const messages = await getMessages();
  const user = await getCurrentUser();

  return (
    <html lang={locale}>
      <NextIntlClientProvider messages={messages}>
        <body className={cn(fontEpilogueVariable, "font-epilogue antialiased")}>
          <Providers>
            <PostHogIdentifier user={user} />
            <NuqsAdapter>{children}</NuqsAdapter>
          </Providers>
          <Toaster />
          <CookieConsentWrapper />
        </body>
      </NextIntlClientProvider>
    </html>
  );
}
