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

export function AlbumForm() {
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

  return (
    <form action={formAction} className="bg-background p-8 rounded-lg shadow-md">
      <h1 className="font-title_three mb-6 font-bold">Criar Novo Álbum</h1>

      {formState?.hasError && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4 flex items-start gap-2">
          <AlertCircle size={18} className="mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-body_two font-bold">Erro ao criar álbum</p>
            <p className="text-sm">{formState?.errorMessage}</p>
            {formState?.titleError && (
              <p className="text-sm mt-1">Título: {formState?.titleError?.join(', ')}</p>
            )}
            {formState?.dateError && (
              <p className="text-sm mt-1">Data: {formState?.dateError?.join(', ')}</p>
            )}
            {formState?.descriptionError && (
              <p className="text-sm">Descrição: {formState?.descriptionError?.join(', ')}</p>
            )}
            {formState?.coverImageError && (
              <p className="text-sm">Imagem: {formState?.coverImageError?.join(', ')}</p>
            )}
          </div>
        </div>
      )}

      <div className="space-y-4 mb-6">
        <div className="flex flex-col gap-1">
          <label htmlFor="title" className="font-body_two">
            Título do Álbum
          </label>
          <input
            id="title"
            name="title"
            type="text"
            placeholder="Ex: Viagem para Paris"
            className="border border-text/25 rounded p-3 font-body_two text-sm"
          />
          {formState?.hasInvalidData && formState?.titleError && (
            <p className="text-sm text-red-500">Título é obrigatório</p>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="date" className="font-body_two">
            Data da viagem
          </label>
          <MonthPicker
            className="border border-text/25 rounded p-3 font-body_two text-sm"
            name="date"
            placeholder="Selecione o mês e o ano da viagem"
          />
          {formState?.hasInvalidData && formState?.dateError && (
            <p className="text-sm text-red-500">Data é obrigatório</p>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="description" className="font-body_two">
            Descrição
          </label>
          <textarea
            id="description"
            name="description"
            placeholder="Conte um pouco sobre esta viagem..."
            className="border border-text/25 rounded p-3 h-24 font-body_two text-sm"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="cover" className="font-body_two">
            Capa do álbum
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
                  <span className="text-primary font-bold">Imagem selecionada!</span>
                  <br />
                  Se deseja alterar, arraste e solte novamente
                </p>
                <span className="text-primary text-xs mt-1">{selectedImage?.name}</span>
              </>
            ) : (
              <>
                <Upload size={24} className="text-text/25 mb-2" />
                <p className="font-body_two text-sm">
                  <span className="text-primary font-bold">Faça upload de uma foto</span>
                  <br />
                  ou arraste e solte
                </p>
                <span className="text-primary text-xs mt-1">PNG, JPG até 5MB</span>
              </>
            )}
          </div>
          <div className="mt-2 p-3 bg-secondary/5 rounded-lg">
            <p className="text-sm font-body_two mb-2">✨ Recomendações para uma capa incrível:</p>
            <div className="flex items-center gap-3">
              <div className="w-[120px] h-[68px] bg-secondary/20 rounded flex items-center justify-center border border-dashed border-primary/30">
                <span className="text-[10px] text-primary/70">1600 x 900 px</span>
              </div>
              <div className="flex-1">
                <p className="text-sm text-text/70">• Use uma imagem no formato horizontal</p>
                <p className="text-sm text-text/70">• Resolução recomendada: 1600 x 900 pixels</p>
                <p className="text-sm text-text/70">• Evite textos na imagem</p>
              </div>
            </div>
          </div>
          {formState?.hasInvalidData && formState?.coverImageError && (
            <p className="text-sm text-red-500">{formState?.coverImageError?.join(', ')}</p>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="plan" className="font-body_two">
            Plano do Álbum
          </label>
          <Select name="plan" value={selectedPlan} onValueChange={handlePlanChange}>
            <SelectTrigger className="border border-text/25 rounded p-3 font-body_two text-sm">
              <SelectValue placeholder="Selecione um plano" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="basic">Básico - 50 fotos</SelectItem>
              <SelectItem value="standard">Padrão - 100 fotos</SelectItem>
              <SelectItem value="premium">Premium - 150 fotos</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <hr className="border-text/25 my-6" />

      <div className="flex flex-col items-start bg-secondary/5 p-6 rounded-lg mb-6">
        <h2 className="font-body_one font-bold text-primary mb-6">Resumo do Pedido</h2>

        <div className="w-full flex justify-between">
          <div>
            <h3 className="font-body_two font-bold">
              Criação do álbum - {getPlanName(selectedPlan)}
            </h3>
            <p className="text-xs">
              Inclui até {getPlanPhotoLimit(selectedPlan)} fotos e todas as funcionalidades premium
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
          aria-label="Pagar com cartão"
        >
          {isPending ? (
            <>
              <Loader size={20} className="animate-spin" color="#F7FCFD" />
              <span>Processando...</span>
            </>
          ) : (
            <>
              <CreditCard size={20} color="#F7FCFD" />
              <span>Pagar com cartão</span>
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
