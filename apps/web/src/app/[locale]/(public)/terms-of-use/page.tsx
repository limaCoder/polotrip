import { getTranslations } from "next-intl/server";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";

export default async function TermsOfUse() {
  const t = await getTranslations("TermsOfUse");

  return (
    <>
      <Header />
      <main className="container mx-auto px-4 py-12">
        <h1 className="mb-8 font-bold text-3xl">{t("title")}</h1>

        <section className="space-y-6">
          <div>
            <h2 className="mb-4 font-semibold text-xl">
              {t("sections.acceptance.title")}
            </h2>
            <p>{t("sections.acceptance.content")}</p>
          </div>

          <div>
            <h2 className="mb-4 font-semibold text-xl">
              {t("sections.service_description.title")}
            </h2>
            <p>{t("sections.service_description.content")}</p>
          </div>

          <div>
            <h2 className="mb-4 font-semibold text-xl">
              {t("sections.user_account.title")}
            </h2>
            <p>{t("sections.user_account.content")}</p>
          </div>

          <div>
            <h2 className="mb-4 font-semibold text-xl">
              {t("sections.payments.title")}
            </h2>
            <p>{t("sections.payments.content")}</p>
          </div>

          <div>
            <h2 className="mb-4 font-semibold text-xl">
              {t("sections.user_content.title")}
            </h2>
            <p>{t("sections.user_content.content_1")}</p>
            <p>{t("sections.user_content.content_2")}</p>
          </div>

          <div>
            <h2 className="mb-4 font-semibold text-xl">
              {t("sections.album_sharing.title")}
            </h2>
            <p>{t("sections.album_sharing.content")}</p>
          </div>

          <div>
            <h2 className="mb-4 font-semibold text-xl">
              {t("sections.prohibited_use.title")}
            </h2>
            <p>{t("sections.prohibited_use.content")}</p>
            <ul className="mt-2 ml-6 list-disc">
              <li>{t("sections.prohibited_use.items.illegal_content")}</li>
              <li>{t("sections.prohibited_use.items.violate_laws")}</li>
              <li>{t("sections.prohibited_use.items.unauthorized_access")}</li>
              <li>{t("sections.prohibited_use.items.distribute_malware")}</li>
              <li>
                {t("sections.prohibited_use.items.unauthorized_commercial_use")}
              </li>
            </ul>
          </div>

          <div>
            <h2 className="mt-8 mb-2 font-bold text-xl">
              {t("sections.storage_and_access.title")}
            </h2>
            <p>{t("sections.storage_and_access.content")}</p>
          </div>

          <div>
            <h2 className="mb-4 font-semibold text-xl">
              {t("sections.cancellation.title")}
            </h2>
            <p>{t("sections.cancellation.content")}</p>
          </div>

          <div>
            <h2 className="mb-4 font-semibold text-xl">
              {t("sections.terms_changes.title")}
            </h2>
            <p>{t("sections.terms_changes.content")}</p>
          </div>

          <div>
            <h2 className="mb-4 font-semibold text-xl">
              {t("sections.governing_law.title")}
            </h2>
            <p>{t("sections.governing_law.content")}</p>
          </div>
        </section>

        <p className="mt-10">{t("last_updated")}</p>
      </main>
      <Footer />
    </>
  );
}
