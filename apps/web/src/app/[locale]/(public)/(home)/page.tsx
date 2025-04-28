import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';

import { Hero } from './(sections)/Hero';
import { HowItWorks } from './(sections)/HowItWorks';
import { Benefits } from './(sections)/Benefits';
import { Faq } from './(sections)/Faq';
import { Cta } from './(sections)/Cta';
import { PageWithLocale } from '@/types/pageWithLocale';

export default async function Home({ params }: PageWithLocale) {
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
