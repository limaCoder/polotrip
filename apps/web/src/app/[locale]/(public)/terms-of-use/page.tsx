import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';

export default async function TermsOfUse() {
  return (
    <>
      <Header />
      <main className="container mx-auto py-12 px-4">
        <h1 className="text-3xl font-bold mb-8">Termos de Uso</h1>

        <section className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold mb-4">1. Aceitação dos Termos</h2>
            <p>
              Ao acessar ou utilizar o Polotrip, você concorda com estes Termos de Uso. Se você não
              concordar com qualquer parte destes termos, não poderá acessar ou utilizar nossos
              serviços.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">2. Descrição do Serviço</h2>
            <p>
              O Polotrip é um SaaS que permite criar, editar e compartilhar álbuns digitais
              interativos de viagens, incluindo recursos como timeline, mapa interativo e integração
              com o Spotify.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">3. Conta de Usuário</h2>
            <p>
              Para utilizar o Polotrip, você precisa criar uma conta usando seu e-mail ou login
              social via Google. Você é responsável por manter a confidencialidade de suas
              credenciais e por todas as atividades realizadas em sua conta.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">4. Pagamentos e Assinaturas</h2>
            <p>
              O Polotrip opera com um modelo &quot;pay-per-album&quot;, cobrando R$19,99 para álbuns
              com até 100 fotos. Todos os pagamentos são processados pela Stripe e são
              não-reembolsáveis, exceto em casos previstos pela legislação brasileira.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">5. Conteúdo do Usuário</h2>
            <p>
              Você mantém todos os direitos sobre as fotos e outros conteúdos que carregar no
              Polotrip. Ao utilizar nosso serviço, você concede ao Polotrip uma licença limitada
              para armazenar, processar e exibir seu conteúdo exclusivamente para fornecer o serviço
              a você e às pessoas com quem você compartilha seus álbuns.
            </p>
            <p>
              Você é responsável por garantir que tem o direito de compartilhar qualquer conteúdo
              que carregar no Polotrip e que este conteúdo não viola direitos de terceiros.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">6. Compartilhamento de Álbuns</h2>
            <p>
              O Polotrip permite compartilhar álbuns através de links únicos. Apenas pessoas com
              acesso ao link poderão visualizar o álbum. Você é responsável por gerenciar com quem
              compartilha seus links e pelos conteúdos dos álbuns compartilhados.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">7. Uso Proibido</h2>
            <p>Você concorda em não utilizar o Polotrip para:</p>
            <ul className="list-disc ml-6 mt-2">
              <li>
                Carregar conteúdo ilegal, ofensivo, difamatório ou violador de direitos de terceiros
              </li>
              <li>Violar quaisquer leis ou regulamentos aplicáveis</li>
              <li>
                Tentar acessar contas de outros usuários ou partes do serviço às quais você não tem
                permissão
              </li>
              <li>Distribuir malware ou realizar ataques ao serviço</li>
              <li>Usar o serviço para fins comerciais não autorizados</li>
            </ul>
          </div>

          <div>
            <h2 className="mt-8 mb-2 text-xl font-bold">8. Armazenamento e Acesso às Imagens</h2>
            <p>
              As imagens enviadas para a plataforma são armazenadas em um serviço de armazenamento
              público, porém o acesso aos álbuns é restrito por meio de links únicos. Ao
              compartilhar um álbum, você concorda que qualquer pessoa com o link poderá visualizar
              as imagens contidas nele. Não nos responsabilizamos por acessos não autorizados
              decorrentes do compartilhamento do link por parte do usuário.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">9. Cancelamento e Encerramento</h2>
            <p>
              Reservamo-nos o direito de suspender ou encerrar sua conta se você violar estes Termos
              de Uso.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">10. Alterações nos Termos</h2>
            <p>
              Podemos modificar estes termos a qualquer momento, notificando os usuários sobre
              mudanças significativas. O uso continuado do serviço após tais modificações constitui
              sua aceitação dos novos termos.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">11. Lei Aplicável</h2>
            <p>
              Estes termos são regidos pelas leis do Brasil. Qualquer disputa relacionada a estes
              termos será submetida à jurisdição exclusiva dos tribunais brasileiros.
            </p>
          </div>
        </section>

        <p className="mt-10">Última atualização: 28 de abril de 2025</p>
      </main>
      <Footer />
    </>
  );
}
