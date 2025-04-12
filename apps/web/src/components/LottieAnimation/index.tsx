'use client';

import dynamic from 'next/dynamic';
import { LottieAnimationProps } from './types';

const Lottie = dynamic(() => import('lottie-react'), { ssr: false });

export default function LottieAnimation({ animationData }: LottieAnimationProps) {
  if (!animationData) {
    return <div className="w-full h-full bg-gray-100 animate-pulse rounded-lg" />;
  }

  return (
    <Lottie animationData={animationData} loop={true} className="w-full h-full object-cover" />
  );
}
