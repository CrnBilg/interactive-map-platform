import PagePlaceholder, { InfoPanel } from './PagePlaceholder'
import { useLanguage } from '../i18n/LanguageContext'

export default function About() {
  const { t } = useLanguage()

  return (
    <PagePlaceholder title={t('pages.about.title')} subtitle={t('pages.about.subtitle')}>
      <InfoPanel id="who" title={t('pages.about.who.title')}>
        <p>{t('pages.about.who.body')}</p>
      </InfoPanel>
      <InfoPanel id="mission" title={t('pages.about.mission.title')}>
        <p>{t('pages.about.mission.body')}</p>
      </InfoPanel>
      <InfoPanel id="careers" title={t('pages.about.careers.title')}>
        <p>{t('pages.about.careers.body')}</p>
      </InfoPanel>
    </PagePlaceholder>
  )
}
