"use client";

import { Loader2, Upload, X } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useUploadForm } from "@/app/[locale]/(private)/dashboard/album/[id]/upload/components/UploadForm/useUploadForm";
import { Button } from "@/components/Button";
import { formatFileSize } from "@/helpers/uploadHelpers";
import { cn } from "@/lib/cn";
import { CityUnscrambleGame } from "../CityUnscrambleGame";
import { LoadingGameWrapper } from "../LoadingGameWrapper";
import { MetadataDialog } from "../MetadataDialog";
import { UploadFormProcessWaiting } from "../UploadFormProcessWaiting";

export function UploadForm() {
  const t = useTranslations("UploadPage.form");

  const {
    uploadFormState,
    fileInputRef,
    isCompressingState,
    getTotalSize,
    uploadButtonDisabled,
    clearAllButtonDisabled,
    handleCompressProgress,
    removeFile,
    clearAll,
    handleUploadClick,
    handleKeepMetadata,
    handleRemoveMetadata,
    handleCloseMetadataDialog,
  } = useUploadForm();

  const selected_text =
    uploadFormState?.files?.length === 1
      ? t("selected_singular", { count: uploadFormState?.files?.length })
      : t("selected_plural", { count: uploadFormState?.files?.length });

  return (
    <div className="rounded-lg bg-card p-8 shadow">
      <h1 className="mb-2 font-bold font-title_three">{t("title")}</h1>
      <h2 className="mb-6 font-body_two text-text/75">{t("tip")}</h2>

      {uploadFormState?.error && (
        <div className="mb-4 rounded-md border border-red-200 bg-red-50 p-3 text-red-700">
          {uploadFormState?.error}
        </div>
      )}

      {isCompressingState || uploadFormState?.isUploading ? (
        <UploadFormProcessWaiting
          isCompressingState={isCompressingState}
          uploadFormState={uploadFormState}
        />
      ) : null}

      <div
        className={cn(
          "relative mb-6 flex h-[116px] flex-col items-center justify-center rounded-md border border-text/25 border-dashed p-3 text-center",
          uploadFormState?.isUploading ? "pointer-events-none opacity-50" : ""
        )}
      >
        <input
          accept="image/png, image/jpeg, image/jpg, image/heic, image/heif, image/heic-sequence"
          className="absolute inset-0 z-10 cursor-pointer opacity-0"
          disabled={uploadFormState?.isUploading}
          multiple
          onChange={(e) => handleCompressProgress(e.target.files)}
          ref={fileInputRef}
          type="file"
        />
        <Upload className="mb-2 text-text/25" size={24} />
        <p className="font-body_two text-sm">
          <span className="font-bold text-primary">{t("upload_prompt")}</span>
          <br />
          {t("drag_and_drop_prompt")}
        </p>
        <span className="mt-1 text-primary text-xs">
          {t("file_requirements")}
        </span>
      </div>

      {uploadFormState?.files?.length > 0 && (
        <>
          <div className="mb-6 flex items-center justify-between">
            <span className="font-body_two">{selected_text}</span>
            <span className="font-body_two">
              {formatFileSize(getTotalSize())}
            </span>
          </div>

          <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
            {uploadFormState?.files?.map((photo) => (
              <div
                className="group relative h-[300px] w-full overflow-hidden rounded md:h-[160px]"
                key={photo?.id}
              >
                <Image
                  alt={photo?.file?.name}
                  className="rounded-sm object-cover"
                  fill
                  src={photo?.preview}
                />
                {photo?.loading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                    <Loader2 className="animate-spin text-white" size={24} />
                  </div>
                )}
                {photo?.error && (
                  <div className="absolute inset-0 flex items-center justify-center bg-red-500/50">
                    <p className="p-2 text-center text-white text-xs">
                      {photo?.error}
                    </p>
                  </div>
                )}
                <button
                  aria-label={t("remove_photo_aria")}
                  className="absolute top-2 right-2 rounded-full bg-black/50 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100"
                  disabled={uploadFormState?.isUploading}
                  onClick={() => removeFile(photo?.id)}
                  type="button"
                >
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>
        </>
      )}

      {uploadFormState?.isUploading && (
        <div className="mb-6">
          <div className="mb-2 h-2 w-full rounded-full bg-gray-200">
            <div
              className="h-full rounded-full bg-primary transition-all duration-300 ease-in-out"
              style={{ width: `${uploadFormState?.progress}%` }}
            />
          </div>
          <p className="text-center text-sm">
            {t("upload_progress", { progress: uploadFormState?.progress })}
          </p>
        </div>
      )}

      <LoadingGameWrapper
        className="mb-6"
        isCompressing={isCompressingState}
        isUploading={uploadFormState?.isUploading}
      >
        <CityUnscrambleGame className="rounded-lg bg-card p-4 shadow-sm" />
      </LoadingGameWrapper>

      <div className="flex w-full justify-end gap-4">
        <Button
          aria-label={t("clear_all_button_aria")}
          className="rounded border border-text-opacity-25 px-4 font-bold hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-transparent dark:hover:bg-transparent dark:hover:brightness-75"
          disabled={clearAllButtonDisabled}
          onClick={clearAll}
          type="button"
        >
          {t("clear_all_button")}
        </Button>

        <Button
          aria-label={t("continue_button_aria")}
          className="rounded border border-text-opacity-25 bg-primary px-4 font-bold text-background hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
          disabled={uploadButtonDisabled}
          onClick={handleUploadClick}
          type="button"
        >
          {uploadFormState?.isUploading
            ? t("sending_button")
            : t("continue_button")}
        </Button>
      </div>

      <MetadataDialog
        isOpen={uploadFormState?.showMetadataDialog}
        onClose={handleCloseMetadataDialog}
        onKeepMetadata={handleKeepMetadata}
        onRemoveMetadata={handleRemoveMetadata}
      />
    </div>
  );
}
