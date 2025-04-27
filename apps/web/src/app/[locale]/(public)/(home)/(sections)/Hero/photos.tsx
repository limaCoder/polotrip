'use client';

import Image from 'next/image';
import { MotionDiv } from '@/lib/motion/motion-components';

export function HeroPhotos() {
  return (
    <div className="flex justify-center lg:justify-end items-center w-full h-full mt-12 lg:mt-8 relative">
      <MotionDiv
        initial={{ y: 0 }}
        animate={{ y: [0, -10, 0] }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        <Image
          src="/pages/home/hero/hero-photos.png"
          alt="Polaroid de viagem"
          width={480}
          height={700}
          sizes="(max-width: 768px) 80vw"
          priority
          className="object-contain max-h-[600px] lg:max-h-[500px] xl:max-h-[600px]"
        />
      </MotionDiv>
    </div>
  );
}
