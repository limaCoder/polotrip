"use client";

import { AlertCircle, Check, CreditCard, Loader, Upload } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { Button } from "@/components/Button";
import { MonthPicker } from "@/components/MonthPicker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { usePostHog } from "@/hooks/usePostHog";
import { cn } from "@/lib/cn";
import { formatCurrency } from "@/utils/formatCurrency";
import { getPlanName, getPlanPhotoLimit } from "@/utils/getAlbumPrice";
import { useAlbumForm } from "./use-album-form";

export function AlbumForm() {
  const t = useTranslations("CreateAlbum.form");
  const tPlanNames = useTranslations("PlanNames");
  const { capture } = usePostHog();
  const [hasInteractedWithText, setHasInteractedWithText] = useState(false);

  const {
    formState,
    albumPrice,
    handleImageChange,
    formAction,
    isPending,
    selectedImage,
    locale,
    selectedPlan,
    handlePlanChange,
  } = useAlbumForm();

  const handleTextInputFocus = () => {
    if (!hasInteractedWithText) {
      setHasInteractedWithText(true);
      capture("album_form_started", {
        plan: selectedPlan,
      });
    }
  };

  const handleFormSubmit = (formData: FormData) => {
    capture("album_form_submitted", {
      plan: selectedPlan,
      price: albumPrice,
      has_cover_image: selectedImage !== null,
      has_description: !!formData.get("description"),
    });
    formAction(formData);
  };

  return (
    <form
      action={handleFormSubmit}
      className="rounded-lg bg-background p-8 shadow-md"
    >
      <h1 className="mb-6 font-bold font-title_three">{t("title")}</h1>

      {formState?.hasError && (
        <div className="mb-4 flex items-start gap-2 rounded border border-red-200 bg-red-50 px-4 py-3 text-red-700">
          <AlertCircle className="mt-0.5 flex-shrink-0" size={18} />
          <div>
            <p className="font-body_two font-bold">{t("error_title")}</p>
            <p className="text-sm">{formState?.errorMessage}</p>
            {formState?.titleError && (
              <p className="mt-1 text-sm">
                {t("error_field_title")}: {formState?.titleError?.join(", ")}
              </p>
            )}
            {formState?.dateError && (
              <p className="mt-1 text-sm">
                {t("error_field_date")}: {formState?.dateError?.join(", ")}
              </p>
            )}
            {formState?.descriptionError && (
              <p className="text-sm">
                {t("error_field_description")}:{" "}
                {formState?.descriptionError?.join(", ")}
              </p>
            )}
            {formState?.coverImageError && (
              <p className="text-sm">
                {t("error_field_cover_image")}:{" "}
                {formState?.coverImageError?.join(", ")}
              </p>
            )}
          </div>
        </div>
      )}

      <div className="mb-6 space-y-4">
        <div className="flex flex-col gap-1">
          <label className="font-body_two" htmlFor="title">
            {t("album_title_label")}
          </label>
          <input
            className="rounded border border-text/25 p-3 font-body_two text-sm"
            id="title"
            name="title"
            onFocus={handleTextInputFocus}
            placeholder={t("album_title_placeholder")}
            type="text"
          />
          {formState?.hasInvalidData && formState?.titleError && (
            <p className="text-red-500 text-sm">{t("album_title_error")}</p>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label className="font-body_two" htmlFor="date">
            {t("trip_date_label")}
          </label>
          <MonthPicker
            className="rounded border border-text/25 p-3 font-body_two text-sm"
            name="date"
            placeholder={t("trip_date_placeholder")}
          />
          {formState?.hasInvalidData && formState?.dateError && (
            <p className="text-red-500 text-sm">{t("trip_date_error")}</p>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label className="font-body_two" htmlFor="description">
            {t("description_label")}
          </label>
          <textarea
            className="h-24 rounded border border-text/25 p-3 font-body_two text-sm"
            id="description"
            name="description"
            onFocus={handleTextInputFocus}
            placeholder={t("description_placeholder")}
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="font-body_two" htmlFor="cover">
            {t("cover_label")}
          </label>
          <div
            className={cn(
              "relative flex h-[116px] flex-col items-center justify-center rounded border border-dashed p-3 text-center",
              selectedImage ? "border-primary" : "border-text/25"
            )}
          >
            <input
              accept="image/png, image/jpeg, image/jpg"
              className="absolute inset-0 z-10 cursor-pointer opacity-0"
              id="cover"
              name="cover"
              onChange={handleImageChange}
              type="file"
            />
            {selectedImage ? (
              <>
                <Check className="mb-2 text-primary" size={24} />
                <p className="font-body_two text-sm">
                  <span className="font-bold text-primary">
                    {t("cover_selected_success")}
                  </span>
                  <br />
                  {t("cover_selected_instruction")}
                </p>
                <span className="mt-1 text-primary text-xs">
                  {selectedImage?.name}
                </span>
              </>
            ) : (
              <>
                <Upload className="mb-2 text-text/25" size={24} />
                <p className="font-body_two text-sm">
                  <span className="font-bold text-primary">
                    {t("cover_upload_prompt")}
                  </span>
                  <br />
                  {t("cover_upload_instruction")}
                </p>
                <span className="mt-1 text-primary text-xs">
                  {t("cover_upload_requirements")}
                </span>
              </>
            )}
          </div>
          <div className="mt-2 rounded-lg bg-secondary/5 p-3">
            <p className="mb-2 font-body_two text-sm">
              {t("cover_recommendations_title")}
            </p>
            <div className="flex flex-col items-center gap-3 lg:flex-row">
              <div className="flex h-[68px] w-[120px] items-center justify-center rounded border border-primary/30 border-dashed bg-secondary/20">
                <span className="text-[10px] text-primary/70">
                  {t("cover_recommendations_size")}
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <p className="text-sm text-text/70">
                  {t("cover_recommendations_format")}
                </p>
                <p className="text-sm text-text/70">
                  {t("cover_recommendations_resolution")}
                </p>
                <p className="text-sm text-text/70">
                  {t("cover_recommendations_text")}
                </p>
              </div>
            </div>
          </div>
          {formState?.hasInvalidData && formState?.coverImageError && (
            <p className="text-red-500 text-sm">
              {formState?.coverImageError?.join(", ")}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label className="font-body_two" htmlFor="plan">
            {t("plan_label")}
          </label>
          <Select
            name="plan"
            onValueChange={handlePlanChange}
            value={selectedPlan}
          >
            <SelectTrigger className="rounded border border-text/25 p-3 font-body_two text-sm">
              <SelectValue placeholder={t("plan_placeholder")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="basic">{t("plan_basic")}</SelectItem>
              <SelectItem value="standard">{t("plan_standard")}</SelectItem>
              <SelectItem value="premium">{t("plan_premium")}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <hr className="my-6 border-text/25" />

      <div className="mb-6 flex flex-col items-start rounded-lg bg-secondary/5 p-6">
        <h2 className="mb-6 font-body_one font-bold text-primary">
          {t("order_summary_title")}
        </h2>

        <div className="flex w-full justify-between">
          <div>
            <h3 className="font-body_two font-bold">
              {t("order_summary_album_creation", {
                planName: getPlanName(selectedPlan, tPlanNames),
              })}
            </h3>
            <p className="text-xs">
              {t("order_summary_description", {
                photoLimit: getPlanPhotoLimit(selectedPlan),
              })}
            </p>
          </div>
          <span className="font-body_two text-primary">
            {formatCurrency(locale as string, albumPrice)}
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <Button
          aria-label={t("pay_with_card_button_aria")}
          className="flex items-center justify-center gap-3 rounded bg-primary p-3 text-background"
          disabled={isPending}
          type="submit"
        >
          {isPending ? (
            <>
              <Loader className="animate-spin" color="#F7FCFD" size={20} />
              <span>{t("processing_button")}</span>
            </>
          ) : (
            <>
              <CreditCard color="#F7FCFD" size={20} />
              <span>{t("pay_with_card_button")}</span>
            </>
          )}
        </Button>

        {/* TO-DO: Implement payment with Pix */}
        {/* <Button className="bg-primary text-background p-3 flex items-center justify-center gap-3 rounded">
          <QrCode size={20} color="#F7FCFD" />
          <span>Pagar com Pix</span>
        </Button> */}
      </div>
    </form>
  );
}
