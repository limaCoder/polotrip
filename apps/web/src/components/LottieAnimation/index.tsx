'use client';

import Lottie from 'lottie-react';
import { LottieAnimationProps } from './types';

export default function LottieAnimation({ animationData }: LottieAnimationProps) {
  if (!animationData) {
    return <div className="w-full h-full bg-gray-100 animate-pulse rounded-lg" />;
  }

  return (
    <Lottie animationData={animationData} loop={true} className="w-full h-full object-cover" />
  );
}
