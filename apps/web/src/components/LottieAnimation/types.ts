interface LottieAnimationProps {
  animationData: LottieAnimationData;
}

interface LottieAnimationData {
  v: string;
  fr: number;
  ip: number;
  op: number;
  w: number;
  h: number;
  nm: string;
  ddd: number;
  assets: unknown[];
  layers: unknown[];
  [key: string]: unknown;
}

export type { LottieAnimationProps, LottieAnimationData };
