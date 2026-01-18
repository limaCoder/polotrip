import { MessageSquare } from "lucide-react";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Link } from "@/i18n/routing";
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
  const tDashboard = await getTranslations({ locale, namespace: "Dashboard" });

  return (
    <>
      <Header />
      <main className="flex min-h-screen flex-col bg-background">
        <section className="grow bg-secondary/5 pt-24 pb-8 lg:pt-12">
          <div className="container mx-auto h-full px-4 lg:px-9">
            <div className="flex h-full flex-col gap-9">
              <div className="flex items-center gap-4 border-b pb-2">
                <Link
                  className="flex items-center gap-2 rounded-md px-4 py-2 transition-colors hover:bg-muted"
                  href="/dashboard"
                >
                  {tDashboard("my_albums")}
                </Link>
                <Link
                  className="flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-primary-foreground transition-colors hover:bg-primary/90"
                  href="/dashboard/chat"
                >
                  <MessageSquare className="h-4 w-4" />
                  {tDashboard("chat")}
                </Link>
              </div>

              <div>
                <h1 className="font-title_two">{t("title")}</h1>
                <p className="font-title_three text-muted-foreground">
                  {t("subtitle")}
                </p>
              </div>
              <ChatInterface />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
