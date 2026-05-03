import PagePlaceholder from './PagePlaceholder'
import { useLanguage } from '../i18n/LanguageContext'

export default function Places() {
  const { t } = useLanguage()

  return <PagePlaceholder title={t('pages.places.title')} />
}
