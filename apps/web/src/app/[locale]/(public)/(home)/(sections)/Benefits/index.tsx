import { MotionSection } from '@/lib/motion/motion-components';
import { BenefitsCarousel } from './carousel';

export function Benefits() {
  return (
    <MotionSection
      initial={{ opacity: 0, y: 35 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
      className="py-8 lg:py-16 bg-secondary-10 lg:bg-background"
    >
      <div className="container mx-auto px-4 lg:px-9">
        <h2 className="font-title_two text-primary text-center font-bold mb-4 md:mb-12">
          Por que escolher o Polotrip?
        </h2>

        <BenefitsCarousel />

        <p className="md:mt-12 text-center text-sm max-w-2xl mx-auto text-gray-600 mt-4">
          Diferente de soluções convencionais de armazenamento, o Polotrip foi projetado
          exclusivamente para criar e compartilhar memórias de viagens da maneira que você sempre
          quis.
        </p>
      </div>
    </MotionSection>
  );
}
