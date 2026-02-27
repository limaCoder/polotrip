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
      className="relative overflow-hidden rounded-2xl border border-white/10 bg-card/60 p-8 shadow-2xl backdrop-blur-xl lg:p-12"
    >
      <div className="pointer-events-none absolute inset-0 bg-linear-to-br from-white/5 to-transparent" />
      <div className="relative z-10">
        <h1 className="mb-8 font-title_three text-3xl text-foreground tracking-tight md:text-4xl">
          {t("title")}
        </h1>

        {formState?.hasError && (
          <div className="mb-4 flex items-start gap-2 rounded border border-red-200 bg-red-50 px-4 py-3 text-red-700">
            <AlertCircle className="mt-0.5 shrink-0" size={18} />
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
          <div className="flex flex-col gap-2">
            <label
              className="font-body_two font-medium text-foreground/80 text-sm"
              htmlFor="title"
            >
              {t("album_title_label")}
            </label>
            <input
              className="w-full rounded-xl border border-white/10 bg-background/50 p-4 font-body_two text-base shadow-inner backdrop-blur-md transition-all hover:bg-background/80 focus:border-primary/50 focus:bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
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

          <div className="flex flex-col gap-2">
            <label
              className="font-body_two font-medium text-foreground/80 text-sm"
              htmlFor="date"
            >
              {t("trip_date_label")}
            </label>
            <MonthPicker
              className="w-full rounded-xl border border-white/10 bg-background/50 p-4 font-body_two text-base shadow-inner backdrop-blur-md transition-all hover:bg-background/80 focus:border-primary/50 focus:bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
              name="date"
              placeholder={t("trip_date_placeholder")}
            />
            {formState?.hasInvalidData && formState?.dateError && (
              <p className="text-red-500 text-sm">{t("trip_date_error")}</p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label
              className="font-body_two font-medium text-foreground/80 text-sm"
              htmlFor="description"
            >
              {t("description_label")}
            </label>
            <textarea
              className="h-32 w-full resize-none rounded-xl border border-white/10 bg-background/50 p-4 font-body_two text-base shadow-inner backdrop-blur-md transition-all hover:bg-background/80 focus:border-primary/50 focus:bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
              id="description"
              name="description"
              onFocus={handleTextInputFocus}
              placeholder={t("description_placeholder")}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label
              className="font-body_two font-medium text-foreground/80 text-sm"
              htmlFor="cover"
            >
              {t("cover_label")}
            </label>
            <div
              className={cn(
                "group relative flex min-h-[160px] flex-col items-center justify-center overflow-hidden rounded-xl border-2 border-dashed p-6 text-center transition-all duration-300",
                selectedImage
                  ? "border-primary/50 bg-primary/5 shadow-[0_0_30px_-10px_rgba(var(--primary),0.3)]"
                  : "border-border/50 bg-background/30 hover:border-primary/30 hover:bg-background/50"
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
            <div className="mt-2 rounded-lg bg-secondary/10 p-3">
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

          <div className="flex flex-col gap-2">
            <label
              className="font-body_two font-medium text-foreground/80 text-sm"
              htmlFor="plan"
            >
              {t("plan_label")}
            </label>
            <Select
              name="plan"
              onValueChange={handlePlanChange}
              value={selectedPlan}
            >
              <SelectTrigger className="w-full rounded-xl border border-white/10 bg-background/50 p-4 font-body_two text-base shadow-inner backdrop-blur-md transition-all hover:bg-background/80 focus:border-primary/50 focus:bg-background focus:outline-none focus:ring-2 focus:ring-primary/20">
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

        <hr className="my-8 border-border/50" />

        <div className="mb-8 flex flex-col items-start rounded-xl border border-white/5 bg-secondary/10 p-6 backdrop-blur-sm">
          <h2 className="mb-4 font-body_two font-bold text-primary/80 text-sm uppercase tracking-wider">
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
            className="group hover:-translate-y-0.5 relative flex w-full items-center justify-center gap-3 overflow-hidden rounded-xl bg-primary p-4 text-primary-foreground shadow-lg transition-all hover:bg-primary/90 hover:shadow-primary/25"
            disabled={isPending}
            type="submit"
          >
            <div className="absolute inset-0 bg-white/20 opacity-0 transition-opacity group-hover:opacity-10" />
            {isPending ? (
              <>
                <Loader className="animate-spin" size={20} />
                <span className="font-bold tracking-wide">
                  {t("processing_button")}
                </span>
              </>
            ) : (
              <>
                <CreditCard size={20} />
                <span className="font-bold tracking-wide">
                  {t("pay_with_card_button")}
                </span>
              </>
            )}
          </Button>

          {/* <Button className="flex items-center justify-center gap-3 rounded bg-primary p-3 text-background">
          <QrCode color="#F7FCFD" size={20} />
          <span>Pagar com Pix</span>
        </Button> */}
        </div>
      </div>
    </form>
  );
}
