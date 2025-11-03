"use client";

import dynamic from "next/dynamic";
import type { LottieAnimationProps } from "./types";

const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

export default function LottieAnimation({
  animationData,
}: LottieAnimationProps) {
  if (!animationData) {
    return (
      <div className="h-full w-full animate-pulse rounded-lg bg-gray-100" />
    );
  }

  return (
    <Lottie
      animationData={animationData}
      className="h-full w-full object-cover"
      loop={true}
    />
  );
}
