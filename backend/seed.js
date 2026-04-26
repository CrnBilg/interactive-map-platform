const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
dotenv.config();

const City = require('./models/City');
const Place = require('./models/Place');
const User = require('./models/User');

const cities = [
  { name: 'İstanbul', nameEn: 'Istanbul', region: 'Marmara', location: { type: 'Point', coordinates: [28.9784, 41.0082] }, description: 'Tarihin kalbi, iki kıtanın buluşma noktası', placeCount: 0 },
  { name: 'Ankara', nameEn: 'Ankara', region: 'İç Anadolu', location: { type: 'Point', coordinates: [32.8597, 39.9334] }, description: 'Cumhuriyetin başkenti', placeCount: 0 },
  { name: 'İzmir', nameEn: 'Izmir', region: 'Ege', location: { type: 'Point', coordinates: [27.1428, 38.4237] }, description: 'Ege\'nin incisi', placeCount: 0 },
  { name: 'Konya', nameEn: 'Konya', region: 'İç Anadolu', location: { type: 'Point', coordinates: [32.4872, 37.8746] }, description: 'Mevlana\'nın şehri', placeCount: 0 },
  { name: 'Bursa', nameEn: 'Bursa', region: 'Marmara', location: { type: 'Point', coordinates: [29.0601, 40.1826] }, description: 'Osmanlı\'nın ilk başkenti', placeCount: 0 },
  { name: 'Trabzon', nameEn: 'Trabzon', region: 'Karadeniz', location: { type: 'Point', coordinates: [39.7178, 41.0027] }, description: 'Karadeniz\'in gözbebeği', placeCount: 0 },
  { name: 'Antalya', nameEn: 'Antalya', region: 'Akdeniz', location: { type: 'Point', coordinates: [30.7133, 36.8969] }, description: 'Turquoise Coast\'un kalbi', placeCount: 0 },
  { name: 'Cappadocia', nameEn: 'Cappadocia', region: 'İç Anadolu', location: { type: 'Point', coordinates: [34.8457, 38.6431] }, description: 'Peri bacaları ve yeraltı şehirleri', placeCount: 0 },
];

