import { auth } from '@polotrip/auth';
import { redirect } from 'next/navigation';

export async function loginWithEmailPassword(locale: string, formData: FormData) {
  'use server';

  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!email || !password) {
    console.error('Email e senha são obrigatórios');
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
    console.error('Erro ao fazer login:', error);
  }

  redirect(`/${locale}/dashboard`);
}
