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
    <div className="rounded-2xl border border-background/60 bg-background/70 p-8 shadow-2xl backdrop-blur-xl transition-all duration-500">
      <h1 className="mb-2 bg-linear-to-r from-primary to-blue-600 bg-clip-text font-bold font-title_three text-transparent drop-shadow-sm">
        {t("title")}
      </h1>
      <h2 className="mb-8 font-body_two text-text/75">{t("tip")}</h2>

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
          "group relative mb-8 flex h-[160px] flex-col items-center justify-center rounded-xl border-2 border-primary/30 border-dashed bg-primary/5 p-4 text-center transition-all duration-300 hover:border-primary hover:bg-primary/10 hover:shadow-[0_0_30px_-5px_var(--tw-shadow-color)] hover:shadow-primary/20",
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
        <div className="mb-3 rounded-full bg-primary/10 p-3 text-primary transition-transform duration-300 group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground">
          <Upload size={28} />
        </div>
        <p className="font-body_two text-sm text-text/80">
          <span className="font-bold text-primary transition-colors group-hover:text-primary/80">
            {t("upload_prompt")}
          </span>
          <br />
          {t("drag_and_drop_prompt")}
        </p>
        <span className="mt-2 font-medium text-primary/70 text-xs">
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

          <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {uploadFormState?.files?.map((photo, index) => (
              <div
                className="group fade-in zoom-in relative h-[300px] w-full animate-in overflow-hidden rounded-xl border border-white/20 shadow-sm transition-all duration-500 hover:shadow-md md:h-[180px]"
                key={photo?.id}
                style={{
                  animationDelay: `${index * 50}ms`,
                  animationFillMode: "both",
                }}
              >
                <Image
                  alt={photo?.file?.name}
                  className="rounded-xl object-cover transition-transform duration-700 group-hover:scale-105"
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
                <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <button
                  aria-label={t("remove_photo_aria")}
                  className="absolute top-3 right-3 rounded-full bg-black/40 p-1.5 text-white opacity-0 backdrop-blur-md transition-all duration-300 hover:scale-110 hover:bg-red-500 hover:shadow-[0_0_15px_rgba(239,68,68,0.5)] group-hover:opacity-100"
                  disabled={uploadFormState?.isUploading}
                  onClick={() => removeFile(photo?.id)}
                  type="button"
                >
                  <X size={16} strokeWidth={2.5} />
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

      <div className="mt-8 flex w-full justify-end gap-4">
        <Button
          aria-label={t("clear_all_button_aria")}
          className="rounded-xl border border-text/10 bg-background/80 px-6 font-bold text-text/80 shadow-sm backdrop-blur-sm transition-all duration-300 hover:bg-white hover:shadow disabled:cursor-not-allowed disabled:opacity-50"
          disabled={clearAllButtonDisabled}
          onClick={clearAll}
          type="button"
        >
          {t("clear_all_button")}
        </Button>

        <Button
          aria-label={t("continue_button_aria")}
          className="hover:-translate-y-0.5 rounded-xl bg-linear-to-r from-primary to-blue-600 px-8 font-bold text-text shadow-[0_4px_14px_0_rgba(var(--primary-rgb),0.39)] transition-all duration-300 hover:shadow-[0_6px_20px_rgba(var(--primary-rgb),0.23)] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0 dark:text-white"
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
