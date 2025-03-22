import { Plus } from 'lucide-react';

import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { AlbumCard } from '@/components/AlbumCard';
import { ButtonNavigation } from '@/components/ButtonNavigation';

import { getAlbums } from '@/http/get-albums';

export default async function DashboardPage() {
  const albums = await getAlbums();

  return (
    <main className="min-h-screen bg-background flex flex-col">
      <Header />
      <section className="py-8 bg-secondary/5 flex-grow">
        <div className="container mx-auto px-4 lg:px-9">
          <div className="p-9 flex flex-col gap-9">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="font-title_two">Meus Álbuns</h1>
                <p className="font-title_three">Gerencie e compartilhe suas memórias de viagem</p>
              </div>
              <ButtonNavigation
                href="/dashboard/create-album"
                className="bg-primary text-background py-4 px-8 flex items-center gap-2 shadow-lg hover:brightness-105"
              >
                <Plus size={24} color="#F7FCFD" />
                <span>Criar Novo Álbum</span>
              </ButtonNavigation>
            </div>

            <div className="flex justify-between flex-wrap gap-9">
              {albums?.length > 0 ? (
                albums?.map(album => (
                  <AlbumCard
                    key={album?.id}
                    title={album?.title}
                    date={album?.createdAt.toLocaleDateString()}
                    photosCount={album?.photoCount}
                    imageUrl={album?.coverImageUrl ?? ''}
                  />
                ))
              ) : (
                <p className="text-center text-gray-500">Nenhum álbum encontrado</p>
              )}
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
