import { MessageSquare } from 'lucide-react'
import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { Link } from '@/i18n/routing'
import { ChatInterface } from './(components)/chat-interface'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'Chat.metadata' })

  return {
    title: t('title'),
    description: t('description'),
  }
}

export default async function ChatPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'Chat' })
  const tDashboard = await getTranslations({ locale, namespace: 'Dashboard' })

  return (
    <>
      <Header />
      <main className="flex min-h-screen flex-col bg-background">
        <section className="flex-grow bg-secondary/5 pt-24 pb-8 lg:pt-12">
          <div className="container mx-auto px-4 lg:px-9 h-full">
            <div className="flex flex-col gap-9 h-full">
              <div className="flex items-center gap-4 border-b pb-2">
                <Link
                  href="/dashboard"
                  className="flex items-center gap-2 px-4 py-2 rounded-md hover:bg-muted transition-colors"
                >
                  {tDashboard('my_albums')}
                </Link>
                <Link
                  href="/dashboard/chat"
                  className="flex items-center gap-2 px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                >
                  <MessageSquare className="h-4 w-4" />
                  {tDashboard('chat')}
                </Link>
              </div>

              <div>
                <h1 className="font-title_two">{t('title')}</h1>
                <p className="font-title_three text-muted-foreground">
                  {t('subtitle')}
                </p>
              </div>
              <ChatInterface />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
