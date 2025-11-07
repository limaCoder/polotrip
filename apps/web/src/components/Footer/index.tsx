import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { FooterLogo } from "./footer-logo";

export async function Footer() {
  const t = await getTranslations("Footer");

  return (
    <footer className="py-8">
      <div className="container mx-auto flex flex-col justify-between gap-4 px-4 text-center lg:flex-row lg:px-9 lg:text-left">
        <div className="flex flex-col items-center justify-center lg:items-start">
          <FooterLogo alt={t("logo_alt")} />
          <p className="mt-1 font-body_two">{t("copyright")}</p>
          <p className="mt-1 font-body_two">
            {t("made_by")}
            <a
              className="ml-1"
              href="https://marioaugustolima.com.br/"
              rel="noreferrer"
              target="_blank"
              title="Mario Lima"
            >
              Mario Lima
            </a>
          </p>
        </div>
        <div className="flex flex-col">
          <p className="font-body_one font-bold">{t("legal")}</p>
          <Link
            className="mt-2 font-body_one text-primary"
            href="/terms-of-use"
          >
            {t("terms_of_use")}
          </Link>
          <Link
            className="mt-1 font-body_one text-primary"
            href="/privacy-policy"
          >
            {t("privacy_policy")}
          </Link>
          <span className="mt-1 font-body_one text-primary">{t("cnpj")}</span>
        </div>
      </div>
    </footer>
  );
}