const places = [
  // İstanbul
  { name: 'Ayasofya', description: 'Bizans döneminde inşa edilmiş, sonra camiye dönüştürülmüş eşsiz yapı. Milattan sonra 537 yılında tamamlanmıştır.', category: 'historical', city: 'İstanbul', location: { type: 'Point', coordinates: [28.9800, 41.0086] }, period: 'Byzantine', entryFee: 0, openingHours: '09:00 - 18:00', address: 'Sultan Ahmet, Ayasofya Meydanı', images: ['https://upload.wikimedia.org/wikipedia/commons/thumb/2/22/Hagia_Sophia_Istanbul_2023.jpg/1280px-Hagia_Sophia_Istanbul_2023.jpg'] },
  { name: 'Topkapı Sarayı', description: 'Osmanlı İmparatorluğu\'nun 400 yıllık merkezi. Padişahların yaşadığı büyük saray kompleksi.', category: 'historical', city: 'İstanbul', location: { type: 'Point', coordinates: [28.9836, 41.0115] }, period: 'Ottoman', entryFee: 350, openingHours: '09:00 - 18:45', address: 'Cankurtaran, 34122 Fatih/İstanbul', images: [] },
  { name: 'Sultanahmet Camii', description: 'Altı minaresiyle dünyaca ünlü Mavi Cami. 1616 yılında tamamlanmıştır.', category: 'mosque', city: 'İstanbul', location: { type: 'Point', coordinates: [28.9772, 41.0054] }, period: 'Ottoman', entryFee: 0, openingHours: 'Namaz vakitleri dışında açık', address: 'Sultan Ahmet, Atmeydanı', images: [] },
  { name: 'Kapalıçarşı', description: 'Dünyanın en büyük ve en eski kapalı çarşılarından biri. 4000\'den fazla dükkan barındırır.', category: 'historical', city: 'İstanbul', location: { type: 'Point', coordinates: [28.9676, 41.0108] }, period: 'Ottoman', entryFee: 0, openingHours: '09:00 - 19:00', address: 'Beyazıt, Kalpakçılar Başı Cd.', images: [] },
  { name: 'Rumeli Hisarı', description: '1452 yılında Fatih Sultan Mehmet tarafından İstanbul kuşatmasından önce inşa ettirilen kale.', category: 'castle', city: 'İstanbul', location: { type: 'Point', coordinates: [29.0544, 41.0851] }, period: 'Ottoman', entryFee: 50, openingHours: '09:00 - 18:30', address: 'Rumeli Hisarı, Beykoz', images: [] },

  // Ankara
  { name: 'Anıtkabir', description: 'Türkiye Cumhuriyeti\'nin kurucusu Atatürk\'ün anıt mezarı. Her yıl milyonlarca kişi ziyaret eder.', category: 'monument', city: 'Ankara', location: { type: 'Point', coordinates: [32.8362, 39.9255] }, period: 'Modern', entryFee: 0, openingHours: '09:00 - 17:00', address: 'Anıttepe, Çankaya/Ankara', images: [] },
  { name: 'Ankara Kalesi', description: 'Romalılar döneminden kalma, şehrin merkezinde yükselen tarihi kale.', category: 'castle', city: 'Ankara', location: { type: 'Point', coordinates: [32.8639, 39.9409] }, period: 'Roman', entryFee: 0, openingHours: 'Gün boyu açık', address: 'Ulus, Altındağ/Ankara', images: [] },
  { name: 'Anadolu Medeniyetleri Müzesi', description: 'Dünyanın en önemli arkeoloji müzelerinden biri. Hitit ve Frigya eserlerini barındırır.', category: 'museum', city: 'Ankara', location: { type: 'Point', coordinates: [32.8618, 39.9397] }, period: 'Various', entryFee: 100, openingHours: '09:00 - 17:30', address: 'Gözcü Sk. No:2, Ulus/Ankara', images: [] },

  // Konya
  { name: 'Mevlana Müzesi', description: 'Hz. Mevlana Celaleddin Rumi\'nin türbesinin bulunduğu ve Mevlevilik\'in merkezi olan müze.', category: 'museum', city: 'Konya', location: { type: 'Point', coordinates: [32.4939, 37.8714] }, period: 'Seljuk', entryFee: 0, openingHours: '09:00 - 18:30', address: 'Aziziye, Mevlana Cd., Karatay/Konya', images: [] },
  { name: 'Alaeddin Camii', description: '12. yüzyılda inşa edilmiş Selçuklu dönemi camii. Konya\'nın simgelerinden biri.', category: 'mosque', city: 'Konya', location: { type: 'Point', coordinates: [32.4861, 37.8745] }, period: 'Seljuk', entryFee: 0, openingHours: 'Namaz vakitleri', address: 'Alaeddin Tepesi, Karatay/Konya', images: [] },

  // Antalya
  { name: 'Aspendos Tiyatrosu', description: 'M.S. 2. yüzyılda inşa edilmiş, dünyanın en iyi korunmuş antik tiyatrosu.', category: 'ruins', city: 'Antalya', location: { type: 'Point', coordinates: [31.1717, 36.9408] }, period: 'Roman', entryFee: 200, openingHours: '08:00 - 19:00', address: 'Serik/Antalya', images: [] },
  { name: 'Perge Antik Kenti', description: 'Anadolu\'nun önemli antik şehirlerinden biri. Hadrian\'ın Kapısı ve Roma hamamları dikkat çekicidir.', category: 'ruins', city: 'Antalya', location: { type: 'Point', coordinates: [30.8536, 36.9611] }, period: 'Roman', entryFee: 150, openingHours: '08:30 - 19:30', address: 'Aksu/Antalya', images: [] },

  // Trabzon
  { name: 'Sümela Manastırı', description: 'Karadeniz dağlarında kayaya oyulmuş Rum Ortodoks manastırı. M.S. 386 yılında kurulmuştur.', category: 'historical', city: 'Trabzon', location: { type: 'Point', coordinates: [39.6572, 40.6908] }, period: 'Byzantine', entryFee: 200, openingHours: '09:00 - 18:00', address: 'Altındere Vadisi, Maçka/Trabzon', images: [] },

  // Cappadocia
  { name: 'Derinkuyu Yeraltı Şehri', description: '85 metre derinliğe inen, 20.000 kişinin yaşayabildiği Bizans dönemi yeraltı şehri.', category: 'historical', city: 'Cappadocia', location: { type: 'Point', coordinates: [34.7353, 38.3737] }, period: 'Byzantine', entryFee: 200, openingHours: '08:00 - 19:00', address: 'Derinkuyu/Nevşehir', images: [] },
  { name: 'Göreme Açık Hava Müzesi', description: 'UNESCO Dünya Mirası. Kaya kiliseleri ve fresklerle dolu vadide gezinti imkanı sunar.', category: 'museum', city: 'Cappadocia', location: { type: 'Point', coordinates: [34.8285, 38.6433] }, period: 'Byzantine', entryFee: 350, openingHours: '08:00 - 19:00', address: 'Göreme/Nevşehir', images: [] },
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await City.deleteMany();
    await Place.deleteMany();
    await User.deleteMany();

    // Create admin user
    const admin = await User.create({
      username: 'admin',
      email: 'admin@citylore.com',
      password: 'admin123',
      role: 'admin',
    });
    console.log('✅ Admin user created (email: admin@citylore.com, password: admin123)');

    // Create test user
    await User.create({
      username: 'testuser',
      email: 'test@citylore.com',
      password: 'test123',
    });
    console.log('✅ Test user created (email: test@citylore.com, password: test123)');

    // Seed cities
    const createdCities = await City.insertMany(cities);
    console.log(`✅ ${createdCities.length} cities seeded`);

    // Seed places with city references
    const cityMap = {};
    createdCities.forEach((c) => { cityMap[c.name] = c._id; });

    const placesWithRefs = places.map((p) => ({
      ...p,
      cityId: cityMap[p.city] || null,
      addedBy: admin._id,
    }));

    const createdPlaces = await Place.insertMany(placesWithRefs);
    console.log(`✅ ${createdPlaces.length} places seeded`);

    // Update city place counts
    for (const city of createdCities) {
      const count = createdPlaces.filter((p) => p.city === city.name).length;
      await City.findByIdAndUpdate(city._id, { placeCount: count });
    }
    console.log('✅ City place counts updated');

    console.log('\n🎉 Database seeded successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Seed error:', err);
    process.exit(1);
  }
};

seedDB();
