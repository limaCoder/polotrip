"use client";

import Image from "next/image";
import { MotionDiv } from "@/lib/motion/motion-components";

export function HeroPhotos() {
  return (
    <div className="relative mt-12 flex h-full w-full items-center justify-center lg:mt-8 lg:justify-end">
      <MotionDiv
        animate={{ y: [0, -10, 0], rotate: [-2, 2, -2] }}
        className="drop-shadow-2xl"
        initial={{ y: 0, rotate: -2 }}
        transition={{
          duration: 4,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      >
        <Image
          alt="Polaroid de viagem"
          className="max-h-[600px] object-contain lg:max-h-[500px] xl:max-h-[600px]"
          height={700}
          priority
          sizes="(max-width: 768px) 80vw"
          src="/pages/home/hero/hero-photos.png"
          width={480}
        />
      </MotionDiv>
    </div>
  );
}
