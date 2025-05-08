import { Metadata } from 'next';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { UploadForm } from './components/UploadForm';
import { BackButton } from '../../../(components)/back-button';

export const metadata: Metadata = {
  title: 'Upload de Fotos | Polotrip',
  description: 'Faça upload de fotos para o seu álbum na Polotrip',
};

export default function UploadPhotosPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-background flex flex-col pt-16 lg:pt-0">
        <section className="py-8 bg-secondary/5 flex-grow">
          <div className="container mx-auto px-4 lg:px-9">
            <div className="mb-6">
              <BackButton aria-label="Voltar para o álbum" />
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
