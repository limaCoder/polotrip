'use client';

import { Check, CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/cn';

import { format } from 'date-fns';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { LocationAutocomplete } from '../LocationAutocomplete';

import { usePhotoEditForm } from './use-photo-edit-form';
import { PhotoEditFormProps } from './types';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { LocaleDateFnsEnum, LocaleTypesEnum } from '@/constants/localesEnum';

export function PhotoEditForm({
  selectedPhotos,
  onSave,
  onCancel,
  isDisabled = false,
  deselectAllPhotos,
}: PhotoEditFormProps) {
  const t = useTranslations('EditAlbum.PhotoEditForm');
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

  const isDescriptionPreserveSwitchEnabled = isMultipleSelection && preserveFields?.description;

  return (
    <div className={cn('bg-background p-8 rounded-lg shadow-md', isDisabled && 'opacity-40')}>
      <h2 className="font-title_three font-bold mb-6">{selectionText}</h2>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6 mb-4">
          <FormField
            control={form.control}
            name="dateTaken"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel className="font-body_two">{t('date_label')}</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        disabled={isDisabled}
                        variant="outline"
                        className={cn(
                          'text-left font-normal justify-start border-neutral-400 hover:bg-secondary-10',
                          !field.value && 'text-muted-foreground',
                        )}
                        aria-label={t('select_date_aria')}
                      >
                        <CalendarIcon className="h-4 w-4 opacity-50" />
                        {field.value ? (
                          format(field.value, 'PPP', { locale: dateLocale })
                        ) : (
                          <span>{t('select_date_placeholder')}</span>
                        )}
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 bg-secondary" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value || undefined}
                      onSelect={field.onChange}
                      disabled={date => date > new Date() || isDisabled}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          {isMultipleSelection && (
            <div className="flex flex-col lg:flex-row items-start lg:items-center gap-2 justify-between border border-text/10 rounded-md p-3 bg-secondary/5">
              <div className="flex flex-col">
                <Label className="font-body_two text-text/90">{t('preserve_location_label')}</Label>
                <p className="text-sm text-text/60 mt-1">
                  {preserveFields?.location
                    ? t('preserve_location_description_true')
                    : t('preserve_location_description_false')}
                </p>
              </div>
              <Switch
                checked={preserveFields?.location}
                onCheckedChange={() =>
                  setPreserveFields({ ...preserveFields, location: !preserveFields?.location })
                }
                aria-label={t('preserve_location_aria')}
              />
            </div>
          )}

          <FormField
            control={form.control}
            name="locationName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-body_two">{t('location_label')}</FormLabel>
                <FormControl>
                  <LocationAutocomplete
                    value={field.value || ''}
                    latitude={form.getValues('latitude')}
                    longitude={form.getValues('longitude')}
                    onChange={(value, latitude, longitude) => {
                      field.onChange(value);
                      form.setValue('latitude', latitude ?? null);
                      form.setValue('longitude', longitude ?? null);
                    }}
                    disabled={isDisabled || (isMultipleSelection && preserveFields?.location)}
                    placeholder={
                      isMultipleSelection && preserveFields?.location
                        ? t('location_placeholder_preserved')
                        : t('location_placeholder')
                    }
                  />
                </FormControl>
                {isMultipleSelection && preserveFields?.location && (
                  <p className="text-sm text-text/60 mt-1">{t('location_toggle_tip')}</p>
                )}
                <FormMessage />
              </FormItem>
            )}
          />

          {isMultipleSelection && (
            <div className="flex flex-col lg:flex-row items-start lg:items-center gap-2 justify-between border border-text/10 rounded-md p-3 bg-secondary/5">
              <div className="flex flex-col">
                <Label className="font-body_two text-text/90">
                  {t('preserve_description_label')}
                </Label>
                <p className="text-sm text-text/60 mt-1">
                  {preserveFields?.description
                    ? t('preserve_description_description_true')
                    : t('preserve_description_description_false')}
                </p>
              </div>
              <Switch
                checked={preserveFields?.description}
                onCheckedChange={() =>
                  setPreserveFields({
                    ...preserveFields,
                    description: !preserveFields?.description,
                  })
                }
                aria-label={t('preserve_description_aria')}
              />
            </div>
          )}

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-body_two">{t('description_label')}</FormLabel>
                <FormControl>
                  <Textarea
                    disabled={isDisabled || isDescriptionPreserveSwitchEnabled}
                    className="border border-text/25 rounded mt-1 p-3 font-body_two text-text/75 bg-transparent w-full outline-none h-24 resize-none"
                    placeholder={
                      isDescriptionPreserveSwitchEnabled
                        ? t('description_placeholder_preserved')
                        : t('description_placeholder')
                    }
                    {...field}
                    value={field.value || ''}
                  />
                </FormControl>
                {isDescriptionPreserveSwitchEnabled && (
                  <p className="text-sm text-text/60 mt-1">{t('description_toggle_tip')}</p>
                )}
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end gap-2">
            {onCancel && (
              <Button
                type="button"
                onClick={onCancel}
                disabled={isDisabled || isSaving()}
                className="bg-secondary-50 text-text rounded px-4 py-2 hover:bg-secondary-100 font-body_two"
                aria-label={t('cancel_button_aria')}
              >
                {t('cancel_button')}
              </Button>
            )}

            <Button
              type="submit"
              disabled={isDisabled || isSaving()}
              className={cn(
                'rounded px-6 py-2 font-body_two flex items-center gap-2',
                showSuccess
                  ? 'bg-green-500 text-white'
                  : 'bg-primary text-background hover:bg-primary/90',
              )}
              aria-label={t('save_button_aria')}
            >
              {showSuccess ? (
                <>
                  <Check size={18} />
                  {t('save_button_success')}
                </>
              ) : (
                t('save_button')
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
