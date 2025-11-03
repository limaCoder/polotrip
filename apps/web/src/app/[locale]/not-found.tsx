import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";

export default function NotFound() {
  const t = useTranslations("NotFound");

  return (
    <main className="flex h-screen flex-col items-center justify-center">
      <Image
        alt={t("logo_alt")}
        height={200}
        src="/brand/logo.svg"
        width={400}
      />
      <h1 className="mt-4 text-2xl">{t("title")}</h1>
      <p className="mt-2 text-sm">{t("description")}</p>
      <Link
        className="mt-4 font-bold text-primary text-sm hover:underline"
        href="/"
      >
        {t("back_to_home")}
      </Link>
    </main>
  );
}
