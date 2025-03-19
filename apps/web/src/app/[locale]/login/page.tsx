import Image from 'next/image';
import { LogIn } from 'lucide-react';

import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/Button';
import LottieAnimation from '@/components/LottieAnimation';

import womanTakingSunbathOnBeach from '@/assets/lottie/woman-taking-sunbath-on-beach.json';

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-background flex flex-col">
      <Header />

      <section className="flex-grow py-8 bg-secondary/5">
        <div className="container mx-auto px-4 lg:px-9 flex justify-center items-center h-full">
          <div className="flex flex-col items-center p-6 max-w-md w-full gap-6">
            <div className="bg-secondary/50 rounded-full p-2.5 w-[50px] h-[50px] flex items-center justify-center">
              <LogIn size={24} color="#03AED2" strokeWidth={2} />
            </div>

            <div className="text-center space-y-2">
              <h1 className="font-title_three font-bold">Seja bem-vindo!</h1>
              <p className="font-body_two">
                Escolha uma das opções abaixo para autenticar na sua conta
              </p>
            </div>

            <div className="flex flex-col gap-4 w-full">
              <Button className="border border-text-opacity-25 rounded-lg py-2 px-6 w-full font-normal justify-center items-center hover:bg-gray-50">
                <Image src="/icons/google.png" alt="Google" width={24} height={24} />
                <span className="font-body_two">Sign in with Google</span>
              </Button>

              <Button className="border border-text-opacity-25 rounded-lg py-2 px-6 w-full font-normal justify-center items-center hover:bg-gray-50">
                <Image src="/icons/apple.png" alt="Apple" width={24} height={24} />
                <span className="font-body_two">Sign in with Apple</span>
              </Button>
            </div>

            <div className="w-full h-[320px] mt-4 rounded-lg overflow-hidden">
              <LottieAnimation animationData={womanTakingSunbathOnBeach} />
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
