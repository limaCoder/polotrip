import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { DashboardTabs } from "../(components)/dashboard-tabs";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />

      <main className="relative flex min-h-screen flex-col overflow-hidden bg-background">
        <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
          <div className="absolute top-[-10%] right-[-10%] h-[500px] w-[500px] rounded-full bg-primary/20 blur-[120px]" />
          <div className="absolute bottom-[-10%] left-[-10%] h-[600px] w-[600px] rounded-full bg-blue-500/10 blur-[150px]" />
          <div className="absolute top-[40%] left-[20%] h-[300px] w-[300px] rounded-full bg-purple-500/10 blur-[100px]" />
        </div>

        <section className="relative z-10 flex grow flex-col pt-24 pb-16 lg:pt-28">
          <div className="container mx-auto flex h-full grow flex-col px-4 lg:px-8 xl:px-12">
            <div className="flex h-full grow flex-col">
              <DashboardTabs />
              {children}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
