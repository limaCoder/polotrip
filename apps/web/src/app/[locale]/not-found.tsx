import Image from 'next/image';
import { Link } from '@/i18n/routing';

export default function NotFound() {
  return (
    <main className="flex flex-col items-center justify-center h-screen">
      <Image src="/brand/logo.svg" alt="Polotrip" width={400} height={200} />
      <h1 className="text-2xl mt-4">Page not found</h1>
      <p className="text-sm mt-2">The page you are looking for does not exist.</p>
      <Link href="/" className="text-sm mt-4 text-primary font-bold hover:underline">
        Go back to home
      </Link>
    </main>
  );
}
