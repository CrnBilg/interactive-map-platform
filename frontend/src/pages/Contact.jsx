import toast from 'react-hot-toast'
import PagePlaceholder, { InfoPanel } from './PagePlaceholder'
import { useLanguage } from '../i18n/LanguageContext'

export default function Contact() {
  const { t } = useLanguage()

  const handleSubmit = (event) => {
    event.preventDefault()
    toast.success(t('pages.contact.toastSuccess'))
  }

  return (
    <PagePlaceholder title={t('pages.contact.title')} subtitle={t('pages.contact.subtitle')}>
      <InfoPanel title={t('pages.contact.panelTitle')}>
        <div className="grid gap-6 lg:grid-cols-[1fr_1.4fr]">
          <div className="space-y-3 text-sm">
            <p>{t('pages.contact.emailLine')}</p>
            <p>{t('pages.contact.locationLine')}</p>
            <p>{t('pages.contact.responseLine')}</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input className="input" placeholder={t('pages.contact.namePlaceholder')} />
            <input className="input" placeholder={t('pages.contact.emailPlaceholder')} type="email" />
            <textarea className="input min-h-[130px] resize-none" placeholder={t('pages.contact.messagePlaceholder')} />
            <button
              type="submit"
              className="hero-cta rounded-lg bg-gradient-to-b from-gold-bright to-gold-deep px-5 py-3 font-semibold text-bg-deep transition"
            >
              {t('pages.contact.submit')}
            </button>
          </form>
        </div>
      </InfoPanel>
    </PagePlaceholder>
  )
}
