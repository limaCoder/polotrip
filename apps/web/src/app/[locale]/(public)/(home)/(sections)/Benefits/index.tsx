import { benefits } from './data';
import { MotionSection } from '@/lib/motion/motion-components';

export async function Benefits() {
  return (
    <MotionSection
      initial={{ opacity: 0, y: 35 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
      className="py-10 bg-secondary-10 lg:bg-background"
    >
      <div className="container mx-auto px-4 lg:px-9">
        <h2 className="font-title_two text-primary text-center font-bold mb-12">
          Por que escolher o Polotrip?
        </h2>

        <div className="flex flex-col justify-center items-center lg:flex-row gap-8 px-4 md:px-9">
          {benefits.map(benefit => (
            <div
              key={benefit.id}
              className="w-[265px] min-h-[250px] flex flex-col items-center lg:items-start"
            >
              <div className="text-primary bg-secondary-50 w-12 h-12 justify-center flex items-center rounded-full">
                {benefit.icon}
              </div>
              <h3 className="font-title_three mt-5 font-semibold text-center lg:text-start">
                {benefit.title}
              </h3>
              <p className="font-body_one mt-6 text-center lg:text-start">{benefit.description}</p>
            </div>
          ))}
        </div>
      </div>
    </MotionSection>
  );
}
