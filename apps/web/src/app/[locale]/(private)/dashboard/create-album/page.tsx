import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { BackButton } from "../(components)/back-button";
import { AlbumForm } from "./components/album-form";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({
    locale,
    namespace: "CreateAlbum.metadata",
  });

  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function CreateAlbumPage() {
  const t = await getTranslations("CreateAlbum");

  return (
    <>
      <Header />
      <main className="flex min-h-screen flex-col bg-background pt-16 lg:pt-0">
        <section className="flex-grow bg-secondary/5 py-8">
          <div className="container mx-auto px-4 lg:px-9">
            <div className="mb-6">
              <BackButton aria-label={t("back_button_aria")} />
            </div>

            <div className="mx-auto max-w-[704px]">
              <AlbumForm />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
