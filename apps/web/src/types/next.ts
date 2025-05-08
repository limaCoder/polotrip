import { ReactNode } from 'react';

type PageProps = {
  params: Promise<{
    locale: string;
    [key: string]: string;
  }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
};

type LayoutProps = {
  children: ReactNode;
  params: Promise<{
    locale: string;
    [key: string]: string;
  }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
};

export type { PageProps, LayoutProps };
