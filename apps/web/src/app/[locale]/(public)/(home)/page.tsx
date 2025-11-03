import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import type { PageProps } from "@/types/next";
import { Benefits } from "./(sections)/Benefits";
import { Cta } from "./(sections)/Cta";
import { Faq } from "./(sections)/Faq";
import { Hero } from "./(sections)/Hero";
import { HowItWorks } from "./(sections)/HowItWorks";

export default async function Home({ params }: PageProps) {
  const { locale } = await params;

  return (
    <>
      <Header />
      <main className="min-h-dvh">
        <Hero />
        <Benefits />
        <HowItWorks />
        <Faq />
        <Cta locale={locale} />
      </main>
      <Footer />
    </>
  );
}
