import { Button, Html, Tailwind, Body, Head } from '@react-email/components';

export const MyEmail = () => {
  return (
    <Html>
      <Head />
      <Tailwind
        config={{
          theme: {
            extend: {
              colors: {
                primary: '#000',
                secondary: '#fff',
              },
            },
          },
        }}
      >
        <Body className="font-sans antialiased">
          <Button
            href="https://example.com"
            className="bg-blue-500 px-3 py-2 font-medium leading-4 text-white"
          >
            Click me
          </Button>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default MyEmail;
