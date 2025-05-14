import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { AlbumForm } from './components/album-form';
import { BackButton } from '../(components)/back-button';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Criar álbum | Polotrip',
  description: 'Crie um novo álbum para compartilhar suas memórias de viagem na Polotrip',
};

export default function CreateAlbumPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-background flex flex-col pt-16 lg:pt-0">
        <section className="py-8 bg-secondary/5 flex-grow">
          <div className="container mx-auto px-4 lg:px-9">
            <div className="mb-6">
              <BackButton aria-label="Voltar para a lista de álbuns" />
            </div>

            <div className="max-w-[704px] mx-auto">
              <AlbumForm />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
