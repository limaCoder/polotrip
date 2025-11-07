import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";
// biome-ignore lint/style/useImportType: we need to use the whole React library
import React from "react";

type WelcomeEmailProps = {
  name: string;
};

const WelcomeEmail: React.FC<WelcomeEmailProps> = ({ name = "Fulano" }) => {
  const fullYear = new Date().getFullYear();

  return (
    <Html>
      <Head />
      <Tailwind
        config={{
          theme: {
            extend: {
              colors: {
                primary: "#03aed2",
                secondary: "#68d2e8",
                secondary_10: "#EFF9FC",
                secondary_50: "#afe7f2",
                yellow: "#feefad",
                accent: "#fdde55",
                background: "#f7fcfd",
                text: "#08171c",
                text_opacity_25: "#08171C40",
                gradient_primary: "#2980b9, #2c3e50",
              },
            },
          },
        }}
      >
        <Body className="bg-gray-100 font-sans">
          <Container className="mx-auto max-w-2xl overflow-hidden rounded-lg bg-white shadow-lg">
            <Section className="bg-primary p-8 text-center">
              <Heading className="m-0 font-bold text-2xl text-white">
                Bem-vindo ao Polotrip!
              </Heading>
            </Section>

            <Section className="p-5">
              <Img alt="Polotrip" className="mx-auto mb-4" src="logo.png" />
              <Text className="mb-4 text-gray-800 text-lg">
                Olá, <span className="font-bold">{name}</span>!
              </Text>

              <Text className="mb-4 text-base text-gray-800">
                Estamos muito felizes em ter você conosco no Polotrip! Nossa
                plataforma foi criada para tornar suas viagens mais organizadas
                e memoráveis.
              </Text>

              <Text className="mb-2 text-base text-gray-800">
                Aqui estão algumas coisas que você pode fazer:
              </Text>

              <Text className="mb-1 ml-4 text-base text-gray-800">
                • Criar álbuns de fotos para suas viagens
              </Text>
              <Text className="mb-1 ml-4 text-base text-gray-800">
                • Organizar suas memórias de viagem
              </Text>
              <Text className="mb-4 ml-4 text-base text-gray-800">
                • Compartilhar suas experiências com amigos e familiares
              </Text>

              <Section className="mb-4 rounded-lg bg-gray-100 p-4">
                <Text className="m-0 text-base text-gray-800">
                  Se precisar de ajuda ou tiver dúvidas, não hesite em nos
                  contatar.
                </Text>
              </Section>

              <Hr className="my-2 border-gray-200 border-t" />

              <Section className="text-center">
                <Text className="mb-2 text-base text-gray-800">
                  Boas viagens!
                </Text>

                <Text className="font-semibold text-base text-gray-800">
                  Equipe Polotrip
                </Text>
              </Section>
            </Section>

            <Section className="bg-yellow p-4 text-center font-bold text-black">
              <Text className="m-0 text-sm">
                © {fullYear} Polotrip. Todos os direitos reservados.
              </Text>
              <Link className="mt-2 text-sm underline" href="#">
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
