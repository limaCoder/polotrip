import { ButtonNavigation } from '@/components/ButtonNavigation';
import { TextGenerateEffect } from '@/components/ui/text-generate-effect';
import { MotionDiv, MotionSection } from '@/lib/motion/motion-components';
import { getTranslations } from 'next-intl/server';
import { HeroPhotos } from './photos';

export async function Hero() {
  const t = await getTranslations('Homepage');

  return (
    <MotionSection
      initial={{ opacity: 0, y: 35 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
      className="py-10 pt-30 lg:pt-0"
    >
      <div className="flex flex-col lg:flex-row container justify-between items-center w-full h-full px-4 lg:px-9">
        <div className="lg:h-full flex flex-col lg:justify-center text-center lg:text-left max-w-2xl">
          <TextGenerateEffect
            className="lg:w-[582px]"
            tag="h1"
            duration={2}
            filter={false}
            words={t('title')}
          />
          <TextGenerateEffect
            className="lg:w-[526px]"
            tag="p"
            duration={1.2}
            filter={false}
            words={t('content')}
          />
          <MotionDiv
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="flex flex-wrap gap-4 mt-6 justify-center lg:justify-start"
          >
            <ButtonNavigation
              href="#how-it-works"
              className="bg-primary text-white button-shadow"
              aria-label="Como funciona?"
            >
              <span className="font-bold">Como funciona?</span>
            </ButtonNavigation>
            <ButtonNavigation
              href="/sign-in"
              className="bg-yellow text-black button-shadow"
              aria-label="Comece agora"
            >
              <span className="font-bold">Comece agora</span>
            </ButtonNavigation>
          </MotionDiv>
        </div>

        <HeroPhotos />
      </div>
    </MotionSection>
  );
}
