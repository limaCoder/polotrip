"use client";

import { AlbumOwnerTopBar } from "../AlbumOwnerTopBar";
import { AlbumSharedTopBar } from "../AlbumSharedTopBar";

type AlbumTopBarsProps = {
  isOwner: boolean;
  isShared: boolean;
};

export function AlbumTopBars({ isOwner, isShared }: AlbumTopBarsProps) {
  return (
    <>
      {isOwner && <AlbumOwnerTopBar />}
      {isShared && <AlbumSharedTopBar />}
    </>
  );
}
