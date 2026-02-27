import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { ChatInterface } from "./(components)/chat-interface";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Chat.metadata" });

  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function ChatPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Chat" });

  return (
    <div className="relative z-10 mx-auto flex w-full grow flex-col gap-8">
      <div className="space-y-3">
        <h1 className="font-black font-title_three text-4xl text-text tracking-tight drop-shadow-sm md:text-5xl">
          {t("title")}
        </h1>
        <p className="max-w-2xl font-medium text-lg text-text">
          {t("subtitle")}
        </p>
      </div>

      <div className="relative grow">
        <ChatInterface />
      </div>
    </div>
  );
}
