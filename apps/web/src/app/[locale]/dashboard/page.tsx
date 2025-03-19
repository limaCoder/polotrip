import { Plus } from 'lucide-react';

import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/Button';
import { AlbumCard } from '@/components/AlbumCard';

import { albums } from '@/data/albums';

export default function DashboardPage() {
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
              <Button className="bg-primary text-background py-4 px-8 flex items-center gap-2 shadow-lg hover:brightness-105">
                <Plus size={24} color="#F7FCFD" />
                <span>Criar Novo Álbum</span>
              </Button>
            </div>

            <div className="flex justify-between flex-wrap gap-9">
              {albums?.map(album => (
                <AlbumCard
                  key={album?.id}
                  title={album?.title}
                  date={album?.date}
                  photosCount={album?.photosCount}
                  imageUrl={album?.imageUrl}
                />
              ))}
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
