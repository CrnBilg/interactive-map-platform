const pad = (value) => String(value).padStart(2, '0')

const formatDate = (date) => `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`

const addDays = (days) => {
  const date = new Date()
  date.setDate(date.getDate() + days)
  return formatDate(date)
}

const getNextThursday = () => {
  const date = new Date()
  const thursday = 4
  const daysUntilThursday = (thursday - date.getDay() + 7) % 7
  date.setDate(date.getDate() + daysUntilThursday)
  return formatDate(date)
}

const demoEvents = [
  {
    id: 'live-music-thursday',
    titleTR: 'Canlı Müzik Etkinliği',
    titleEN: 'Live Music Event',
    descriptionTR: 'Şehir merkezinde yerel müzisyenlerin sahne aldığı özel canlı müzik buluşması.',
    descriptionEN: 'A special live music gathering featuring local musicians in the city center.',
    city: 'Istanbul',
    venue: 'City Center',
    coordinates: [41.0082, 28.9784],
    date: getNextThursday(),
    time: '14:30',
    category: 'Music',
  },
  {
    id: '1',
    titleTR: 'İstanbul Müze Gecesi',
    titleEN: 'Istanbul Museum Night',
    descriptionTR: 'Şehrin önemli müzelerinde gece boyunca rehberli turlar, konserler ve özel sergiler düzenlenir.',
    descriptionEN: 'Major museums across the city host guided tours, concerts, and special exhibitions throughout the night.',
    city: 'Istanbul',
    venue: 'Various Museums',
    coordinates: [41.0082, 28.9784],
    date: addDays(1),
    time: '20:00',
    category: 'Culture',
  },
  {
    id: '2',
    titleTR: 'Ankara Çağdaş Sanat Akşamı',
    titleEN: 'Ankara Contemporary Art Evening',
    descriptionTR: 'Yerel sanatçıların yeni medya, heykel ve fotoğraf çalışmaları müzik performanslarıyla birlikte sunulur.',
    descriptionEN: 'Local artists present new media, sculpture, and photography works alongside live music performances.',
    city: 'Ankara',
    venue: 'CerModern',
    coordinates: [39.9328, 32.8446],
    date: addDays(2),
    time: '19:30',
    category: 'Exhibition',
  },
  {
    id: '3',
    titleTR: 'İzmir Kordon Caz Buluşması',
    titleEN: 'Izmir Kordon Jazz Gathering',
    descriptionTR: 'Kordon sahilinde Ege ezgileriyle harmanlanan açık hava caz konserleri gerçekleşir.',
    descriptionEN: 'Open-air jazz concerts blend Aegean melodies with seaside performances along Kordon.',
    city: 'Izmir',
    venue: 'Kordon',
    coordinates: [38.4328, 27.1419],
    date: addDays(3),
    time: '21:00',
    category: 'Music',
  },
  {
    id: '4',
    titleTR: 'Konya Sema ve Tasavvuf Gecesi',
    titleEN: 'Konya Sema and Sufi Night',
    descriptionTR: 'Mevlana kültürünü yaşatan sema gösterisi, ney dinletisi ve anlatımlı kültür programı yapılır.',
    descriptionEN: 'A cultural program presents the Mevlevi sema ceremony, ney music, and guided storytelling.',
    city: 'Konya',
    venue: 'Mevlana Cultural Center',
    coordinates: [37.8707, 32.5044],
    date: addDays(4),
    time: '20:30',
    category: 'Heritage',
  },
  {
    id: '5',
    titleTR: 'Gaziantep Gastronomi ve El Sanatları Pazarı',
    titleEN: 'Gaziantep Gastronomy and Crafts Market',
    descriptionTR: 'Bakır işçiliği, geleneksel tatlar ve canlı mutfak sunumları tarihi merkezde ziyaretçilerle buluşur.',
    descriptionEN: 'Copperwork, traditional flavors, and live culinary demonstrations meet visitors in the historic center.',
    city: 'Gaziantep',
    venue: 'Bakırcılar Çarşısı',
    coordinates: [37.0662, 37.3833],
    date: addDays(2),
    time: '18:00',
    category: 'Gastronomy',
  },
  {
    id: '6',
    titleTR: 'Antalya Kaleiçi Sokak Müzikleri',
    titleEN: 'Antalya Kaleici Street Music',
    descriptionTR: 'Kaleiçi sokaklarında Akdeniz ritimleri, akustik gruplar ve kısa dans performansları sergilenir.',
    descriptionEN: 'Mediterranean rhythms, acoustic groups, and short dance performances fill the streets of Kaleici.',
    city: 'Antalya',
    venue: 'Kaleiçi',
    coordinates: [36.8841, 30.7056],
    date: addDays(5),
    time: '20:00',
    category: 'Music',
  },
  {
    id: '7',
    titleTR: 'Bursa Hanlar Bölgesi Kültür Rotası',
    titleEN: 'Bursa Khans District Culture Route',
    descriptionTR: 'Hanlar Bölgesi boyunca geleneksel sanat atölyeleri, anlatımlı yürüyüşler ve mini konserler düzenlenir.',
    descriptionEN: 'Traditional art workshops, narrated walks, and mini concerts take place across the Khans District.',
    city: 'Bursa',
    venue: 'Koza Han',
    coordinates: [40.1828, 29.0662],
    date: addDays(6),
    time: '17:30',
    category: 'Culture',
  },
  {
    id: '8',
    titleTR: 'Diyarbakır Sur Hikaye Anlatımı',
    titleEN: 'Diyarbakir Sur Storytelling Night',
    descriptionTR: 'Sur içi avlularında dengbej anlatıları, yerel müzik ve kısa belgesel gösterimleri yapılır.',
    descriptionEN: 'Courtyards inside Sur host dengbej storytelling, local music, and short documentary screenings.',
    city: 'Diyarbakir',
    venue: 'Sur District',
    coordinates: [37.9144, 40.2306],
    date: addDays(3),
    time: '19:00',
    category: 'Storytelling',
  },
  {
    id: '9',
    titleTR: 'Trabzon Karadeniz Halk Dansları',
    titleEN: 'Trabzon Black Sea Folk Dance',
    descriptionTR: 'Horon ekipleri, kemençe dinletileri ve yerel kıyafet sunumları sahil meydanında gerçekleşir.',
    descriptionEN: 'Horon groups, kemenche music, and local costume presentations take place in the seaside square.',
    city: 'Trabzon',
    venue: 'Meydan Park',
    coordinates: [41.0050, 39.7269],
    date: addDays(7),
    time: '18:30',
    category: 'Dance',
  },
  {
    id: '10',
    titleTR: 'Mardin Taş Konaklarda Fotoğraf Sergisi',
    titleEN: 'Mardin Stone Mansions Photography Exhibition',
    descriptionTR: 'Tarihi taş konaklarda Mezopotamya mimarisi ve sokak yaşamını konu alan fotoğraf sergisi açılır.',
    descriptionEN: 'Historic stone mansions host a photography exhibition on Mesopotamian architecture and street life.',
    city: 'Mardin',
    venue: 'Old Mardin Mansions',
    coordinates: [37.3122, 40.7350],
    date: addDays(8),
    time: '16:00',
    category: 'Exhibition',
  },
]

export default demoEvents
