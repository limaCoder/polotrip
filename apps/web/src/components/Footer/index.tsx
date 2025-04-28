import Image from 'next/image';

export function Footer() {
  return (
    <footer className="py-8">
      <div className="container mx-auto lg:px-9 px-4 flex flex-col lg:flex-row gap-4 justify-between text-center lg:text-left">
        <div className="flex flex-col justify-center items-center lg:items-start">
          <Image src="/brand/logo.svg" alt="Polotrip" width={150} height={150} />
          <p className="font-body_two mt-1">Copyright &copy; 2025 - Todos os direitos reservados</p>
          <p className="font-body_two mt-1">
            Made by
            <a
              href="https://marioaugustolima.com.br/"
              target="_blank"
              title="Mario Lima"
              className="ml-1"
              rel="noreferrer"
            >
              Mario Lima
            </a>
          </p>
        </div>
        <div className="flex flex-col">
          <p className="font-body_one font-bold">LEGAL</p>
          <a href="" className="font-body_one text-primary mt-2">
            Termos de uso
          </a>
          <a href="" className="font-body_one text-primary mt-1">
            Termos de privacidade
          </a>
          <a href="" className="font-body_one text-primary mt-1">
            CNPJ: 57.996.361/0001-57
          </a>
        </div>
      </div>
    </footer>
  );
}
