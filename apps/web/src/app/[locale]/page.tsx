import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';
import { Hero } from './(sections)/Hero';
import { HowItWorks } from './(sections)/HowItWorks';
import { Benefits } from './(sections)/Benefits';
import { Faq } from './(sections)/Faq';
import { Cta } from './(sections)/Cta';

export default async function Home() {
  return (
    <main className="min-h-dvh">
      <Header />

      <Hero />

      <Benefits />

      <HowItWorks />

      <Faq />

      <Cta />

      <Footer />
    </main>
  );
}
