import PagePlaceholder from './PagePlaceholder'
import { useLanguage } from '../i18n/LanguageContext'

export default function Routes() {
  const { t } = useLanguage()

  return <PagePlaceholder title={t('pages.routes.title')} />
}
