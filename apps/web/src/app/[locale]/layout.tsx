import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";

import Providers from "@/app/providers";
import "@/styles/globals.css";
import { NextIntlClientProvider } from "next-intl";

import {
  getMessages,
  getTranslations,
  setRequestLocale,
} from "next-intl/server";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { CookieConsentWrapper } from "@/components/blocks/cookie-consent-wrapper";
import { PostHogIdentifier } from "@/components/PostHogIdentifier";
import { Toaster } from "@/components/ui/sooner";
import { routing } from "@/i18n/routing";
import type { Locale } from "@/i18n/types";
import { cn } from "@/lib/cn";
import {
  fontEpilogueVariable,
  fontFrauncesVariable,
  fontJakartaVariable,
} from "@/styles/fonts";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
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

  setRequestLocale(locale);

  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body
        className={cn(
          fontEpilogueVariable,
          fontFrauncesVariable,
          fontJakartaVariable,
          "font-jakarta antialiased"
        )}
      >
        <NextIntlClientProvider messages={messages}>
          <Providers>
            <PostHogIdentifier />
            <NuqsAdapter>{children}</NuqsAdapter>
          </Providers>
          <Toaster />
          <CookieConsentWrapper />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
