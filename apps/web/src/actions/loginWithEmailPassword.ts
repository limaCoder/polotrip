import { auth } from '@polotrip/auth';
import { redirect } from '@/i18n/routing';

export async function loginWithEmailPassword(locale: string, formData: FormData) {
  'use server';

  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!email || !password) {
    console.error('Email and password are required');
    return;
  }

  try {
    await auth.api.signInEmail({
      body: {
        email,
        password,
      },
    });
  } catch (error) {
    console.error('Error when logging in:', error);
  }

  redirect({ href: '/dashboard', locale });
}
