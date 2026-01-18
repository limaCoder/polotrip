"use client";

import { format } from "date-fns";
import { CalendarIcon, Check } from "lucide-react";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { LocaleDateFnsEnum, LocaleTypesEnum } from "@/constants/localesEnum";
import { cn } from "@/lib/cn";
import { LocationAutocomplete } from "../LocationAutocomplete";
import type { PhotoEditFormProps } from "./types";
import { usePhotoEditForm } from "./use-photo-edit-form";

export function PhotoEditForm({
  selectedPhotos,
  onSave,
  onCancel,
  isDisabled = false,
  deselectAllPhotos,
}: PhotoEditFormProps) {
  const t = useTranslations("EditAlbum.PhotoEditForm");
  const { locale } = useParams();

  const dateLocale =
    LocaleDateFnsEnum[locale as keyof typeof LocaleDateFnsEnum] ||
    LocaleDateFnsEnum[LocaleTypesEnum.PT];

  const {
    form,
    onSubmit,
    selectionText,
    showSuccess,
    preserveFields,
    setPreserveFields,
    isMultipleSelection,
    isSaving,
  } = usePhotoEditForm({ selectedPhotos, onSave, deselectAllPhotos });

  const isDescriptionPreserveSwitchEnabled =
    isMultipleSelection && preserveFields?.description;

  return (
    <div
      className={cn(
        "rounded-lg bg-card p-8 shadow",
        isDisabled && "opacity-40"
      )}
    >
      <h2 className="mb-6 font-bold font-title_three">{selectionText}</h2>

      <Form {...form}>
        <form
          className="mb-4 flex flex-col gap-6"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <FormField
            control={form.control}
            name="dateTaken"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel className="font-body_two">
                  {t("date_label")}
                </FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        aria-label={t("select_date_aria")}
                        className={cn(
                          "justify-start border-neutral-400 text-left font-normal hover:bg-secondary-10",
                          !field.value && "text-muted-foreground"
                        )}
                        disabled={isDisabled}
                        variant="outline"
                      >
                        <CalendarIcon className="h-4 w-4 opacity-50" />
                        {field.value ? (
                          format(field.value, "PPP", { locale: dateLocale })
                        ) : (
                          <span>{t("select_date_placeholder")}</span>
                        )}
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent
                    align="start"
                    className="w-auto bg-secondary p-0"
                  >
                    <Calendar
                      disabled={(date) => date > new Date() || isDisabled}
                      initialFocus
                      mode="single"
                      onSelect={field.onChange}
                      selected={field.value || undefined}
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          {isMultipleSelection && (
            <div className="flex flex-col items-start justify-between gap-2 rounded-md border border-text/10 bg-secondary/5 p-3 lg:flex-row lg:items-center">
              <div className="flex flex-col">
                <Label className="font-body_two text-text/90">
                  {t("preserve_location_label")}
                </Label>
                <p className="mt-1 text-sm text-text/60">
                  {preserveFields?.location
                    ? t("preserve_location_description_true")
                    : t("preserve_location_description_false")}
                </p>
              </div>
              <Switch
                aria-label={t("preserve_location_aria")}
                checked={preserveFields?.location}
                onCheckedChange={() =>
                  setPreserveFields({
                    ...preserveFields,
                    location: !preserveFields?.location,
                  })
                }
              />
            </div>
          )}

          <FormField
            control={form.control}
            name="locationName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-body_two">
                  {t("location_label")}
                </FormLabel>
                <FormControl>
                  <LocationAutocomplete
                    disabled={
                      isDisabled ||
                      (isMultipleSelection && preserveFields?.location)
                    }
                    latitude={form.getValues("latitude")}
                    longitude={form.getValues("longitude")}
                    onChange={(value, latitude, longitude) => {
                      field.onChange(value);
                      form.setValue("latitude", latitude ?? null);
                      form.setValue("longitude", longitude ?? null);
                    }}
                    placeholder={
                      isMultipleSelection && preserveFields?.location
                        ? t("location_placeholder_preserved")
                        : t("location_placeholder")
                    }
                    value={field.value || ""}
                  />
                </FormControl>
                {isMultipleSelection && preserveFields?.location && (
                  <p className="mt-1 text-sm text-text/60">
                    {t("location_toggle_tip")}
                  </p>
                )}
                <FormMessage />
              </FormItem>
            )}
          />

          {isMultipleSelection && (
            <div className="flex flex-col items-start justify-between gap-2 rounded-md border border-text/10 bg-secondary/5 p-3 lg:flex-row lg:items-center">
              <div className="flex flex-col">
                <Label className="font-body_two text-text/90">
                  {t("preserve_description_label")}
                </Label>
                <p className="mt-1 text-sm text-text/60">
                  {preserveFields?.description
                    ? t("preserve_description_description_true")
                    : t("preserve_description_description_false")}
                </p>
              </div>
              <Switch
                aria-label={t("preserve_description_aria")}
                checked={preserveFields?.description}
                onCheckedChange={() =>
                  setPreserveFields({
                    ...preserveFields,
                    description: !preserveFields?.description,
                  })
                }
              />
            </div>
          )}

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-body_two">
                  {t("description_label")}
                </FormLabel>
                <FormControl>
                  <Textarea
                    className="mt-1 h-24 w-full resize-none rounded border border-text/25 bg-transparent p-3 font-body_two text-text/75 outline-none"
                    disabled={isDisabled || isDescriptionPreserveSwitchEnabled}
                    placeholder={
                      isDescriptionPreserveSwitchEnabled
                        ? t("description_placeholder_preserved")
                        : t("description_placeholder")
                    }
                    {...field}
                    value={field.value || ""}
                  />
                </FormControl>
                {isDescriptionPreserveSwitchEnabled && (
                  <p className="mt-1 text-sm text-text/60">
                    {t("description_toggle_tip")}
                  </p>
                )}
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end gap-2">
            {onCancel && (
              <Button
                aria-label={t("cancel_button_aria")}
                className="rounded bg-secondary-50 px-4 py-2 font-body_two text-text hover:bg-secondary-100"
                disabled={isDisabled || isSaving()}
                onClick={onCancel}
                type="button"
              >
                {t("cancel_button")}
              </Button>
            )}

            <Button
              aria-label={t("save_button_aria")}
              className={cn(
                "flex items-center gap-2 rounded px-6 py-2 font-body_two",
                showSuccess
                  ? "bg-green-500 text-white"
                  : "bg-primary hover:bg-primary/90"
              )}
              disabled={isDisabled || isSaving()}
              type="submit"
            >
              {showSuccess ? (
                <>
                  <Check size={18} />
                  {t("save_button_success")}
                </>
              ) : (
                t("save_button")
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
