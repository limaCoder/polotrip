'use client';

import { useLayoutEffect, useState } from 'react';

export function useAlbumOwnership() {
  const [isOwner, setIsOwner] = useState(false);

  useLayoutEffect(() => {
    const ownerAttr = document.querySelector('[data-is-owner]')?.getAttribute('data-is-owner');
    setIsOwner(ownerAttr === 'true');
  }, []);

  return { isOwner };
}
