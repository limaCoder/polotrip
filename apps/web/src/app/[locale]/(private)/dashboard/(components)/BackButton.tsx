import { Link } from '@/i18n/routing';
import { ArrowLeft } from 'lucide-react';

export function BackButton() {
  return (
    <Link
      href="/dashboard"
      className="flex items-center gap-2 font-body_one hover:text-primary transition-colors"
    >
      <ArrowLeft size={24} />
      <span>Voltar</span>
    </Link>
  );
}
