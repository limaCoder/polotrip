interface ScreenOrientationWithLock extends ScreenOrientation {
  lock?: (orientation: string) => Promise<void>;
}

export type { ScreenOrientationWithLock };
