import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';

export default async function PrivacyPolicy() {
  return (
    <>
      <Header />
      <main className="container mx-auto py-12 px-4">
        <h1 className="text-3xl font-bold mb-8">Política de Privacidade</h1>

        <section className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold mb-4">1. Introdução</h2>
            <p>
              Esta Política de Privacidade descreve como o Polotrip coleta, usa, compartilha e
              protege suas informações pessoais quando você utiliza nosso serviço. Ao usar o
              Polotrip, você concorda com as práticas descritas nesta política.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">2. Informações que Coletamos</h2>
            <p>Coletamos os seguintes tipos de informações:</p>
            <ul className="list-disc ml-6 mt-2">
              <li>
                <strong>Informações de conta:</strong> Nome, e-mail e perfil ao se cadastrar ou
                realizar login via Google.
              </li>
              <li>
                <strong>Conteúdo do usuário:</strong> Fotos que você carrega, incluindo metadados
                associados (EXIF) como data, hora, localização geográfica, largura e altura quando
                disponíveis.
              </li>
              <li>
                <strong>Informações de pagamento:</strong> Dados de transação processados através da
                Stripe (não armazenamos diretamente dados de cartão de crédito).
              </li>
              <li>
                <strong>Dados de uso:</strong> Informações sobre como você interage com nosso
                serviço, incluindo logs de acesso e atividades realizadas.
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">3. Coleta de Metadados das Fotos</h2>
            <p>
              Ao fazer upload de fotos, o Polotrip coleta e processa metadados EXIF para fornecer
              recursos como timeline e mapa interativo. Isso inclui:
            </p>
            <ul className="list-disc ml-6 mt-2">
              <li>Data e hora em que a foto foi tirada</li>
              <li>Coordenadas geográficas (se disponíveis)</li>
              <li>Informações técnicas da câmera</li>
            </ul>
            <p className="mt-2">
              Sempre informaremos sobre a coleta desses dados durante o processo de upload, e você
              terá a opção de remover esses metadados antes de concluir o upload.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">4. Como Usamos Suas Informações</h2>
            <p>Utilizamos suas informações para:</p>
            <ul className="list-disc ml-6 mt-2">
              <li>Fornecer, manter e melhorar nossos serviços</li>
              <li>Processar transações e gerenciar sua conta</li>
              <li>Permitir a criação e compartilhamento de álbuns digitais</li>
              <li>Organizar suas fotos em timelines e mapas com base nos metadados</li>
              <li>Garantir a segurança e integridade de nosso serviço</li>
              <li>
                Comunicar-nos com você sobre atualizações ou questões relacionadas à sua conta
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">5. Armazenamento de Dados</h2>
            <p>Seus dados são armazenados da seguinte forma:</p>
            <ul className="list-disc ml-6 mt-2">
              <li>Capas dos álbuns: Armazenadas em um bucket público no Supabase</li>
              <li>Fotos dos álbuns: Armazenadas em um bucket privado no R2 Cloudflare</li>
              <li>Metadados e informações da conta: Armazenados em banco de dados seguro</li>
            </ul>
            <p className="mt-2">
              Implementamos medidas técnicas e organizacionais para proteger seus dados contra
              acesso não autorizado, alteração, divulgação ou destruição.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">6. Compartilhamento de Informações</h2>
            <p>Compartilhamos suas informações nas seguintes circunstâncias:</p>
            <ul className="list-disc ml-6 mt-2">
              <li>
                <strong>Com pessoas que você autoriza:</strong> Seus álbuns são visíveis apenas para
                pessoas com quem você compartilha o link único. As imagens dos álbuns são
                armazenadas em um bucket público, o que significa que, tecnicamente, qualquer pessoa
                com o endereço exato da imagem pode acessá-la. No entanto, o endereço das imagens é
                difícil de adivinhar e não é divulgado publicamente pela plataforma.
              </li>
              <li>
                <strong>Com provedores de serviços:</strong> Compartilhamos dados com prestadores de
                serviços que nos ajudam a operar o Polotrip, como Stripe (pagamentos), Supabase e
                Cloudflare (armazenamento).
              </li>
              <li>
                <strong>Quando exigido por lei:</strong> Podemos divulgar suas informações quando
                obrigados por lei ou para proteger nossos direitos legais.
              </li>
            </ul>
            <p className="mt-2">
              Não vendemos ou alugamos suas informações pessoais a terceiros. Recomendamos que você
              compartilhe seus álbuns apenas com pessoas de confiança.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">7. Integrações de Terceiros</h2>
            <p>O Polotrip utiliza serviços de terceiros, incluindo:</p>
            <ul className="list-disc ml-6 mt-2">
              <li>Login social via Google</li>
              <li>Processamento de pagamentos via Stripe</li>
              <li>Leaflet para mapas interativos</li>
            </ul>
            <p className="mt-2">
              Cada um desses serviços tem suas próprias políticas de privacidade, e recomendamos que
              você as consulte para entender como tratam seus dados.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">8. Seus Direitos</h2>
            <p>Você tem os seguintes direitos em relação aos seus dados pessoais:</p>
            <ul className="list-disc ml-6 mt-2">
              <li>Acessar e receber uma cópia de seus dados pessoais</li>
              <li>Corrigir dados imprecisos ou incompletos</li>
              <li>Solicitar a exclusão de seus dados</li>
              <li>Retirar seu consentimento a qualquer momento</li>
              <li>Opor-se ao processamento de seus dados em determinadas circunstâncias</li>
            </ul>
            <p className="mt-2">
              Para exercer qualquer desses direitos, entre em contato conosco através do e-mail
              help@polotrip.com.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">9. Retenção de Dados</h2>
            <p>
              Mantemos seus dados pessoais apenas pelo tempo necessário para fornecer os serviços
              solicitados ou para cumprir obrigações legais. Quando você exclui sua conta, seus
              álbuns e fotos serão removidos de nossos servidores dentro de 30 dias.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">10. Alterações nesta Política</h2>
            <p>
              Podemos atualizar esta Política de Privacidade periodicamente. Notificaremos você
              sobre alterações significativas através de um aviso em nosso site ou por e-mail.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">11. Contato</h2>
            <p>
              Se você tiver dúvidas ou preocupações sobre esta Política de Privacidade ou sobre como
              tratamos seus dados, entre em contato conosco em privacy@polotrip.com.
            </p>
          </div>
        </section>

        <p className="mt-10">Última atualização: 28 de abril de 2025</p>
      </main>
      <Footer />
    </>
  );
}
