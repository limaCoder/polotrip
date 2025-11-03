import { Check, Loader, Upload } from "lucide-react";
import type { UploadAreaContentProps } from "./types";

export function UploadAreaContent({
  isLoading,
  isPending,
  selectedImage,
  t,
}: UploadAreaContentProps) {
  if (isLoading) {
    return (
      <>
        <Loader className="mb-2 animate-spin text-primary" size={24} />
        <p className="font-body_two text-sm">
          <span className="font-bold text-primary">
            {isPending ? t("uploading_image") : t("updating_album")}
          </span>
        </p>
      </>
    );
  }

  if (selectedImage) {
    return (
      <>
        <Check className="mb-2 text-primary" size={24} />
        <p className="font-body_two text-sm">
          <span className="font-bold text-primary">{t("image_selected")}</span>
          <br />
          {t("change_image_prompt")}
        </p>
        <span className="mt-1 text-primary text-xs">{selectedImage?.name}</span>
      </>
    );
  }

  return (
    <>
      <Upload className="mb-2 text-text/25" size={24} />
      <p className="font-body_two text-sm">
        <span className="font-bold text-primary">{t("upload_prompt")}</span>
        <br />
        {t("drag_and_drop_prompt")}
      </p>
      <span className="mt-1 text-primary text-xs">
        {t("file_requirements")}
      </span>
    </>
  );
}
