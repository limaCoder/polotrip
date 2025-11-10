import type { MetadataRoute } from "next";
import { getTranslations } from "next-intl/server";
import { pwaIcons } from "@/assets/pwa/icons";

export default async function manifest(): Promise<MetadataRoute.Manifest> {
  const locale = "en";

  const t = await getTranslations({
    locale,
    namespace: "Manifest",
  });

  return {
    name: t("name"),
    short_name: t("short_name"),
    description: t("description"),
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#000000",
    icons: pwaIcons,
  };
}
