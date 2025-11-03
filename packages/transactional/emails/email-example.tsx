import { Body, Button, Head, Html, Tailwind } from "@react-email/components";

export const MyEmail = () => {
  return (
    <Html>
      <Head />
      <Tailwind
        config={{
          theme: {
            extend: {
              colors: {
                primary: "#000",
                secondary: "#fff",
              },
            },
          },
        }}
      >
        <Body className="font-sans antialiased">
          <Button
            className="bg-blue-500 px-3 py-2 font-medium text-white leading-4"
            href="https://example.com"
          >
            Click me
          </Button>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default MyEmail;
