import { MotionDiv } from '@/lib/motion/motion-components';
import Image from 'next/image';

export function HeroPhotos() {
  return (
    <div className="flex flex-col justify-center items-center w-full h-full mt-10 relative">
      <MotionDiv
        initial={{ opacity: 0, y: 20, rotate: -2 }}
        animate={{
          opacity: 1,
          y: 0,
          rotate: 2,
        }}
        transition={{
          duration: 0.2,
          delay: 0.1,
          rotate: {
            duration: 6,
            repeat: Infinity,
            repeatType: 'reverse',
            ease: 'easeInOut',
          },
        }}
        className="absolute z-10 top-0 xl:top-0 xl:right-0"
      >
        <Image
          src="/pages/home/hero/hero-photo-1.jpg"
          alt="Polaroid de viagem"
          width={392.49}
          height={295.67}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority
        />
      </MotionDiv>

      <MotionDiv
        initial={{ opacity: 0, rotate: 15 }}
        animate={{
          opacity: 1,
          rotate: 12,
        }}
        transition={{
          duration: 0.2,
          delay: 0.3,
          rotate: {
            duration: 7,
            repeat: Infinity,
            repeatType: 'reverse',
            ease: 'easeInOut',
          },
        }}
        className="absolute z-20 top-60 xl:right-20 xl:bottom-70"
      >
        <Image
          src="/pages/home/hero/hero-photo-2.jpg"
          alt="Polaroid de viagem"
          width={432.91}
          height={325.12}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority
        />
      </MotionDiv>

      <MotionDiv
        initial={{ opacity: 0, rotate: 0 }}
        animate={{
          opacity: 1,
          rotate: -2,
        }}
        transition={{
          duration: 0.2,
          delay: 0.5,
          rotate: {
            duration: 8,
            repeat: Infinity,
            repeatType: 'reverse',
            ease: 'easeInOut',
          },
        }}
        className="absolute z-30 bottom-0 xl:right-0 xl:bottom-0"
      >
        <Image
          src="/pages/home/hero/hero-photo-3.jpg"
          alt="Polaroid de viagem"
          width={402.63}
          height={303.32}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority
        />
      </MotionDiv>
    </div>
  );
}
