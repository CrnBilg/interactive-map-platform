import PagePlaceholder, { InfoPanel } from './PagePlaceholder'
import { useLanguage } from '../i18n/LanguageContext'

export default function Privacy() {
  const { t } = useLanguage()

  return (
    <PagePlaceholder title={t('pages.privacy.title')} subtitle={t('pages.privacy.subtitle')}>
      <InfoPanel title={t('pages.privacy.panelTitle')}>
        <p>{t('pages.privacy.body1')}</p>
        <p className="mt-4">{t('pages.privacy.body2')}</p>
      </InfoPanel>
    </PagePlaceholder>
  )
}
