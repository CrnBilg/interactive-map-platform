import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { LANGUAGE_STORAGE_KEY, entityTranslations, translations } from './translations'
import { knownPlaceDescriptionTranslations, knownPlaceNameTranslations } from './knownPlaceTranslations'

const LanguageContext = createContext(null)

const getPath = (source, key) => key.split('.').reduce((value, part) => value?.[part], source)

const interpolate = (value, params = {}) => {
  if (typeof value !== 'string') return value
  return Object.entries(params).reduce(
    (text, [key, param]) => text.replaceAll(`{${key}}`, String(param)),
    value,
  )
}

const normalizeTurkishText = (value = '') => String(value)
  .toLocaleLowerCase('tr-TR')
  .trim()
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .replace(/[çÇ]/g, 'c')
  .replace(/[ğĞ]/g, 'g')
  .replace(/[ıİ]/g, 'i')
  .replace(/[öÖ]/g, 'o')
  .replace(/[şŞ]/g, 's')
  .replace(/[üÜ]/g, 'u')
  .replace(/[âÂ]/g, 'a')
  .replace(/[îÎ]/g, 'i')
  .replace(/[ûÛ]/g, 'u')
  .replace(/[’‘`´]/g, "'")
  .replace(/\s+/g, ' ')

const turkishPossessiveSuffixes = ['si', 'sı', 'su', 'sü']
const turkishPossessiveBufferSuffixes = ['yi', 'yı', 'yu', 'yü']
const turkishVowelPossessiveSuffixes = ['i', 'ı', 'u', 'ü']

export const removeTurkishSuffix = (word = '') => {
  const lower = word.toLocaleLowerCase('tr-TR')
  const suffix = turkishPossessiveSuffixes.find(ending => lower.endsWith(ending))
  if (suffix && word.length > suffix.length + 1) return word.slice(0, -suffix.length)

  const bufferSuffix = turkishPossessiveBufferSuffixes.find(ending => lower.endsWith(ending))
  if (bufferSuffix && word.length > bufferSuffix.length + 1) return word.slice(0, -bufferSuffix.length)

  const vowelSuffix = turkishVowelPossessiveSuffixes.find(ending => lower.endsWith(ending))
  if (vowelSuffix && word.length > vowelSuffix.length + 2) return word.slice(0, -vowelSuffix.length)

  return word
}

const preserveCase = (source, translated) => {
  if (!source || !translated) return translated
  if (source === source.toLocaleUpperCase('tr-TR')) return translated.toLocaleUpperCase('en-US')
  return translated
}

const translateWord = (dictionary, word) => {
  if (dictionary[word]) return dictionary[word]
  const normalized = removeTurkishSuffix(word)
  if (normalized !== word && dictionary[normalized]) {
    return preserveCase(word, dictionary[normalized])
  }
  return word
}

const replaceDictionaryPhrases = (dictionary, text) => {
  let translated = text
  const entries = Object.entries(dictionary)
    .filter(([source]) => source.includes(' '))
    .sort((a, b) => b[0].length - a[0].length)

  for (const [source, target] of entries) translated = translated.replaceAll(source, target)
  return translated
}

const translateKnown = (language, value) => {
  if (language === 'tr' || value === null || value === undefined) return value
  const dictionary = entityTranslations[language] || {}
  const text = String(value)
  if (dictionary[text]) return dictionary[text]

  const normalizedText = normalizeTurkishText(text)
  const normalizedEntry = Object.entries(dictionary).find(([source]) => normalizeTurkishText(source) === normalizedText)
  if (normalizedEntry) return normalizedEntry[1]
  if (knownPlaceDescriptionTranslations[normalizedText]) return knownPlaceDescriptionTranslations[normalizedText]

  const phraseTranslated = replaceDictionaryPhrases(dictionary, text)
  return phraseTranslated.replace(/[\p{L}]+/gu, word => translateWord(dictionary, word))
}

const transliterateTurkish = (value = '') => String(value)
  .replace(/Ç/g, 'C')
  .replace(/ç/g, 'c')
  .replace(/Ğ/g, 'G')
  .replace(/ğ/g, 'g')
  .replace(/İ/g, 'I')
  .replace(/ı/g, 'i')
  .replace(/Ö/g, 'O')
  .replace(/ö/g, 'o')
  .replace(/Ş/g, 'S')
  .replace(/ş/g, 's')
  .replace(/Ü/g, 'U')
  .replace(/ü/g, 'u')
  .replace(/Â/g, 'A')
  .replace(/â/g, 'a')
  .replace(/Î/g, 'I')
  .replace(/î/g, 'i')
  .replace(/Û/g, 'U')
  .replace(/û/g, 'u')

const findNormalizedDictionaryValue = (dictionary, value) => {
  const normalizedValue = normalizeTurkishText(value)
  return Object.entries(dictionary).find(([source]) => normalizeTurkishText(source) === normalizedValue)?.[1]
}

const placeNamePhraseReplacements = [
  ['Tarihi Alanı', 'Historic Site'],
  ['Saat Kulesi', 'Clock Tower'],
  ['Yarımadası', 'Peninsula'],
  ['Milli Parkı', 'National Park'],
  ['Harabeleri', 'Ruins'],
  ['Peri Bacaları', 'Fairy Chimneys'],
  ['Ağlayan Kaya', 'Weeping Rock'],
  ['Antik Kenti', 'Ancient City'],
  ['Antik Tiyatrosu', 'Ancient Theater'],
]

const priorityPlaceNameSuffixRules = [
  { suffix: 'Tarihi Alanı', format: base => `${base} Historic Site` },
  { suffix: 'Antik Kenti', format: base => `${base} Ancient City` },
  { suffix: 'Antik Tiyatrosu', format: base => `${base} Ancient Theater` },
  { suffix: 'Saat Kulesi', format: base => `${base} Clock Tower` },
  { suffix: 'Yarımadası', format: base => `${base} Peninsula` },
  { suffix: 'Milli Parkı', format: base => `${base} National Park` },
  { suffix: 'Harabeleri', format: base => `${base} Ruins` },
  { suffix: 'Peri Bacaları', format: base => `${base} Fairy Chimneys` },
]

const placeNameSuffixRules = [
  { suffix: 'Bahçeleri', format: base => `${base} Gardens` },
  { suffix: 'Bahçesi', format: base => `${base} Garden` },
  { suffix: 'Dağı', format: base => `Mount ${base}` },
  { suffix: 'Gölü', format: base => `Lake ${base}` },
  { suffix: 'Müzesi', format: base => `${base} Museum` },
  { suffix: 'Kalesi', format: base => `${base} Castle` },
  { suffix: 'Köprüsü', format: base => `${base} Bridge` },
  { suffix: 'Sarayı', format: base => `${base} Palace` },
  { suffix: 'Camii', format: base => `${base} Mosque` },
  { suffix: 'Camisi', format: base => `${base} Mosque` },
  { suffix: 'Kilisesi', format: base => `${base} Church` },
  { suffix: 'Manastırı', format: base => `${base} Monastery` },
  { suffix: 'Feneri', format: base => `${base} Lighthouse` },
  { suffix: 'Şelalesi', format: base => `${base} Waterfall` },
  { suffix: 'Mağarası', format: base => `${base} Cave` },
  { suffix: 'Höyüğü', format: base => `${base} Mound` },
  { suffix: 'Harabeleri', format: base => `${base} Ruins` },
  { suffix: 'Vadisi', format: base => `${base} Valley` },
  { suffix: 'Adası', format: base => `${base} Island` },
  { suffix: 'Koyu', format: base => `${base} Bay` },
  { suffix: 'Plajı', format: base => `${base} Beach` },
  { suffix: 'Parkı', format: base => `${base} Park` },
  { suffix: 'Anıtı', format: base => `${base} Monument` },
  { suffix: 'Türbesi', format: base => `${base} Tomb` },
  { suffix: 'Medresesi', format: base => `${base} Madrasa` },
  { suffix: 'Medrese', format: base => `${base} Madrasa` },
  { suffix: 'Hanı', format: base => `${base} Caravanserai` },
  { suffix: 'Han', format: base => `${base} Caravanserai` },
  { suffix: 'Bedesten', format: base => `${base} Covered Bazaar` },
  { suffix: 'Hamamı', format: base => `${base} Turkish Bath` },
  { suffix: 'Hamam', format: base => `${base} Turkish Bath` },
  { suffix: 'Çarşısı', format: base => `${base} Bazaar` },
  { suffix: 'Kaplıcaları', format: base => `${base} Thermal Springs` },
]

const allPlaceNameSuffixRules = [
  ...priorityPlaceNameSuffixRules,
  ...placeNameSuffixRules,
]

const ottomanStructureTypes = [
  { patterns: ['tasmedrese'], type: 'Madrasa' },
  { patterns: ['medrese', 'medresesi'], type: 'Madrasa' },
  { patterns: ['tashan', 'tashani', 'tas han'], type: 'Caravanserai' },
  { patterns: ['han', 'hani'], type: 'Caravanserai' },
  { patterns: ['bedesten'], type: 'Covered Bazaar' },
  { patterns: ['hamam', 'hamami'], type: 'Turkish Bath' },
]

const getOttomanStructureType = (value) => {
  const normalized = normalizeTurkishText(value).replace(/'/g, '')
  const compact = normalized.replace(/\s+/g, '')

  for (const { patterns, type } of ottomanStructureTypes) {
    if (patterns.some(pattern => compact.includes(pattern.replace(/\s+/g, '')))) return type
  }

  return null
}

const translateCompoundPlaceName = (language, value) => {
  const parts = String(value).split(/\s+(?:ve|and)\s+/giu).map(part => part.trim()).filter(Boolean)
  if (parts.length < 2) return null

  const translatedParts = parts.map(part => translatePlaceNameSegment(language, part))
  const structureTypes = parts.map(getOttomanStructureType).filter(Boolean)
  const displayName = parts.map(part => transliterateTurkish(part)).join(' and ')

  if (structureTypes.length >= 2) return `${displayName} (${structureTypes.join(' & ')})`
  return translatedParts.join(' and ')
}

const replacePlaceNamePhrases = (value) => placeNamePhraseReplacements.reduce(
  (text, [source, target]) => {
    const pattern = new RegExp(source, 'giu')
    return text.replace(pattern, target)
  },
  value,
)

const translatePlaceNameSegment = (language, value) => {
  const dictionary = entityTranslations[language] || {}
  const text = String(value).trim()
  if (!text) return text
  if (dictionary[text]) return dictionary[text]
  const normalizedExact = findNormalizedDictionaryValue(dictionary, text)
  if (normalizedExact) return normalizedExact
  const normalizedName = normalizeTurkishText(text)
  const compoundTranslated = translateCompoundPlaceName(language, text)
  if (compoundTranslated) return compoundTranslated

  for (const { suffix, format } of allPlaceNameSuffixRules) {
    const normalizedText = normalizeTurkishText(text)
    const normalizedSuffix = normalizeTurkishText(suffix)
    if (normalizedText.endsWith(` ${normalizedSuffix}`)) {
      const base = text.slice(0, text.length - suffix.length).trim()
      return format(translatePlaceNameSegment(language, base))
    }
  }

  const phraseTranslated = replacePlaceNamePhrases(text)
  const wordTranslated = phraseTranslated.replace(/[\p{L}]+/gu, word => translateWord(dictionary, word))
  const transliterated = transliterateTurkish(wordTranslated)
  if (transliterated !== transliterateTurkish(text)) return transliterated
  return knownPlaceNameTranslations[normalizedName] ?? transliterated
}

const translatePlaceName = (language, value) => {
  if (language === 'tr' || value === null || value === undefined) return value
  const text = String(value)
  const dictionary = entityTranslations[language] || {}
  if (dictionary[text]) return dictionary[text]
  const normalizedExact = findNormalizedDictionaryValue(dictionary, text)
  if (normalizedExact) return normalizedExact
  return text.split('/').map(part => translatePlaceNameSegment(language, part)).join(' / ')
}

const replaceDescriptionPlaceName = (language, description, sourceName, displayName) => {
  if (language === 'tr' || !description || !sourceName || !displayName) return description

  const generatedName = knownPlaceNameTranslations[normalizeTurkishText(sourceName)]
  const candidates = [sourceName, transliterateTurkish(sourceName), generatedName]
    .filter(Boolean)
    .sort((a, b) => b.length - a.length)

  const match = candidates.find(candidate => normalizeTurkishText(description).startsWith(normalizeTurkishText(candidate)))
  if (!match || normalizeTurkishText(match) === normalizeTurkishText(displayName)) return description

  return `${displayName}${description.slice(match.length)}`
}

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => {
    const saved = localStorage.getItem(LANGUAGE_STORAGE_KEY)
    return saved === 'en' || saved === 'tr' ? saved : 'tr'
  })

  useEffect(() => {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, language)
    document.documentElement.lang = language
    document.title = translations[language].app.title
  }, [language])

  const value = useMemo(() => {
    const t = (key, params) => {
      const translated = getPath(translations[language], key)
      const fallback = getPath(translations.tr, key)
      return interpolate(translated ?? fallback ?? key, params)
    }

    const translateEntity = (text) => translateKnown(language, text)
    const translatePlace = (place) => {
      if (!place) return place
      const sourceName = place.name ?? place.title
      const name = translatePlaceName(language, sourceName)
      const title = translatePlaceName(language, place.title ?? place.name)
      const description = replaceDescriptionPlaceName(language, translateEntity(place.description), sourceName, name)
      const city = translateEntity(place.city)
      const district = translateEntity(place.district)
      const address = translateEntity(place.address)
      const period = translateEntity(place.period)
      const era = translateEntity(place.era)
      const category = place.category ? (getPath(translations[language], `categories.${place.category}`) ?? translateEntity(place.category)) : place.category
      const tags = Array.isArray(place.tags) ? place.tags.map(translateEntity) : place.tags
      const location = typeof place.location === 'string' ? translateEntity(place.location) : place.location
      const openingHours = translateEntity(place.openingHours)

      return {
        ...place,
        name,
        title,
        description,
        city,
        district,
        address,
        period,
        era,
        category,
        tags,
        location,
        openingHours,
        displayName: name,
        displayTitle: title,
        displayDescription: description,
        displayCity: city,
        displayDistrict: district,
        displayAddress: address,
        displayPeriod: period,
        displayEra: era,
        displayCategory: category,
        displayOpeningHours: openingHours,
        displayTags: tags,
        displayLocation: location,
      }
    }
    const translateCity = (city) => city && ({
      ...city,
      displayName: translateEntity(city.name),
      displayDescription: translateEntity(city.description),
      displayRegion: translateEntity(city.region),
    })
    const translateEvent = (event) => event && ({
      ...event,
      displayTitle: translateEntity(event.title),
      displayDescription: translateEntity(event.description),
      displayCity: translateEntity(event.city),
      displayType: t(`eventTypes.${event.type}`),
    })

    return {
      language,
      t,
      toggleLanguage: () => setLanguage(current => (current === 'tr' ? 'en' : 'tr')),
      translateEntity,
      translatePlaceName: (name) => translatePlaceName(language, name),
      translatePlace,
      translateCity,
      translateEvent,
    }
  }, [language])

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export const useLanguage = () => {
  const context = useContext(LanguageContext)
  if (!context) throw new Error('useLanguage must be used within LanguageProvider')
  return context
}
