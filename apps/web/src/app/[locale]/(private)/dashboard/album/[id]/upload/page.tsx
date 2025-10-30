import { getTranslations } from 'next-intl/server';
import { Metadata } from 'next';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { UploadForm } from './components/UploadForm';
import { BackButton } from '../../../(components)/back-button';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'UploadPage.metadata' });

  return {
    title: t('title'),
    description: t('description'),
  };
}

export default async function UploadPhotosPage() {
  const t = await getTranslations('UploadPage');

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background flex flex-col pt-16 lg:pt-0">
        <section className="py-8 bg-secondary/5 flex-grow">
          <div className="container mx-auto px-4 lg:px-9">
            <div className="mb-6">
              <BackButton aria-label={t('back_button_aria')} />
            </div>

            <div className="max-w-[704px] mx-auto">
              <UploadForm />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
