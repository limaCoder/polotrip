import { Button } from '@/components/Button';

export async function Cta() {
  return (
    <section className="py-12 bg-[url('/img/cta-section.png')] bg-cover bg-center bg-no-repeat">
      <div className="container mx-auto lg:px-9 px-4 flex flex-col items-center gap-5 lg:text-left text-center">
        <h2 className="font-title_two font-bold text-white">
          Pronto para criar seu primeiro álbum?
        </h2>
        <p className="font-body_one text-white">
          Por apenas <strong>R$29,99</strong>, crie um álbum de viagem digital único e memorável.
        </p>
        <Button href={''} className="bg-yellow text-black shadow-md">
          <strong>Começar agora</strong>
        </Button>
      </div>
    </section>
  );
}
