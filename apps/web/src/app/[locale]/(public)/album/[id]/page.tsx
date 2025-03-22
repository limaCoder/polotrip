import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { FullscreenIcon, Share2 } from 'lucide-react';

export default function AlbumViewPage() {
  return (
    <main className="min-h-screen bg-background flex flex-col">
      <div className="relative w-full h-[510px] flex flex-col justify-between">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-black/50 via-transparent to-transparent z-10" />
          <img
            src="/pages/album/album-cover.jpg"
            alt="Capa do álbum"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="relative z-20 w-full max-w-7xl mx-auto px-4 lg:px-9 py-4 flex justify-between items-center">
          <div>
            <Header />
          </div>

          <div className="flex items-center gap-6">
            <button className="flex items-center gap-2 text-background hover:text-primary transition-colors">
              <FullscreenIcon size={20} className="text-primary" />
              <span className="font-body_one">Tela cheia</span>
            </button>

            <button className="flex items-center gap-2 text-background hover:text-primary transition-colors">
              <Share2 size={20} className="text-primary" />
              <span className="font-body_one">Compartilhar</span>
            </button>
          </div>
        </div>

        <div className="relative z-20 w-full flex flex-col items-start pl-12 pb-10">
          <h1 className="font-title_one font-bold text-4xl md:text-5xl lg:text-6xl text-background text-center">
            Viagem para Paris
          </h1>

          <p className="font-title_three text-xl md:text-2xl text-background text-center mb-6">
            Uma jornada inesquecível pela Cidade Luz
          </p>

          <div className="flex items-center gap-2">
            <div className="relative inline-flex h-[24px] w-[44px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background bg-primary">
              <span className="pointer-events-none inline-block h-[20px] w-[20px] rounded-full bg-white shadow-lg transform translate-x-[20px] transition duration-200" />
            </div>
            <label htmlFor="auto-scroll" className="text-white font-body_two">
              Habilitar rolagem automática
            </label>
          </div>
        </div>
      </div>

      <div className="flex-grow bg-secondary/5"></div>

      <Footer />
    </main>
  );
}
