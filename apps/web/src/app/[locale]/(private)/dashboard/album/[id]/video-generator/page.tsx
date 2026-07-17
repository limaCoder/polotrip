import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { VideoGenerator } from "@/components/VideoGenerator";
import { getAlbum } from "@/http/get-album";
import { BackButton } from "../../../(components)/back-button";

type Props = {
  params: Promise<{ id: string; locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id, locale } = await params;
  const t = await getTranslations({ locale, namespace: "VideoGenerator" });

  try {
    const { album } = await getAlbum({ albumId: id });
    return {
      title: t("metadata_title", { title: album.title }),
      description: t("metadata_description", { title: album.title }),
    };
  } catch {
    return {
      title: t("metadata_title", { title: "" }),
      description: t("metadata_description", { title: "" }),
    };
  }
}

export default async function VideoGeneratorPage({ params }: Props) {
  const { id } = await params;
  const t = await getTranslations("VideoGenerator");

  return (
    <>
      <Header />
      <main className="relative flex min-h-screen flex-col overflow-hidden bg-background pt-16 lg:pt-0">
        <div className="-top-[500px] -right-[500px] pointer-events-none absolute z-0 h-[1000px] w-[1000px] rounded-full bg-primary/10 blur-[120px]" />
        <div className="-bottom-[500px] -left-[500px] pointer-events-none absolute z-0 h-[1000px] w-[1000px] rounded-full bg-secondary-50/20 blur-[120px] dark:bg-secondary/10" />

        <section className="relative z-10 grow py-10 lg:py-16">
          <div className="container mx-auto px-4 lg:px-9">
            <div className="mb-8">
              <BackButton />
            </div>

            <div className="mb-10 max-w-2xl lg:mb-12">
              <h1 className="mb-4 font-heading text-4xl tracking-tight lg:text-5xl">
                {t("page_title")}
              </h1>
              <p className="font-body_one text-text/70 leading-relaxed">
                {t("page_description")}
              </p>
            </div>

            <div className="mx-auto max-w-4xl">
              <VideoGenerator albumId={id} />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
