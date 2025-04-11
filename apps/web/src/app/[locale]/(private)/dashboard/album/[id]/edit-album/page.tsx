import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { BackButton } from '../../../(components)/BackButton';
import Link from 'next/link';
import Image from 'next/image';
import { Calendar, MapPin, Music, Trash2 } from 'lucide-react';

export default function EditAlbumPage() {
  return (
    <main className="min-h-screen bg-background flex flex-col">
      <Header />

      <section className="py-8 bg-secondary/5 flex-grow">
        <div className="container mx-auto px-4 lg:px-9">
          <div className="mb-6">
            <BackButton />
          </div>

          <div className="mb-8">
            <h1 className="font-title_two mb-2">Editar álbum</h1>
            <p className="font-body_two text-text/75">
              Organize suas fotos, escolha uma música ou playlist que defina sua viagem, e confirme
              as datas e localizações.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_3fr] gap-9">
            <div className="flex flex-col gap-9">
              <div className="bg-background p-8 rounded-lg shadow-md">
                <div className="flex items-center gap-3 mb-6">
                  <Calendar size={24} className="text-primary" />
                  <h2 className="font-title_three font-bold">Timeline</h2>
                </div>

                <div className="flex flex-col gap-4">
                  <button className="bg-primary p-2 rounded-lg flex flex-col items-start">
                    <p className="font-body_two font-bold text-background">
                      quinta-feira, 14 de março
                    </p>
                    <p className="font-body_two text-sm text-background">16 fotos</p>
                  </button>

                  <button className="p-2 rounded-lg flex flex-col items-start">
                    <p className="font-body_two font-bold">sexta-feira, 15 de março</p>
                    <p className="font-body_two text-sm">1 foto</p>
                  </button>

                  <button className="p-2 rounded-lg flex flex-col items-start">
                    <p className="font-body_two font-bold">Sem data definida</p>
                    <p className="font-body_two text-sm">1 foto</p>
                  </button>
                </div>
              </div>

              <div className="bg-background p-8 rounded-lg shadow-md">
                <div className="flex items-center gap-3 mb-3">
                  <Calendar size={24} className="text-primary" />
                  <h2 className="font-title_three font-bold">Mapa</h2>
                </div>

                <p className="font-body_two text-text/75 mb-6">
                  Selecione os momentos da viagem e verifique a localização abaixo no mapa.
                </p>

                <div className="w-full h-[300px] bg-gray-200 rounded-md">
                  {/* Map placeholder */}
                </div>
              </div>

              <div className="bg-background p-8 rounded-lg shadow-md">
                <div className="flex items-center gap-3 mb-6">
                  <Music size={24} className="text-primary" />
                  <h2 className="font-title_three font-bold">Música</h2>
                </div>

                <button className="w-full bg-primary text-background rounded px-6 py-3 hover:bg-primary/90 font-body_two">
                  Conectar Spotify
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-9">
              <div className="bg-background p-8 rounded-lg shadow-md opacity-40">
                <h2 className="font-title_three font-bold mb-6">Editar</h2>

                <div className="flex flex-col gap-6 mb-8">
                  <div className="flex flex-col gap-2">
                    <label className="font-body_two">Data</label>
                    <div className="border border-text/25 rounded p-3 flex items-center gap-2">
                      <Calendar size={20} className="text-text/50" />
                      <span className="font-body_two text-text/50">Selecione a data</span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="font-body_two">Localização</label>
                    <div className="border border-text/25 rounded p-3 flex items-center gap-2">
                      <MapPin size={20} className="text-text/50" />
                      <span className="font-body_two text-text/50">Selecione a localização</span>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button className="bg-primary text-background rounded px-6 py-2 hover:bg-primary/90 font-body_two">
                    Salvar edição
                  </button>
                </div>
              </div>

              <div className="bg-background p-8 rounded-lg shadow-md">
                <div className="mb-3">
                  <h2 className="font-title_three font-bold mb-1">Momentos da viagem</h2>
                  <p className="font-body_two text-text/75">
                    Para realizar a edição das informações de data e localidade, selecione os
                    conteúdos abaixo.
                  </p>
                </div>

                <div className="flex justify-between items-center mb-6">
                  <p className="font-body_two">
                    <span className="text-primary font-bold">16 fotos</span> em 14 de março
                  </p>
                  <div className="flex items-center gap-2 text-text/50 cursor-pointer hover:text-text/75">
                    <Trash2 size={18} />
                    <span className="font-body_two">Excluir Selecionadas</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                  {Array.from({ length: 15 }).map((_, index) => (
                    <div
                      key={index}
                      className="aspect-square bg-gray-200 rounded-sm relative group overflow-hidden"
                    >
                      <Image
                        src="/pages/upload/photo_sample.jpg"
                        alt={`Foto ${index + 1}`}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end">
                <Link
                  href={`/dashboard`}
                  className="bg-primary text-background rounded px-8 py-3 hover:bg-primary/90 font-body_two"
                >
                  Finalizar
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
