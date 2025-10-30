import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';
import { getTranslations } from 'next-intl/server';

export default async function PrivacyPolicy() {
  const t = await getTranslations('PrivacyPolicy');

  return (
    <>
      <Header />
      <main className="container mx-auto py-12 px-4">
        <h1 className="text-3xl font-bold mb-8">{t('title')}</h1>

        <section className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold mb-4">{t('sections.introduction.title')}</h2>
            <p>{t('sections.introduction.content')}</p>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">
              {t('sections.information_we_collect.title')}
            </h2>
            <p>{t('sections.information_we_collect.content')}</p>
            <ul className="list-disc ml-6 mt-2">
              <li>
                {t.rich('sections.information_we_collect.items.account_info', {
                  bold: chunks => <strong>{chunks}</strong>,
                })}
              </li>
              <li>
                {t.rich('sections.information_we_collect.items.user_content', {
                  bold: chunks => <strong>{chunks}</strong>,
                })}
              </li>
              <li>
                {t.rich('sections.information_we_collect.items.payment_info', {
                  bold: chunks => <strong>{chunks}</strong>,
                })}
              </li>
              <li>
                {t.rich('sections.information_we_collect.items.usage_data', {
                  bold: chunks => <strong>{chunks}</strong>,
                })}
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">
              {t('sections.photo_metadata_collection.title')}
            </h2>
            <p>{t('sections.photo_metadata_collection.content_1')}</p>
            <ul className="list-disc ml-6 mt-2">
              <li>{t('sections.photo_metadata_collection.items.date_time')}</li>
              <li>{t('sections.photo_metadata_collection.items.geo_coordinates')}</li>
              <li>{t('sections.photo_metadata_collection.items.camera_info')}</li>
            </ul>
            <p className="mt-2">{t('sections.photo_metadata_collection.content_2')}</p>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">
              {t('sections.how_we_use_your_information.title')}
            </h2>
            <p>{t('sections.how_we_use_your_information.content')}</p>
            <ul className="list-disc ml-6 mt-2">
              <li>{t('sections.how_we_use_your_information.items.provide_services')}</li>
              <li>{t('sections.how_we_use_your_information.items.process_transactions')}</li>
              <li>{t('sections.how_we_use_your_information.items.enable_sharing')}</li>
              <li>{t('sections.how_we_use_your_information.items.organize_photos')}</li>
              <li>{t('sections.how_we_use_your_information.items.ensure_security')}</li>
              <li>{t('sections.how_we_use_your_information.items.communicate')}</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">{t('sections.data_storage.title')}</h2>
            <p>{t('sections.data_storage.content_1')}</p>
            <ul className="list-disc ml-6 mt-2">
              <li>{t('sections.data_storage.items.album_covers')}</li>
              <li>{t('sections.data_storage.items.album_photos')}</li>
              <li>{t('sections.data_storage.items.metadata_account_info')}</li>
            </ul>
            <p className="mt-2">{t('sections.data_storage.content_2')}</p>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">
              {t('sections.information_sharing.title')}
            </h2>
            <p>{t('sections.information_sharing.content_1')}</p>
            <ul className="list-disc ml-6 mt-2">
              <li>
                {t.rich('sections.information_sharing.items.authorized_people', {
                  bold: chunks => <strong>{chunks}</strong>,
                })}
              </li>
              <li>
                {t.rich('sections.information_sharing.items.service_providers', {
                  bold: chunks => <strong>{chunks}</strong>,
                })}
              </li>
              <li>
                {t.rich('sections.information_sharing.items.legal_requirements', {
                  bold: chunks => <strong>{chunks}</strong>,
                })}
              </li>
            </ul>
            <p className="mt-2">{t('sections.information_sharing.content_2')}</p>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">
              {t('sections.third_party_integrations.title')}
            </h2>
            <p>{t('sections.third_party_integrations.content_1')}</p>
            <ul className="list-disc ml-6 mt-2">
              <li>{t('sections.third_party_integrations.items.google_login')}</li>
              <li>{t('sections.third_party_integrations.items.stripe_payments')}</li>
              <li>{t('sections.third_party_integrations.items.leaflet_maps')}</li>
            </ul>
            <p className="mt-2">{t('sections.third_party_integrations.content_2')}</p>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">{t('sections.your_rights.title')}</h2>
            <p>{t('sections.your_rights.content_1')}</p>
            <ul className="list-disc ml-6 mt-2">
              <li>{t('sections.your_rights.items.access_data')}</li>
              <li>{t('sections.your_rights.items.correct_data')}</li>
              <li>{t('sections.your_rights.items.delete_data')}</li>
              <li>{t('sections.your_rights.items.withdraw_consent')}</li>
              <li>{t('sections.your_rights.items.object_processing')}</li>
            </ul>
            <p className="mt-2">{t('sections.your_rights.content_2')}</p>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">{t('sections.data_retention.title')}</h2>
            <p>{t('sections.data_retention.content')}</p>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">{t('sections.policy_changes.title')}</h2>
            <p>{t('sections.policy_changes.content')}</p>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">{t('sections.contact.title')}</h2>
            <p>{t('sections.contact.content')}</p>
          </div>
        </section>

        <p className="mt-10">{t('last_updated')}</p>
      </main>
      <Footer />
    </>
  );
}
