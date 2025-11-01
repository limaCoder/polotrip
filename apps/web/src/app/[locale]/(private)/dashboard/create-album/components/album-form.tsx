'use client';

import { Upload, CreditCard, Loader, AlertCircle, Check } from 'lucide-react';

import { Button } from '@/components/Button';
import { cn } from '@/lib/cn';
import { formatCurrency } from '@/utils/formatCurrency';
import { MonthPicker } from '@/components/MonthPicker';
import { useAlbumForm } from './use-album-form';
import { getPlanName, getPlanPhotoLimit } from '@/utils/getAlbumPrice';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useTranslations } from 'next-intl';
import { usePostHog } from '@/hooks/usePostHog';
import { useState } from 'react';

export function AlbumForm() {
  const t = useTranslations('CreateAlbum.form');
  const tPlanNames = useTranslations('PlanNames');
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
      capture('album_form_started', {
        plan: selectedPlan,
      });
    }
  };

  const handleFormSubmit = (formData: FormData) => {
    capture('album_form_submitted', {
      plan: selectedPlan,
      price: albumPrice,
      has_cover_image: selectedImage !== null,
      has_description: !!formData.get('description'),
    });
    formAction(formData);
  };

  return (
    <form action={handleFormSubmit} className="bg-background p-8 rounded-lg shadow-md">
      <h1 className="font-title_three mb-6 font-bold">{t('title')}</h1>

      {formState?.hasError && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4 flex items-start gap-2">
          <AlertCircle size={18} className="mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-body_two font-bold">{t('error_title')}</p>
            <p className="text-sm">{formState?.errorMessage}</p>
            {formState?.titleError && (
              <p className="text-sm mt-1">
                {t('error_field_title')}: {formState?.titleError?.join(', ')}
              </p>
            )}
            {formState?.dateError && (
              <p className="text-sm mt-1">
                {t('error_field_date')}: {formState?.dateError?.join(', ')}
              </p>
            )}
            {formState?.descriptionError && (
              <p className="text-sm">
                {t('error_field_description')}: {formState?.descriptionError?.join(', ')}
              </p>
            )}
            {formState?.coverImageError && (
              <p className="text-sm">
                {t('error_field_cover_image')}: {formState?.coverImageError?.join(', ')}
              </p>
            )}
          </div>
        </div>
      )}

      <div className="space-y-4 mb-6">
        <div className="flex flex-col gap-1">
          <label htmlFor="title" className="font-body_two">
            {t('album_title_label')}
          </label>
          <input
            id="title"
            name="title"
            type="text"
            placeholder={t('album_title_placeholder')}
            className="border border-text/25 rounded p-3 font-body_two text-sm"
            onFocus={handleTextInputFocus}
          />
          {formState?.hasInvalidData && formState?.titleError && (
            <p className="text-sm text-red-500">{t('album_title_error')}</p>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="date" className="font-body_two">
            {t('trip_date_label')}
          </label>
          <MonthPicker
            className="border border-text/25 rounded p-3 font-body_two text-sm"
            name="date"
            placeholder={t('trip_date_placeholder')}
          />
          {formState?.hasInvalidData && formState?.dateError && (
            <p className="text-sm text-red-500">{t('trip_date_error')}</p>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="description" className="font-body_two">
            {t('description_label')}
          </label>
          <textarea
            id="description"
            name="description"
            placeholder={t('description_placeholder')}
            className="border border-text/25 rounded p-3 h-24 font-body_two text-sm"
            onFocus={handleTextInputFocus}
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="cover" className="font-body_two">
            {t('cover_label')}
          </label>
          <div
            className={cn(
              'border border-dashed rounded p-3 h-[116px] flex flex-col items-center justify-center text-center relative',
              selectedImage ? 'border-primary' : 'border-text/25',
            )}
          >
            <input
              type="file"
              id="cover"
              name="cover"
              accept="image/png, image/jpeg, image/jpg"
              className="absolute inset-0 opacity-0 cursor-pointer z-10"
              onChange={handleImageChange}
            />
            {selectedImage ? (
              <>
                <Check size={24} className="text-primary mb-2" />
                <p className="font-body_two text-sm">
                  <span className="text-primary font-bold">{t('cover_selected_success')}</span>
                  <br />
                  {t('cover_selected_instruction')}
                </p>
                <span className="text-primary text-xs mt-1">{selectedImage?.name}</span>
              </>
            ) : (
              <>
                <Upload size={24} className="text-text/25 mb-2" />
                <p className="font-body_two text-sm">
                  <span className="text-primary font-bold">{t('cover_upload_prompt')}</span>
                  <br />
                  {t('cover_upload_instruction')}
                </p>
                <span className="text-primary text-xs mt-1">{t('cover_upload_requirements')}</span>
              </>
            )}
          </div>
          <div className="mt-2 p-3 bg-secondary/5 rounded-lg">
            <p className="text-sm font-body_two mb-2">{t('cover_recommendations_title')}</p>
            <div className="flex flex-col lg:flex-row items-center gap-3">
              <div className="w-[120px] h-[68px] bg-secondary/20 rounded flex items-center justify-center border border-dashed border-primary/30">
                <span className="text-[10px] text-primary/70">
                  {t('cover_recommendations_size')}
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <p className="text-sm text-text/70">{t('cover_recommendations_format')}</p>
                <p className="text-sm text-text/70">{t('cover_recommendations_resolution')}</p>
                <p className="text-sm text-text/70">{t('cover_recommendations_text')}</p>
              </div>
            </div>
          </div>
          {formState?.hasInvalidData && formState?.coverImageError && (
            <p className="text-sm text-red-500">{formState?.coverImageError?.join(', ')}</p>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="plan" className="font-body_two">
            {t('plan_label')}
          </label>
          <Select name="plan" value={selectedPlan} onValueChange={handlePlanChange}>
            <SelectTrigger className="border border-text/25 rounded p-3 font-body_two text-sm">
              <SelectValue placeholder={t('plan_placeholder')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="basic">{t('plan_basic')}</SelectItem>
              <SelectItem value="standard">{t('plan_standard')}</SelectItem>
              <SelectItem value="premium">{t('plan_premium')}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <hr className="border-text/25 my-6" />

      <div className="flex flex-col items-start bg-secondary/5 p-6 rounded-lg mb-6">
        <h2 className="font-body_one font-bold text-primary mb-6">{t('order_summary_title')}</h2>

        <div className="w-full flex justify-between">
          <div>
            <h3 className="font-body_two font-bold">
              {t('order_summary_album_creation', {
                planName: getPlanName(selectedPlan, tPlanNames),
              })}
            </h3>
            <p className="text-xs">
              {t('order_summary_description', {
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
          type="submit"
          disabled={isPending}
          className="bg-primary text-background p-3 flex items-center justify-center gap-3 rounded"
          aria-label={t('pay_with_card_button_aria')}
        >
          {isPending ? (
            <>
              <Loader size={20} className="animate-spin" color="#F7FCFD" />
              <span>{t('processing_button')}</span>
            </>
          ) : (
            <>
              <CreditCard size={20} color="#F7FCFD" />
              <span>{t('pay_with_card_button')}</span>
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
