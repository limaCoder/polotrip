import { getTranslations } from "next-intl/server";
import { z } from "zod";

const DATE_REGEX = /^\d{4}-\d{2}(-\d{2})?$/;

export const getAlbumFormSchema = async (
  locale: string
): Promise<
  z.ZodObject<{
    title: z.ZodString;
    date: z.ZodString;
    description: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    coverImage: z.ZodNullable<
      z.ZodOptional<
        z.ZodEffects<
          z.ZodEffects<z.ZodType<File, z.ZodTypeDef, File>, File, File>,
          File,
          File
        >
      >
    >;
  }>
> => {
  const t = await getTranslations({ locale, namespace: "AlbumSchema" });

  return z.object({
    title: z
      .string()
      .min(3, { message: t("title_min") })
      .max(255, { message: t("title_max") }),
    date: z
      .string()
      .min(1, { message: t("date_required") })
      .regex(DATE_REGEX, {
        message: t("date_invalid"),
      }),
    description: z
      .string()
      .max(1000, { message: t("description_max") })
      .optional()
      .nullable(),
    coverImage: z
      .instanceof(File)
      .refine((file) => file.size <= 5 * 1024 * 1024, {
        message: t("cover_image_size"),
      })
      .refine(
        (file) => ["image/png", "image/jpeg", "image/jpg"].includes(file.type),
        {
          message: t("cover_image_type"),
        }
      )
      .optional()
      .nullable(),
  });
};

export type AlbumFormData = z.infer<
  Awaited<ReturnType<typeof getAlbumFormSchema>>
>;
