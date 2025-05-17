'use client';

import { useLayoutEffect, useState } from 'react';

export function useAlbumShared() {
  const [isShared, setIsShared] = useState(false);

  useLayoutEffect(() => {
    const sharedAttr = document.querySelector('[data-is-shared]')?.getAttribute('data-is-shared');
    setIsShared(sharedAttr === 'true');
  }, []);

  return { isShared };
}
