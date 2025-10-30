import { MotionSection } from '@/lib/motion/motion-components';
import { BenefitsGrid } from './grid';
import { getTranslations } from 'next-intl/server';

export async function Benefits() {
  const t = await getTranslations('Home.Benefits');

  return (
    <MotionSection
      initial={{ opacity: 0, y: 35 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
      className="py-8 lg:py-16 bg-secondary-10 lg:bg-background"
      id="benefits"
    >
      <div className="container mx-auto px-4 lg:px-9">
        <h2 className="font-title_two text-primary text-center font-bold mb-4 md:mb-12">
          {t('title')}
        </h2>

        <BenefitsGrid />

        <p className="md:mt-12 text-center text-sm max-w-2xl mx-auto text-gray-600 mt-8">
          {t('description')}
        </p>
      </div>
    </MotionSection>
  );
}
