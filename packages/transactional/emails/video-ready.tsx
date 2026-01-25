import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";
// biome-ignore lint/style/useImportType: we need to use the whole React library
import React from "react";

type VideoReadyEmailProps = {
  name: string;
  albumTitle: string;
  albumUrl: string;
};

const VideoReadyEmail: React.FC<VideoReadyEmailProps> = ({
  name = "User",
  albumTitle = "Your Album",
  albumUrl = "https://polotrip.com",
}) => {
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
                Your Video is Ready!
              </Heading>
            </Section>

            <Section className="p-5">
              <Text className="mb-4 text-gray-800 text-lg">
                Hi, <span className="font-bold">{name}</span>!
              </Text>

              <Text className="mb-4 text-base text-gray-800">
                Great news! Your narrative video for the album{" "}
                <span className="font-bold">"{albumTitle}"</span> has been
                generated and is ready to watch.
              </Text>

              <Text className="mb-4 text-base text-gray-800">
                Our AI has carefully crafted a beautiful video with your photos,
                including professional narration that tells the story of your
                memories.
              </Text>

              <Section className="mb-4 text-center">
                <Button
                  className="rounded-lg bg-primary px-6 py-3 font-bold text-white"
                  href={albumUrl}
                >
                  Watch Your Video
                </Button>
              </Section>

              <Section className="mb-4 rounded-lg bg-gray-100 p-4">
                <Text className="m-0 text-base text-gray-800">
                  You can also share this video with friends and family by
                  sending them the album link.
                </Text>
              </Section>

              <Hr className="my-2 border-gray-200 border-t" />

              <Section className="text-center">
                <Text className="mb-2 text-base text-gray-800">
                  Enjoy your memories!
                </Text>

                <Text className="font-semibold text-base text-gray-800">
                  Polotrip Team
                </Text>
              </Section>
            </Section>

            <Section className="bg-yellow p-4 text-center font-bold text-black">
              <Text className="m-0 text-sm">
                © {fullYear} Polotrip. All rights reserved.
              </Text>
              <Link
                className="mt-2 text-sm underline"
                href="https://polotrip.com/privacy-policy"
              >
                Privacy Policy
              </Link>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default VideoReadyEmail;
