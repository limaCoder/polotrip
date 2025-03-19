import { Upload, CreditCard, QrCode } from 'lucide-react';
import { Button } from '@/components/Button';

export function AlbumForm() {
  return (
    <form className="bg-background p-8 rounded-lg shadow-md">
      <h1 className="font-title_three mb-6 font-bold">Criar Novo Álbum</h1>

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
          <div className="border border-dashed border-text/25 rounded p-3 h-[116px] flex flex-col items-center justify-center text-center relative">
            <input
              type="file"
              id="cover"
              name="cover"
              accept="image/png, image/jpeg, image/jpg"
              className="absolute inset-0 opacity-0 cursor-pointer z-10"
            />
            <Upload size={24} className="text-text/25 mb-2" />
            <p className="font-body_two text-sm">
              <span className="text-primary font-bold">Faça upload de uma foto</span>
              <br />
              ou arraste e solte
            </p>
            <span className="text-primary text-xs mt-1">PNG, JPG até 10MB</span>
          </div>
        </div>
      </div>

      <hr className="border-text/25 my-6" />

      <div className="flex flex-col items-start bg-secondary/5 p-6 rounded-lg mb-6">
        <h2 className="font-body_one font-bold text-primary mb-6">Resumo do Pedido</h2>

        <div className="w-full flex justify-between">
          <div>
            <h3 className="font-body_two font-bold">Criação do álbum</h3>
            <p className="text-xs">Inclui até 300 fotos e todas as funcionalidades premium</p>
          </div>
          <span className="font-body_two text-primary">R$ 29,99</span>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <Button className="bg-primary text-background p-3 flex items-center justify-center gap-3 rounded">
          <CreditCard size={20} color="#F7FCFD" />
          <span>Pagar com cartão</span>
        </Button>

        <Button className="bg-primary text-background p-3 flex items-center justify-center gap-3 rounded">
          <QrCode size={20} color="#F7FCFD" />
          <span>Pagar com Pix</span>
        </Button>
      </div>
    </form>
  );
}
