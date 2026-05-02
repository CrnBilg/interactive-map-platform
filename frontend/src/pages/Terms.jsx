import PagePlaceholder, { InfoPanel } from './PagePlaceholder'
import { useLanguage } from '../i18n/LanguageContext'

export default function Terms() {
  const { t } = useLanguage()

  return (
    <PagePlaceholder title={t('pages.terms.title')} subtitle={t('pages.terms.subtitle')}>
      <InfoPanel title={t('pages.terms.panelTitle')}>
        <p>{t('pages.terms.body1')}</p>
        <p className="mt-4">{t('pages.terms.body2')}</p>
      </InfoPanel>
    </PagePlaceholder>
  )
}
