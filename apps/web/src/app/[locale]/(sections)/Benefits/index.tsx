import { Camera } from 'lucide-react';

export async function Benefits() {
  const benefits = [
    {
      title: 'Memórias Digitais',
      description: 'Compartilhe suas fotos e vídeos de viagem em um álbum digital interativo.',
      icon: <Camera />,
    },
    {
      title: 'Mapa Interativo',
      description: 'Visualize sua jornada em um mapa com todos os lugares que você visitou.',
      icon: <Camera />,
    },
    {
      title: 'Trilha Sonora',
      description: 'Adicione músicas do Spotify para tornar a experiência ainda mais especial.',
      icon: <Camera />,
    },
    {
      title: 'Compartilhamento Fácil',
      description: 'Compartilhe seus álbuns com amigos e familiares através de um link.',
      icon: <Camera />,
    },
  ];

  return (
    <section className="py-10 bg-secondary-10 lg:bg-background">
      <div className="container mx-auto px-4 lg:px-9">
        <h2 className="font-title_two text-primary text-center font-bold mb-12">
          Por que escolher o Polotrip?
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 px-4 md:px-9">
          {benefits.map((benefit, index) => (
            <div key={index} className="flex flex-col">
              <div className="text-primary bg-secondary-50 w-12 h-12 justify-center flex items-center rounded-full">
                {benefit.icon}
              </div>
              <h3 className="text-left font-title_three mt-5 font-semibold">{benefit.title}</h3>
              <p className="font-body_one mt-6">{benefit.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
