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
      <main className="relative flex min-h-screen flex-col overflow-hidden bg-background pt-16 lg:pt-0">
        {/* Ambient background decoration */}
        <div className="-top-24 pointer-events-none absolute right-0 h-[800px] w-[800px] translate-x-1/3 rounded-full bg-primary/5 blur-[120px]" />
        <div className="-left-24 -translate-x-1/4 pointer-events-none absolute bottom-0 h-[600px] w-[600px] translate-y-1/3 rounded-full bg-secondary/10 blur-[100px]" />

        <section className="relative z-10 grow py-12 lg:py-20">
          <div className="container mx-auto px-4 lg:px-9">
            <div className="mb-8 lg:mb-12">
              <BackButton aria-label={t("back_button_aria")} />
            </div>

            <div className="mx-auto max-w-[760px]">
              <AlbumForm />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
