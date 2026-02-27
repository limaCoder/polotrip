import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { BackButton } from "../../../(components)/back-button";
import { UploadForm } from "./components/UploadForm";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "UploadPage.metadata" });

  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function UploadPhotosPage() {
  const t = await getTranslations("UploadPage");

  return (
    <>
      <Header />
      <main className="flex min-h-screen flex-col bg-background pt-16 lg:pt-0">
        <section className="relative grow overflow-hidden py-8">
          <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
            <div className="absolute top-[-10%] right-[-10%] h-[500px] w-[500px] rounded-full bg-primary/20 blur-[120px]" />
            <div className="absolute bottom-[-10%] left-[-10%] h-[600px] w-[600px] rounded-full bg-blue-500/10 blur-[150px]" />
            <div className="absolute top-[40%] left-[20%] h-[300px] w-[300px] rounded-full bg-purple-500/10 blur-[100px]" />
          </div>

          <div className="relative z-10 mx-auto flex h-full flex-col px-4 lg:px-9">
            <div className="mb-8 pl-4 lg:pl-8">
              <BackButton aria-label={t("back_button_aria")} />
            </div>

            <div className="mx-auto w-full max-w-[850px] grow pb-12">
              <UploadForm />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
