import Image from 'next/image';
import { LogIn } from 'lucide-react';
import { PageProps } from '@/types/next';

import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import LottieAnimation from '@/components/LottieAnimation';

import womanTakingSunbathOnBeach from '@/assets/lottie/woman-taking-sunbath-on-beach.json';
import { OAuthButton } from '@/components/OAuthButton';

import { loginWithEmailPassword } from '@/actions/loginWithEmailPassword';
import { getTranslations } from 'next-intl/server';

const isLoginWithEmailPasswordEnabled = false;

export default async function LoginPage({ params }: PageProps) {
  const { locale } = await params;
  const signInUserWithLocale = loginWithEmailPassword.bind(null, locale);
  const t = await getTranslations('SignIn');

  return (
    <>
      <Header />
      <main className="lg:min-h-[calc(100vh-200px)] bg-background flex flex-col">
        <section className="flex flex-grow bg-secondary/5 pt-28 lg:pt-16">
          <div className="container mx-auto px-4 lg:px-9 flex justify-center items-center flex-col">
            <div className="flex flex-col items-center max-w-md w-full gap-6">
              <div className="bg-secondary/50 rounded-full p-2.5 w-[50px] h-[50px] flex items-center justify-center">
                <LogIn size={24} color="#03AED2" strokeWidth={2} />
              </div>

              <div className="text-center space-y-2">
                <h1 className="font-title_three font-bold">{t('title')}</h1>
                <p className="font-body_two">{t('subtitle')}</p>
              </div>

              <div className="flex flex-col gap-4 w-full">
                {isLoginWithEmailPasswordEnabled && (
                  <form action={signInUserWithLocale} className="w-full space-y-4 mb-4">
                    <div className="flex flex-col gap-2">
                      <label htmlFor="email" className="font-body_two">
                        {t('email_label')}
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        placeholder={t('email_placeholder')}
                        className="w-full p-3 border border-gray-300 rounded-lg"
                        required
                      />
                    </div>

                    <div className="flex flex-col gap-2">
                      <label htmlFor="password" className="font-body_two">
                        {t('password_label')}
                      </label>
                      <input
                        type="password"
                        id="password"
                        name="password"
                        placeholder={t('password_placeholder')}
                        className="w-full p-3 border border-gray-300 rounded-lg"
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-primary text-white font-body_two p-3 rounded-lg hover:bg-primary/90"
                    >
                      {t('submit_button')}
                    </button>
                  </form>
                )}

                <OAuthButton provider="google" aria-label={t('google_oauth_aria')}>
                  <Image
                    src="/icons/google.png"
                    alt={t('google_icon_alt')}
                    width={24}
                    height={24}
                  />
                  <span className="font-body_two">{t('google_oauth_text')}</span>
                </OAuthButton>
              </div>
            </div>

            <div className="w-full h-[250px]  lg:h-[320px] lg:mt-4 rounded-lg overflow-hidden">
              <LottieAnimation animationData={womanTakingSunbathOnBeach} />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
