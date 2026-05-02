import { useEffect, useRef, useState } from 'react'
import { Bot, Loader2, MessageCircle, Send, X } from 'lucide-react'
import { chatAPI } from '../services/api'
import { useLanguage } from '../i18n/LanguageContext'

export default function ChatbotWidget() {
  const { t, language } = useLanguage()
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([{ role: 'assistant', content: t('chatbot.welcome'), systemWelcome: true }])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const scrollRef = useRef(null)

  useEffect(() => {
    setMessages(current => current.map((message, index) => (
      index === 0 && message.systemWelcome
        ? { ...message, content: t('chatbot.welcome') }
        : message
    )))
  }, [language, t])

  const sendMessage = async (event) => {
    event?.preventDefault()
    const content = input.trim()
    if (!content || loading) return

    const nextMessages = [...messages, { role: 'user', content }]
    setMessages(nextMessages)
    setInput('')
    setLoading(true)

    requestAnimationFrame(() => {
      scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
    })

    try {
      const { data } = await chatAPI.send(nextMessages.slice(1))
      setMessages([...nextMessages, { role: 'assistant', content: data.reply }])
    } catch (err) {
      setMessages([
        ...nextMessages,
        {
          role: 'assistant',
          content: err.response?.data?.message || t('chatbot.error'),
          error: true,
        },
      ])
    } finally {
      setLoading(false)
      requestAnimationFrame(() => {
        scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
      })
    }
  }

  return (
    <div className="fixed bottom-4 right-4 z-[2500]">
      {open && (
        <div className="mb-3 w-[calc(100vw-2rem)] max-w-sm overflow-hidden rounded-2xl border border-stone-700 bg-stone-950 shadow-2xl">
          <div className="flex items-center justify-between border-b border-stone-800 bg-stone-900 px-4 py-3">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500 text-stone-950">
                <Bot size={17} />
              </div>
              <div>
                <div className="text-sm font-semibold text-stone-100">{t('chatbot.title')}</div>
                <div className="text-xs text-stone-500">{t('chatbot.subtitle')}</div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-lg p-1.5 text-stone-500 transition-colors hover:bg-stone-800 hover:text-stone-200"
              aria-label={t('chatbot.close')}
            >
              <X size={16} />
            </button>
          </div>

          <div ref={scrollRef} className="max-h-80 space-y-3 overflow-y-auto px-4 py-4">
            {messages.map((message, index) => (
              <div key={`${message.role}-${index}`} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[82%] rounded-2xl px-3 py-2 text-sm leading-relaxed ${
                    message.role === 'user'
                      ? 'bg-amber-500 text-stone-950'
                      : message.error
                        ? 'border border-red-500/30 bg-red-500/10 text-red-200'
                        : 'bg-stone-900 text-stone-200'
                  }`}
                >
                  {message.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="flex items-center gap-2 rounded-2xl bg-stone-900 px-3 py-2 text-sm text-stone-400">
                  <Loader2 size={14} className="animate-spin" />
                  {t('chatbot.thinking')}
                </div>
              </div>
            )}
          </div>

          <form onSubmit={sendMessage} className="flex gap-2 border-t border-stone-800 p-3">
            <input
              className="input min-w-0 flex-1 text-sm"
              placeholder={t('chatbot.placeholder')}
              value={input}
              onChange={event => setInput(event.target.value)}
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500 text-stone-950 transition-colors hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-50"
              aria-label={t('chatbot.send')}
            >
              {loading ? <Loader2 size={17} className="animate-spin" /> : <Send size={17} />}
            </button>
          </form>
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen(current => !current)}
        className="ml-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500 text-stone-950 shadow-xl shadow-black/30 transition-transform hover:scale-105"
        aria-label={t('chatbot.open')}
      >
        {open ? <X size={22} /> : <MessageCircle size={22} />}
      </button>
    </div>
  )
}
