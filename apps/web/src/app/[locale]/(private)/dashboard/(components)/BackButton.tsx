'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { useParams } from 'next/navigation';

export function BackButton() {
  const params = useParams();
  const locale = params?.locale;

  return (
    <Link
      href={`/${locale}/dashboard`}
      className="flex items-center gap-2 font-body_one hover:text-primary transition-colors"
    >
      <ArrowLeft size={24} />
      <span>Voltar</span>
    </Link>
  );
}
