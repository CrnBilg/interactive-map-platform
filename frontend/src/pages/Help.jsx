import PagePlaceholder, { InfoPanel } from './PagePlaceholder'
import { useLanguage } from '../i18n/LanguageContext'

const faqKeys = ['platform', 'mapData', 'routes', 'account', 'support']

export default function Help() {
  const { t } = useLanguage()

  return (
    <PagePlaceholder title={t('pages.help.title')}>
      <InfoPanel id="faq" title={t('pages.help.faqTitle')}>
        <div className="space-y-3">
          {faqKeys.map((key) => (
            <details key={key} className="rounded-lg border border-gold/20 bg-bg-black/40 px-4 py-3">
              <summary className="cursor-pointer font-semibold text-gold-bright">{t(`pages.help.faq.${key}.question`)}</summary>
              <p className="mt-3 text-sm text-parchment/70">{t(`pages.help.faq.${key}.answer`)}</p>
            </details>
          ))}
        </div>
      </InfoPanel>
    </PagePlaceholder>
  )
}
