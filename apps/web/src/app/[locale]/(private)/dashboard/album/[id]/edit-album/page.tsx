import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { BackButton } from "../../../(components)/back-button";
import { EditAlbumContent } from "./components/edit-album-content";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "EditAlbum" });

  return {
    title: t("metadata_title"),
    description: t("metadata_description"),
  };
}

export default async function EditAlbumPage() {
  const t = await getTranslations("EditAlbum");

  return (
    <>
      <Header />
      <main className="relative flex min-h-screen flex-col overflow-hidden bg-background pt-16 lg:pt-0">
        <div className="-top-[500px] -right-[500px] pointer-events-none absolute z-0 h-[1000px] w-[1000px] rounded-full bg-primary/10 blur-[120px]" />
        <div className="-bottom-[500px] -left-[500px] pointer-events-none absolute z-0 h-[1000px] w-[1000px] rounded-full bg-secondary-50/20 blur-[120px] dark:bg-secondary/10" />

        <section className="relative z-10 flex-grow py-10 lg:py-16">
          <div className="container mx-auto px-4 lg:px-9">
            <div className="mb-8">
              <BackButton aria-label={t("back_button_aria")} />
            </div>

            <div className="mb-10 max-w-2xl lg:mb-12">
              <h1 className="mb-4 font-heading text-4xl tracking-tight lg:text-5xl">
                {t("page_title")}
              </h1>
              <p className="font-body_one text-text/70 leading-relaxed">
                {t("page_description")}
              </p>
            </div>

            <EditAlbumContent />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
