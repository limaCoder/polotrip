const StepAfterPaymentEnum = {
  UPLOAD: 'upload',
  ORGANIZE: 'organize',
  PUBLISHED: 'published',
} as const;

const AlbumStatusLabelEnum = {
  [StepAfterPaymentEnum.UPLOAD]: 'Etapa de upload',
  [StepAfterPaymentEnum.ORGANIZE]: 'Etapa de organização',
  [StepAfterPaymentEnum.PUBLISHED]: 'Publicado',
} as const;

const AlbumStatusColorEnum = {
  [StepAfterPaymentEnum.UPLOAD]: 'bg-yellow',
  [StepAfterPaymentEnum.ORGANIZE]: 'bg-yellow',
  [StepAfterPaymentEnum.PUBLISHED]: 'bg-primary',
} as const;

const AlbumStatusTextColorEnum = {
  [StepAfterPaymentEnum.UPLOAD]: 'text-text',
  [StepAfterPaymentEnum.ORGANIZE]: 'text-text',
  [StepAfterPaymentEnum.PUBLISHED]: 'text-background',
} as const;

const generateAlbumLink = (id: string, stepAfterPayment: string, locale = 'pt') => {
  const AlbumLinkEnum = {
    [StepAfterPaymentEnum.UPLOAD]: `/${locale}/dashboard/album/${id}/upload`,
    [StepAfterPaymentEnum.ORGANIZE]: `/${locale}/dashboard/album/${id}/edit-album`,
    [StepAfterPaymentEnum.PUBLISHED]: `/${locale}/album/${id}`,
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
