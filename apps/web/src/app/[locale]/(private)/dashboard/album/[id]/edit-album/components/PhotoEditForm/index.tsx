'use client';

import { Check, CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/cn';

import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

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

export function PhotoEditForm({
  selectedPhotos,
  onSave,
  onCancel,
  isDisabled = false,
}: PhotoEditFormProps) {
  const {
    form,
    onSubmit,
    selectionText,
    showSuccess,
    preserveFields,
    setPreserveFields,
    isMultipleSelection,
  } = usePhotoEditForm({ selectedPhotos, onSave });

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
                        {field.value ? (
                          format(field.value, 'PPP', { locale: ptBR })
                        ) : (
                          <span>Selecione a data</span>
                        )}
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
