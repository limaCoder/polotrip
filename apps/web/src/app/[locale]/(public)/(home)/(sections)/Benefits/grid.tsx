import { MotionDiv } from '@/lib/motion/motion-components';
import { benefits } from './data';

export function BenefitsGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {benefits.map((benefit, index) => (
        <MotionDiv
          key={benefit.id}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.1, duration: 0.4 }}
          className="bg-white rounded-xl p-6 shadow hover:shadow-lg transition"
        >
          <div className="w-12 h-12 bg-secondary-50 text-primary rounded-full flex justify-center items-center">
            {benefit.icon}
          </div>
          <h3 className="mt-4 font-semibold text-lg">{benefit.title}</h3>
          <p className="text-gray-600 mt-2 text-sm">{benefit.description}</p>
        </MotionDiv>
      ))}
    </div>
  );
}
