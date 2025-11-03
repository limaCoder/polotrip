import { LogIn } from "lucide-react";
import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { loginWithEmailPassword } from "@/actions/loginWithEmailPassword";
import womanTakingSunbathOnBeach from "@/assets/lottie/woman-taking-sunbath-on-beach.json" with {
  type: "json",
};
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import LottieAnimation from "@/components/LottieAnimation";
import { OAuthButton } from "@/components/OAuthButton";
import type { PageProps } from "@/types/next";

const isLoginWithEmailPasswordEnabled = false;

export default async function LoginPage({ params }: PageProps) {
  const { locale } = await params;
  const signInUserWithLocale = loginWithEmailPassword.bind(null, locale);
  const t = await getTranslations("SignIn");

  return (
    <>
      <Header />
      <main className="flex flex-col bg-background lg:min-h-[calc(100vh-200px)]">
        <section className="flex flex-grow bg-secondary/5 pt-28 lg:pt-16">
          <div className="container mx-auto flex flex-col items-center justify-center px-4 lg:px-9">
            <div className="flex w-full max-w-md flex-col items-center gap-6">
              <div className="flex h-[50px] w-[50px] items-center justify-center rounded-full bg-secondary/50 p-2.5">
                <LogIn color="#03AED2" size={24} strokeWidth={2} />
              </div>

              <div className="space-y-2 text-center">
                <h1 className="font-bold font-title_three">{t("title")}</h1>
                <p className="font-body_two">{t("subtitle")}</p>
              </div>

              <div className="flex w-full flex-col gap-4">
                {isLoginWithEmailPasswordEnabled && (
                  <form
                    action={signInUserWithLocale}
                    className="mb-4 w-full space-y-4"
                  >
                    <div className="flex flex-col gap-2">
                      <label className="font-body_two" htmlFor="email">
                        {t("email_label")}
                      </label>
                      <input
                        className="w-full rounded-lg border border-gray-300 p-3"
                        id="email"
                        name="email"
                        placeholder={t("email_placeholder")}
                        required
                        type="email"
                      />
                    </div>

                    <div className="flex flex-col gap-2">
                      <label className="font-body_two" htmlFor="password">
                        {t("password_label")}
                      </label>
                      <input
                        className="w-full rounded-lg border border-gray-300 p-3"
                        id="password"
                        name="password"
                        placeholder={t("password_placeholder")}
                        required
                        type="password"
                      />
                    </div>

                    <button
                      className="w-full rounded-lg bg-primary p-3 font-body_two text-white hover:bg-primary/90"
                      type="submit"
                    >
                      {t("submit_button")}
                    </button>
                  </form>
                )}

                <OAuthButton
                  aria-label={t("google_oauth_aria")}
                  provider="google"
                >
                  <Image
                    alt={t("google_icon_alt")}
                    height={24}
                    src="/icons/google.png"
                    width={24}
                  />
                  <span className="font-body_two">
                    {t("google_oauth_text")}
                  </span>
                </OAuthButton>
              </div>
            </div>

            <div className="h-[250px] w-full overflow-hidden rounded-lg lg:mt-4 lg:h-[320px]">
              <LottieAnimation animationData={womanTakingSunbathOnBeach} />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
