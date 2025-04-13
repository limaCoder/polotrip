import { Camera, Map, Music4, Share2, Lock, Smartphone, Cloud, BookOpen } from 'lucide-react';

const benefits = [
  {
    id: 1,
    title: 'Memórias digitais organizadas',
    description:
      'Chega de fotos perdidas em pastas aleatórias. Mantenha suas memórias de viagem organizadas e fáceis de encontrar.',
    icon: <Camera />,
  },
  {
    id: 2,
    title: 'Mapa interativo',
    description:
      'Visualize sua jornada em um mapa com todos os lugares que você visitou, diferente de serviços de armazenamento convencionais.',
    icon: <Map />,
  },
  {
    id: 3,
    title: 'Privacidade garantida',
    description:
      'Diferente das redes sociais, você decide quem pode ver suas memórias, sem exposição pública indesejada.',
    icon: <Lock />,
  },
  {
    id: 4,
    title: 'Formato otimizado',
    description:
      'Chega de limitações de formato! Não fique preso ao formato vertical como nos "destaques" das redes sociais.',
    icon: <Smartphone />,
  },
  {
    id: 5,
    title: 'Sem limitações de espaço',
    description:
      'Esqueça mensagens de "armazenamento cheio" do seu G**gle Drive ou Dr**box. Foque nas memórias, não em gerenciar espaço.',
    icon: <Cloud />,
  },
  {
    id: 6,
    title: 'Experiência narrativa',
    description:
      'Transforme suas fotos em histórias, não apenas arquivos empilhados em uma pasta de armazenamento em nuvem.',
    icon: <BookOpen />,
  },
  {
    id: 7,
    title: 'Trilha sonora',
    description:
      'Adicione músicas do Spotify para tornar a experiência ainda mais especial, algo impossível em serviços convencionais.',
    icon: <Music4 />,
  },
  {
    id: 8,
    title: 'Compartilhamento fácil e controlado',
    description:
      'Compartilhe seus álbuns com quem você quiser através de um link, mantendo o controle total sobre suas memórias.',
    icon: <Share2 />,
  },
];

export { benefits };
