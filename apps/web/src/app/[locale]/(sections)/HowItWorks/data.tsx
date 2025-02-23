import { Image, UploadCloud, Share2 } from 'lucide-react';

const steps = [
  {
    id: 1,
    title: 'Crie seu album',
    description:
      'Defina o título, descrição e capa da viagem. Escolha como deseja pagar (cartão ou Pix) e pronto: seu álbum está reservado!',
    icon: <Image className="w-10 h-10 text-primary" />,
  },
  {
    id: 2,
    title: 'Envie suas fotos',
    description:
      'Arraste e solte as imagens, organize-as por data e, se quiser, conecte sua conta do Spotify para escolher a trilha sonora perfeita.',
    icon: <UploadCloud className="w-10 h-10 text-primary" />,
  },
  {
    id: 3,
    title: 'Compartilhe com o mundo',
    description:
      'Receba um link único do seu álbum. Ele exibirá mapa, timeline e galeria em um layout envolvente – tudo para que amigos e família possam reviver cada momento.',
    icon: <Share2 className="w-10 h-10 text-primary" />,
  },
];

export { steps };
