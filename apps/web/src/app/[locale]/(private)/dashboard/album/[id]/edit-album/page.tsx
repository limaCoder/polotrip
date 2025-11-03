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
      <main className="flex min-h-screen flex-col bg-background pt-16 lg:pt-0">
        <section className="flex-grow bg-secondary/5 py-8">
          <div className="container mx-auto px-4 lg:px-9">
            <div className="mb-6">
              <BackButton aria-label={t("back_button_aria")} />
            </div>

            <div className="mb-8">
              <h1 className="mb-2 font-title_two">{t("page_title")}</h1>
              <p className="font-body_two text-text/75">
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
