const StepAfterPaymentEnum = {
  UPLOAD: "upload",
  ORGANIZE: "organize",
  PUBLISHED: "published",
} as const;

const AlbumStatusLabelEnum = {
  [StepAfterPaymentEnum.UPLOAD]: "Etapa de upload",
  [StepAfterPaymentEnum.ORGANIZE]: "Etapa de organização",
  [StepAfterPaymentEnum.PUBLISHED]: "Publicado",
} as const;

const AlbumStatusColorEnum = {
  [StepAfterPaymentEnum.UPLOAD]: "bg-yellow",
  [StepAfterPaymentEnum.ORGANIZE]: "bg-yellow",
  [StepAfterPaymentEnum.PUBLISHED]: "bg-primary",
} as const;

const AlbumStatusTextColorEnum = {
  [StepAfterPaymentEnum.UPLOAD]: "text-text dark:text-black",
  [StepAfterPaymentEnum.ORGANIZE]: "text-text dark:text-black",
  [StepAfterPaymentEnum.PUBLISHED]: "text-primary-foreground",
} as const;

const generateAlbumLink = (id: string, stepAfterPayment: string) => {
  const AlbumLinkEnum = {
    [StepAfterPaymentEnum.UPLOAD]: `/dashboard/album/${id}/upload`,
    [StepAfterPaymentEnum.ORGANIZE]: `/dashboard/album/${id}/edit-album`,
    [StepAfterPaymentEnum.PUBLISHED]: `/album/${id}`,
  } as const;

  return AlbumLinkEnum[stepAfterPayment as keyof typeof AlbumLinkEnum];
};

export {
  StepAfterPaymentEnum,
  generateAlbumLink,
  AlbumStatusLabelEnum,
  AlbumStatusColorEnum,
  AlbumStatusTextColorEnum,
};
