import { LogIn } from "lucide-react";
import type { Variants } from "motion/react";
import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { loginWithEmailPassword } from "@/actions/loginWithEmailPassword";
import womanTakingSunbathOnBeach from "@/assets/lottie/woman-taking-sunbath-on-beach.json" with {
  type: "json",
};
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import LottieAnimation from "@/components/LottieAnimation";
import { OAuthButton } from "@/components/OAuthButton";
import { Link } from "@/i18n/routing";
import {
  MotionDiv,
  MotionHeadlineOne,
  MotionParagraph,
  MotionSection,
} from "@/lib/motion/motion-components";
import type { PageProps } from "@/types/next";

const isLoginWithEmailPasswordEnabled = false;

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
};

const imageVariants: Variants = {
  hidden: { opacity: 0, scale: 0.95, rotate: -2 },
  visible: {
    opacity: 1,
    scale: 1,
    rotate: 0,
    transition: {
      duration: 1.2,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "SignIn.metadata" });

  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function LoginPage({ params }: PageProps) {
  const { locale } = await params;
  const signInUserWithLocale = loginWithEmailPassword.bind(null, locale);
  const t = await getTranslations("SignIn");

  return (
    <>
      <Header />
      <main className="relative flex min-h-screen flex-col overflow-hidden bg-background pt-20">
        <div className="absolute inset-0 z-0">
          <div className="-top-[10%] -left-[10%] absolute h-[500px] w-[500px] rounded-full bg-primary/10 blur-[120px]" />
          <div className="-right-[10%] absolute top-[20%] h-[600px] w-[600px] rounded-full bg-secondary/10 blur-[120px]" />
          <div className="-bottom-[10%] absolute left-[20%] h-[400px] w-[400px] rounded-full bg-accent/10 blur-[100px]" />

          <div
            className="absolute inset-0 opacity-[0.03] mix-blend-overlay"
            style={{
              backgroundImage:
                'url(\'data:image/svg+xml,%3Csvg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"%3E%3Cfilter id="noiseFilter"%3E%3CfeTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch"/%3E%3C/filter%3E%3Crect width="100%25" height="100%25" filter="url(%23noiseFilter)"/%3E%3C/svg%3E\')',
            }}
          />
        </div>

        <MotionSection
          animate="visible"
          className="relative z-10 flex grow items-center py-12 lg:py-20"
          initial="hidden"
          variants={containerVariants}
        >
          <div className="container mx-auto px-4 lg:px-9">
            <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-24">
              <MotionDiv
                className="order-2 lg:order-1"
                variants={imageVariants}
              >
                <div className="relative mx-auto aspect-square w-full max-w-[500px] lg:max-w-none">
                  <div className="absolute inset-0 rounded-3xl bg-secondary/5 ring-1 ring-black/5 backdrop-blur-sm" />

                  <div className="absolute inset-4 overflow-hidden rounded-2xl bg-white p-2 shadow-2xl lg:inset-8">
                    <div className="relative h-full w-full overflow-hidden rounded-xl bg-secondary/5">
                      <LottieAnimation
                        animationData={womanTakingSunbathOnBeach}
                      />
                    </div>
                  </div>
                </div>
              </MotionDiv>

              <MotionDiv
                className="order-1 flex flex-col items-center lg:order-2 lg:items-start"
                variants={itemVariants}
              >
                <div className="w-full max-w-md space-y-8">
                  <div className="space-y-4 text-center lg:text-left">
                    <MotionDiv
                      animate={{ scale: [1, 1.1, 1], rotate: [0, 5, 0] }}
                      className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 p-3 text-primary shadow-inner"
                      transition={{
                        duration: 5,
                        repeat: Number.POSITIVE_INFINITY,
                        ease: "easeInOut",
                      }}
                    >
                      <LogIn size={32} strokeWidth={1.5} />
                    </MotionDiv>

                    <div className="space-y-2">
                      <MotionHeadlineOne className="font-bold font-title_one text-foreground tracking-tight lg:text-5xl">
                        {t("title")}
                      </MotionHeadlineOne>
                      <MotionParagraph className="font-body_one text-muted-foreground/80 lg:text-lg">
                        {t("subtitle")}
                      </MotionParagraph>
                    </div>
                  </div>

                  <MotionDiv className="space-y-6" variants={itemVariants}>
                    <div className="flex w-full flex-col gap-4">
                      {isLoginWithEmailPasswordEnabled && (
                        <form
                          action={signInUserWithLocale}
                          className="w-full space-y-5"
                        >
                          <div className="space-y-2">
                            <label
                              className="font-medium text-foreground/70 text-sm tracking-wide"
                              htmlFor="email"
                            >
                              {t("email_label")}
                            </label>
                            <input
                              className="w-full rounded-xl border border-border bg-white p-4 shadow-sm ring-primary/5 transition-all focus:border-primary focus:outline-hidden focus:ring-4"
                              id="email"
                              name="email"
                              placeholder={t("email_placeholder")}
                              required
                              type="email"
                            />
                          </div>

                          <div className="space-y-2">
                            <label
                              className="font-medium text-foreground/70 text-sm tracking-wide"
                              htmlFor="password"
                            >
                              {t("password_label")}
                            </label>
                            <input
                              className="w-full rounded-xl border border-border bg-white p-4 shadow-sm ring-primary/5 transition-all focus:border-primary focus:outline-hidden focus:ring-4"
                              id="password"
                              name="password"
                              placeholder={t("password_placeholder")}
                              required
                              type="password"
                            />
                          </div>

                          <button
                            className="hover:-translate-y-0.5 w-full transform rounded-xl bg-primary p-4 font-body_two font-semibold text-white shadow-lg transition-all hover:bg-primary/90 hover:shadow-primary/20 active:translate-y-0"
                            type="submit"
                          >
                            {t("submit_button")}
                          </button>
                        </form>
                      )}

                      <div className="relative">
                        <div
                          aria-hidden="true"
                          className="absolute inset-0 flex items-center"
                        >
                          <div className="w-full border-border/50 border-t" />
                        </div>
                      </div>

                      <OAuthButton
                        aria-label={t("google_oauth_aria")}
                        className="group hover:-translate-y-0.5 flex w-full items-center justify-center gap-3 rounded-xl border border-border bg-white p-4 shadow-sm transition-all hover:bg-secondary/5 hover:shadow-md active:translate-y-0 active:shadow-inner"
                        provider="google"
                      >
                        <div className="relative h-6 w-6 transition-transform group-hover:scale-110">
                          <Image
                            alt={t("google_icon_alt")}
                            fill
                            src="/icons/google.png"
                          />
                        </div>
                        <span className="font-semibold text-black transition-colors group-hover:text-foreground">
                          {t("google_oauth_text")}
                        </span>
                      </OAuthButton>
                    </div>

                    <p className="border-border/50 border-t pt-8 text-center text-muted-foreground/60 text-sm lg:text-left">
                      {t.rich("tos_agreement", {
                        tos: (chunks) => (
                          <Link
                            className="underline hover:text-primary"
                            href="/terms-of-use"
                          >
                            {chunks}
                          </Link>
                        ),
                        privacy: (chunks) => (
                          <Link
                            className="underline hover:text-primary"
                            href="/privacy-policy"
                          >
                            {chunks}
                          </Link>
                        ),
                      })}
                    </p>
                  </MotionDiv>
                </div>
              </MotionDiv>
            </div>
          </div>
        </MotionSection>
      </main>
      <Footer />
    </>
  );
}
