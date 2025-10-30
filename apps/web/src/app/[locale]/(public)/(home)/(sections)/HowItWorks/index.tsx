import { MotionSection } from '@/lib/motion/motion-components';
import { Card, Carousel } from '@/components/ui/apple-cards-carousel';
import { getTranslations } from 'next-intl/server';
import { howItWorksData } from './data';

export async function HowItWorks() {
  const t = await getTranslations('Home.HowItWorks');
  const tSteps = await getTranslations('Home.HowItWorks.steps');

  const steps = howItWorksData.map(step => ({
    ...step,
    category: tSteps(step.categoryKey),
    title: tSteps(step.titleKey),
  }));

  const cards = steps.map((card, index) => <Card key={card.src} card={card} index={index} />);

  return (
    <MotionSection
      initial={{ opacity: 0, y: 35 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
      className="py-10"
      id="how-it-works"
    >
      <div className="container mx-auto px-4 lg:px-9">
        <h2 className="font-title_two text-primary text-center font-bold mb-4">{t('title')}</h2>
        <p className="font-body_one mx-auto text-center mb-8">{t('description')}</p>

        <Carousel items={cards} />
      </div>
    </MotionSection>
  );
}
