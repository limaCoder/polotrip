import * as React from 'react';
import {
  Html,
  Body,
  Head,
  Heading,
  Text,
  Container,
  Section,
  Hr,
  Link,
  Tailwind,
  Img,
} from '@react-email/components';

interface WelcomeEmailProps {
  name: string;
}

const WelcomeEmail: React.FC<WelcomeEmailProps> = ({ name = 'Fulano' }) => {
  const fullYear = new Date().getFullYear();

  return (
    <Html>
      <Head />
      <Tailwind
        config={{
          theme: {
            extend: {
              colors: {
                primary: '#03aed2',
                secondary: '#68d2e8',
                secondary_10: '#EFF9FC',
                secondary_50: '#afe7f2',
                yellow: '#feefad',
                accent: '#fdde55',
                background: '#f7fcfd',
                text: '#08171c',
                text_opacity_25: '#08171C40',
                gradient_primary: '#2980b9, #2c3e50',
              },
            },
          },
        }}
      >
        <Body className="bg-gray-100 font-sans">
          <Container className="max-w-2xl mx-auto bg-white rounded-lg overflow-hidden shadow-lg">
            <Section className="bg-primary p-8 text-center">
              <Heading className="text-white text-2xl font-bold m-0">
                Bem-vindo ao Polotrip!
              </Heading>
            </Section>

            <Section className="p-5">
              <Img src="logo.png" alt="Polotrip" className="mx-auto mb-4" />
              <Text className="text-lg text-gray-800 mb-4">
                Olá, <span className="font-bold">{name}</span>!
              </Text>

              <Text className="text-base text-gray-800 mb-4">
                Estamos muito felizes em ter você conosco no Polotrip! Nossa plataforma foi criada
                para tornar suas viagens mais organizadas e memoráveis.
              </Text>

              <Text className="text-base text-gray-800 mb-2">
                Aqui estão algumas coisas que você pode fazer:
              </Text>

              <Text className="text-base text-gray-800 ml-4 mb-1">
                • Criar álbuns de fotos para suas viagens
              </Text>
              <Text className="text-base text-gray-800 ml-4 mb-1">
                • Organizar suas memórias de viagem
              </Text>
              <Text className="text-base text-gray-800 ml-4 mb-4">
                • Compartilhar suas experiências com amigos e familiares
              </Text>

              <Section className="bg-gray-100 p-4 rounded-lg mb-4">
                <Text className="text-base text-gray-800 m-0">
                  Se precisar de ajuda ou tiver dúvidas, não hesite em nos contatar.
                </Text>
              </Section>

              <Hr className="border-t border-gray-200 my-2" />

              <Section className="text-center">
                <Text className="text-base text-gray-800 mb-2">Boas viagens!</Text>

                <Text className="text-base text-gray-800 font-semibold">Equipe Polotrip</Text>
              </Section>
            </Section>

            <Section className="bg-yellow text-black font-bold p-4 text-center">
              <Text className="text-sm m-0">
                © {fullYear} Polotrip. Todos os direitos reservados.
              </Text>
              <Link href="#" className="text-sm underline mt-2">
                Política de Privacidade
              </Link>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default WelcomeEmail;
