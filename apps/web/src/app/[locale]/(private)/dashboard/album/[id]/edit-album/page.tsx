import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { BackButton } from '../../../(components)/back-button';
import { EditAlbumContent } from './components/edit-album-content';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Editar álbum | Polotrip',
  description:
    'Edite suas fotos, defina datas e localizações para suas memórias de viagem na Polotrip',
};

export default function EditAlbumPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-background flex flex-col pt-16 lg:pt-0">
        <section className="py-8 bg-secondary/5 flex-grow">
          <div className="container mx-auto px-4 lg:px-9">
            <div className="mb-6">
              <BackButton aria-label="Voltar para a lista de álbuns" />
            </div>

            <div className="mb-8">
              <h1 className="font-title_two mb-2">Editar álbum</h1>
              <p className="font-body_two text-text/75">
                Organize suas fotos, defina datas e localizações para suas memórias.
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
