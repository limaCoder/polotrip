import { OnboardingStep } from '@/components/OnboardingModal/types';

export const onboardingSteps: OnboardingStep[] = [
  {
    title: 'Seus Álbuns',
    description:
      'Na Dashboard, você encontrará todos os seus álbuns de viagem. Aqui você pode visualizar, gerenciar e compartilhar suas recordações com apenas alguns cliques.',
    image: '/pages/dashboard/onboarding/step-one.jpg',
  },
  {
    title: 'Criando um Novo Álbum',
    description:
      'Para criar um álbum, clique em "Novo Álbum", preencha as informações básicas e faça o pagamento. Cada álbum é uma nova oportunidade de organizar suas memórias de viagem.',
    video: '/pages/dashboard/onboarding/step-two.mp4',
  },
  {
    title: 'Upload de Fotos',
    description:
      'Após criar seu álbum, você poderá fazer o upload das suas melhores fotos. Selecione, arraste e solte suas imagens para começar a preencher seu álbum de viagem.',
    image: '/pages/dashboard/onboarding/step-three.jpg',
  },
  {
    title: 'Organizando seu Álbum',
    description:
      'Antes de publicar, organize suas fotos da maneira que desejar. Você pode reordenar, adicionar legendas e garantir que seu álbum conte a história perfeita da sua viagem.',
    video: '/pages/dashboard/onboarding/step-four.mp4',
  },
  {
    title: 'Álbum Publicado!',
    description:
      'Seu álbum está pronto para ser compartilhado! Envie o link para amigos e familiares para que todos possam reviver os momentos especiais da sua viagem.',
    video: '/pages/dashboard/onboarding/step-five.mp4',
  },
];
