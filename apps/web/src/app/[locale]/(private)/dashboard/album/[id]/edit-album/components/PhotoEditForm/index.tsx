'use client';

import { useForm } from 'react-hook-form';
import { Check, CalendarIcon } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/cn';
import { Button } from '@/components/ui/button';
import { zodResolver } from '@hookform/resolvers/zod';
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
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { apiStringToDate } from '@/utils/dates';
import { type PhotoEditFormProps, type PhotoEditFormData, formSchema } from './types';
import { LocationAutocomplete } from '../LocationAutocomplete';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

export function PhotoEditForm({
  selectedPhotos,
  onSave,
  onCancel,
  isDisabled = false,
}: PhotoEditFormProps) {
  const [showSuccess, setShowSuccess] = useState(false);
  const [preserveFields, setPreserveFields] = useState({
    location: true,
    description: true,
  });

  const successTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const isMultipleSelection = selectedPhotos?.length > 1;

  const form = useForm<PhotoEditFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      dateTaken: null,
      locationName: '',
      description: '',
      latitude: null,
      longitude: null,
    },
  });

  function onSubmit(data: PhotoEditFormData) {
    const showSuccess = () => {
      setShowSuccess(true);

      if (successTimeoutRef.current) {
        clearTimeout(successTimeoutRef.current);
      }

      successTimeoutRef.current = setTimeout(() => {
        setShowSuccess(false);
      }, 2000);
    };

    if (isMultipleSelection) {
      let formData = { ...data };

      if (preserveFields?.location) {
        const { locationName, latitude, longitude, ...rest } = formData;
        formData = rest as PhotoEditFormData;
      }

      if (preserveFields?.description) {
        const { description, ...rest } = formData;
        formData = rest as PhotoEditFormData;
      }

      onSave(formData);
      showSuccess();
      return;
    }

    onSave(data);
    showSuccess();
  }

  const selectionText = isMultipleSelection
    ? `Editar ${selectedPhotos.length} fotos selecionadas`
    : selectedPhotos.length === 1
      ? 'Editar foto'
      : 'Selecione uma foto para editar';

  useEffect(() => {
    if (selectedPhotos.length === 0) {
      form.reset({
        dateTaken: null,
        locationName: '',
        description: '',
        latitude: null,
        longitude: null,
      });

      return;
    }

    if (selectedPhotos.length === 1) {
      const photo = selectedPhotos[0];
      form.reset({
        dateTaken: apiStringToDate(photo.dateTaken),
        locationName: photo.locationName || '',
        description: photo.description || '',
        latitude: photo.latitude,
        longitude: photo.longitude,
      });

      return;
    }

    const firstPhoto = selectedPhotos[0];
    form.reset(
      {
        dateTaken: apiStringToDate(firstPhoto.dateTaken),
        locationName: '',
        description: '',
        latitude: null,
        longitude: null,
      },
      {
        keepDirty: false,
        keepTouched: false,
      },
    );

    setPreserveFields({
      location: true,
      description: true,
    });
  }, [selectedPhotos, form]);

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
                <FormLabel className="font-body_two">Data</FormLabel>
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
                        aria-label="Selecionar data"
                      >
                        <CalendarIcon className="h-4 w-4 opacity-50" />
                        {field.value ? format(field.value, 'PPP') : <span>Selecione a data</span>}
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 bg-secondary" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value || undefined}
                      onSelect={field.onChange}
                      disabled={isDisabled}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          {isMultipleSelection && (
            <div className="flex items-center justify-between border border-text/10 rounded-md p-3 bg-secondary/5">
              <div className="flex flex-col">
                <Label className="font-body_two text-text/90">Preservar localização original</Label>
                <p className="text-sm text-text/60 mt-1">
                  {preserveFields?.location
                    ? 'A localização original das fotos será mantida'
                    : 'A localização será substituída em todas as fotos'}
                </p>
              </div>
              <Switch
                checked={preserveFields?.location}
                onCheckedChange={() =>
                  setPreserveFields({ ...preserveFields, location: !preserveFields?.location })
                }
                aria-label="Preservar localização original"
              />
            </div>
          )}

          <FormField
            control={form.control}
            name="locationName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-body_two">Localização</FormLabel>
                <FormControl>
                  <LocationAutocomplete
                    value={field.value || ''}
                    latitude={form.getValues('latitude')}
                    longitude={form.getValues('longitude')}
                    onChange={(value, latitude, longitude) => {
                      field.onChange(value);
                      form.setValue('latitude', latitude);
                      form.setValue('longitude', longitude);
                    }}
                    disabled={isDisabled || (isMultipleSelection && preserveFields?.location)}
                    placeholder={
                      isMultipleSelection && preserveFields?.location
                        ? 'Localização original será preservada'
                        : 'Digite o nome da localização'
                    }
                  />
                </FormControl>
                {isMultipleSelection && preserveFields?.location && (
                  <p className="text-sm text-text/60 mt-1">
                    Desabilite o toggle acima para editar a localização
                  </p>
                )}
                <FormMessage />
              </FormItem>
            )}
          />

          {isMultipleSelection && (
            <div className="flex items-center justify-between border border-text/10 rounded-md p-3 bg-secondary/5">
              <div className="flex flex-col">
                <Label className="font-body_two text-text/90">Preservar descrição original</Label>
                <p className="text-sm text-text/60 mt-1">
                  {preserveFields?.description
                    ? 'A descrição original das fotos será mantida'
                    : 'A descrição será substituída em todas as fotos'}
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
                aria-label="Preservar descrição original"
              />
            </div>
          )}

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-body_two">Descrição</FormLabel>
                <FormControl>
                  <Textarea
                    disabled={isDisabled || (isMultipleSelection && preserveFields?.description)}
                    className="border border-text/25 rounded mt-1 p-3 font-body_two text-text/75 bg-transparent w-full outline-none h-24 resize-none"
                    placeholder={
                      isMultipleSelection && preserveFields?.description
                        ? 'Descrição original será preservada'
                        : 'Descreva este momento...'
                    }
                    {...field}
                    value={field.value || ''}
                  />
                </FormControl>
                {isMultipleSelection && preserveFields?.description && (
                  <p className="text-sm text-text/60 mt-1">
                    Desabilite o toggle acima para editar a descrição
                  </p>
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
                disabled={isDisabled}
                className="bg-secondary-50 text-text rounded px-4 py-2 hover:bg-secondary-100 font-body_two"
                aria-label="Cancelar edição"
              >
                Cancelar
              </Button>
            )}

            <Button
              type="submit"
              disabled={isDisabled}
              className={cn(
                'rounded px-6 py-2 font-body_two flex items-center gap-2',
                showSuccess
                  ? 'bg-green-500 text-white'
                  : 'bg-primary text-background hover:bg-primary/90',
              )}
              aria-label="Salvar edição"
            >
              {showSuccess ? (
                <>
                  <Check size={18} />
                  Salvo!
                </>
              ) : (
                'Salvar edição'
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
