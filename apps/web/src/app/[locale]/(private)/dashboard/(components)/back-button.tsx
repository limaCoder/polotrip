import { ArrowLeft } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";

export async function BackButton() {
  const t = await getTranslations("CreateAlbum");

  return (
    <Link
      className="flex items-center gap-2 font-body_one transition-colors hover:text-primary"
      href="/dashboard"
    >
      <ArrowLeft size={24} />
      <span>{t("back_button")}</span>
    </Link>
  );
}
