import { Github } from "lucide-react";
import { getTranslations } from "next-intl/server";
import {
  GITHUB_REPO_URL,
  GITHUB_SELF_HOSTING_URL,
} from "@/constants/githubRepo";
import { MotionSection } from "@/lib/motion/motion-components";
import { CodeSnippet } from "./code-snippet";
import { openSourceFeaturesData } from "./data";

export async function OpenSource() {
  const t = await getTranslations("Home.OpenSource");

  return (
    <MotionSection
      className="bg-background py-8 lg:py-16"
      id="open-source"
      initial={{ opacity: 0, y: 35 }}
      transition={{ duration: 0.7 }}
      whileInView={{ opacity: 1, y: 0 }}
    >
      <div className="container mx-auto px-4 lg:px-9">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="flex flex-col">
            <h2 className="font-title_one text-foreground">{t("title")}</h2>
            <p className="mt-4 font-body_one text-muted-foreground">
              {t("description")}
            </p>

            <ul className="mt-8 flex flex-col gap-6">
              {openSourceFeaturesData.map((feature) => (
                <li className="flex items-start gap-4" key={feature.id}>
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    {feature.icon}
                  </span>
                  <div>
                    <h3 className="font-body_one font-bold text-foreground">
                      {t(`features.${feature.titleKey}`)}
                    </h3>
                    <p className="mt-1 font-body_two text-muted-foreground">
                      {t(`features.${feature.descriptionKey}`)}
                    </p>
                  </div>
                </li>
              ))}
            </ul>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <a
                aria-label={t("star_button_aria")}
                className="button-shadow flex h-12 items-center justify-center gap-2 rounded-full bg-gradient-primary px-8 font-bold text-white transition-transform hover:-translate-y-1"
                href={GITHUB_REPO_URL}
                rel="noopener noreferrer"
                target="_blank"
              >
                <Github className="h-5 w-5" />
                {t("star_button")}
              </a>
              <a
                aria-label={t("guide_button_aria")}
                className="flex h-12 items-center justify-center rounded-full border border-foreground/10 bg-background/50 px-8 font-bold text-foreground transition-all hover:-translate-y-1 hover:border-foreground/20"
                href={GITHUB_SELF_HOSTING_URL}
                rel="noopener noreferrer"
                target="_blank"
              >
                {t("guide_button")}
              </a>
            </div>
          </div>

          <CodeSnippet title={t("terminal_title")} />
        </div>
      </div>
    </MotionSection>
  );
}
