import { TextGenerateEffect } from '@/components/ui/text-generate-effect';
import { MotionDiv } from '@/lib/motion/motion-components';
import { getTranslations } from 'next-intl/server';
import { HeroPhotos } from './photos';
import { HeroButtons } from './hero-buttons';

export async function Hero() {
  const t = await getTranslations('Home.Hero');

  return (
    <section className="relative py-10 pt-30 lg:pt-20 lg:min-h-screen overflow-hidden">
      <div className="hidden lg:block absolute inset-0 w-full h-full z-0">
        <video autoPlay loop muted playsInline className="w-full h-full object-cover">
          <source src="/pages/home/hero/hero-bg.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/30" />
      </div>

      <div className="relative z-10 flex flex-col lg:flex-row container justify-between items-center w-full h-full lg:min-h-screen px-4 lg:px-9">
        <div className="lg:h-full flex flex-col lg:justify-center text-center lg:text-left max-w-2xl">
          <TextGenerateEffect
            className="lg:w-[582px] lg:drop-shadow-lg text-primary lg:text-secondary"
            tag="h1"
            duration={2}
            filter={false}
            words={t('title')}
          />
          <TextGenerateEffect
            className="lg:w-[526px] lg:text-white lg:drop-shadow-lg"
            tag="p"
            duration={1.2}
            filter={false}
            words={t('subtitle')}
          />
          <MotionDiv
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="flex flex-wrap gap-4 mt-6 justify-center lg:justify-start"
          >
            <HeroButtons
              howItWorksText={t('how_it_works_button')}
              howItWorksAria={t('how_it_works_button_aria')}
              seeExampleText={t('see_example_button')}
              seeExampleAria={t('see_example_button_aria')}
            />
          </MotionDiv>
        </div>

        <div className="lg:hidden">
          <HeroPhotos />
        </div>
      </div>
    </section>
  );
}
