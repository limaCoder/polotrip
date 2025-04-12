import { PageWithLocale } from '@/types/pageWithLocale';
import Link from 'next/link';
export default async function NotFound({ params }: PageWithLocale) {
  const { locale } = await params;

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-bold">Album não encontrado</h1>
      <Link href={`/${locale}/dashboard`}>Voltar para o dashboard</Link>
    </div>
  );
}
