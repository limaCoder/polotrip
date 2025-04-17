'use client';

import { useForm } from 'react-hook-form';
import { MapPin, Check, CalendarIcon } from 'lucide-react';
import { useRef, useState } from 'react';
import { cn } from '@/lib/cn';
import { Button } from '@/components/ui/button';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
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

export function PhotoEditForm({
  photo,
  isMultipleSelection = false,
  selectedCount = 0,
  onSave,
  onCancel,
  isDisabled = false,
}: PhotoEditFormProps) {
  const [showSuccess, setShowSuccess] = useState(false);
  const successTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const form = useForm<PhotoEditFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      dateTaken: apiStringToDate(photo?.dateTaken),
      locationName: photo?.locationName || '',
      description: photo?.description || '',
    },
  });

  function onSubmit(data: PhotoEditFormData) {
    onSave(data);

    setShowSuccess(true);

    if (successTimeoutRef.current) {
      clearTimeout(successTimeoutRef.current);
    }

    successTimeoutRef.current = setTimeout(() => {
      setShowSuccess(false);
    }, 2000);
  }

  const selectionText = isMultipleSelection
    ? `Editar ${selectedCount} ${selectedCount === 1 ? 'foto selecionada' : 'fotos selecionadas'}`
    : 'Editar foto';

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

          <FormField
            control={form.control}
            name="locationName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-body_two">Localização</FormLabel>
                <div className="border border-text/25 mt-1 rounded px-3 flex items-center gap-2">
                  <MapPin size={20} className="text-text/50" />
                  <FormControl>
                    <Input
                      type="text"
                      disabled={isDisabled}
                      className="font-body_two text-text/75 bg-transparent w-full outline-none border-0 p-0 focus-visible:ring-0 shadow-none"
                      placeholder="Digite o nome da localização"
                      {...field}
                      value={field.value || ''}
                    />
                  </FormControl>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-body_two">Descrição</FormLabel>
                <FormControl>
                  <Textarea
                    disabled={isDisabled}
                    className="border border-text/25 rounded mt-1 p-3 font-body_two text-text/75 bg-transparent w-full outline-none h-24 resize-none"
                    placeholder="Descreva este momento..."
                    {...field}
                    value={field.value || ''}
                  />
                </FormControl>
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
