import { MotionSection } from '@/lib/motion/motion-components';
import { steps } from './data';
import { Card, Carousel } from '@/components/ui/apple-cards-carousel';

export async function HowItWorks() {
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
        <h2 className="font-title_two text-primary text-center font-bold mb-4">Como funciona?</h2>
        <p className="font-body_one mx-auto text-center mb-8">
          Criar e compartilhar suas memórias de viagem nunca foi tão fácil. Siga estes simples
          passos para começar.
        </p>

        <Carousel items={cards} />
      </div>
    </MotionSection>
  );
}
