import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { AlbumForm } from './components/AlbumForm';
import { BackButton } from '../(components)/back-button';

export default function CreateAlbumPage() {
  return (
    <main className="min-h-screen bg-background flex flex-col">
      <Header />

      <section className="py-8 bg-secondary/5 flex-grow">
        <div className="container mx-auto px-4 lg:px-9">
          <div className="mb-6">
            <BackButton />
          </div>

          <div className="max-w-[704px] mx-auto">
            <AlbumForm />
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
