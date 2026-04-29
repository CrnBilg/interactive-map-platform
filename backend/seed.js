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
  { name: 'Kayseri', nameEn: 'Kayseri', region: 'Ic Anadolu', location: { type: 'Point', coordinates: [35.4787, 38.7205] }, description: 'Selcuklu ve Osmanli mirasiyla Erciyes eteklerinde tarihi merkez', placeCount: 0 },
  { name: 'Eskisehir', nameEn: 'Eskisehir', region: 'Ic Anadolu', location: { type: 'Point', coordinates: [30.5256, 39.7767] }, description: 'Odunpazari evleri ve modern kultur yasamiyla one cikan Ic Anadolu sehri', placeCount: 0 },
  { name: 'Sivas', nameEn: 'Sivas', region: 'Ic Anadolu', location: { type: 'Point', coordinates: [37.0161, 39.7477] }, description: 'Selcuklu eserleri ve Divrigi mirasiyla taninan tarihi kent', placeCount: 0 },
  { name: 'Bursa', nameEn: 'Bursa', region: 'Marmara', location: { type: 'Point', coordinates: [29.0601, 40.1826] }, description: 'Osmanlı\'nın ilk başkenti', placeCount: 0 },
  { name: 'Edirne', nameEn: 'Edirne', region: 'Marmara', location: { type: 'Point', coordinates: [26.5557, 41.6771] }, description: 'Osmanli mimarisinin basyapitlarina ev sahipligi yapan serhat sehri', placeCount: 0 },
  { name: 'Canakkale', nameEn: 'Canakkale', region: 'Marmara', location: { type: 'Point', coordinates: [26.4086, 40.1467] }, description: 'Troyadan Geliboluya uzanan tarih koridoru', placeCount: 0 },
  { name: 'Trabzon', nameEn: 'Trabzon', region: 'Karadeniz', location: { type: 'Point', coordinates: [39.7178, 41.0027] }, description: 'Karadeniz\'in gözbebeği', placeCount: 0 },
  { name: 'Antalya', nameEn: 'Antalya', region: 'Akdeniz', location: { type: 'Point', coordinates: [30.7133, 36.8969] }, description: 'Turquoise Coast\'un kalbi', placeCount: 0 },
  { name: 'Cappadocia', nameEn: 'Cappadocia', region: 'İç Anadolu', location: { type: 'Point', coordinates: [34.8457, 38.6431] }, description: 'Peri bacaları ve yeraltı şehirleri', placeCount: 0 },
  { name: 'Muğla', nameEn: 'Mugla', region: 'Ege', location: { type: 'Point', coordinates: [28.3665, 37.2153] }, description: 'Ege\'nin ve Akdeniz\'in buluştuğu yer', placeCount: 0 },
  { name: 'Aydın', nameEn: 'Aydin', region: 'Ege', location: { type: 'Point', coordinates: [27.8456, 37.8380] }, description: 'Antik kentler diyarı', placeCount: 0 },
  { name: 'Denizli', nameEn: 'Denizli', region: 'Ege', location: { type: 'Point', coordinates: [29.0875, 37.7830] }, description: 'Pamukkale travertenlerinin ev sahibi', placeCount: 0 },
];

const places = [
  // İstanbul
  { name: 'Ayasofya', description: 'Bizans döneminde inşa edilmiş, sonra camiye dönüştürülmüş eşsiz yapı. Milattan sonra 537 yılında tamamlanmıştır.', category: 'historical', city: 'İstanbul', location: { type: 'Point', coordinates: [28.9800, 41.0086] }, period: 'Byzantine', entryFee: 0, openingHours: '09:00 - 18:00', address: 'Sultan Ahmet, Ayasofya Meydanı', images: ['https://upload.wikimedia.org/wikipedia/commons/thumb/2/22/Hagia_Sophia_Istanbul_2023.jpg/1280px-Hagia_Sophia_Istanbul_2023.jpg'], panoramaUrl: 'https://commons.wikimedia.org/wiki/Special:Redirect/file/Hagia_Sophia_(48985978757).jpg', has360: true },
  { name: 'Topkapı Sarayı', description: 'Osmanlı İmparatorluğu\'nun 400 yıllık merkezi. Padişahların yaşadığı büyük saray kompleksi.', category: 'historical', city: 'İstanbul', location: { type: 'Point', coordinates: [28.9836, 41.0115] }, period: 'Ottoman', entryFee: 350, openingHours: '09:00 - 18:45', address: 'Cankurtaran, 34122 Fatih/İstanbul', images: [], panoramaUrl: 'https://commons.wikimedia.org/wiki/Special:Redirect/file/Imperial_Treasury_Topkapi_panorama_2007.jpg', has360: true },
  { name: 'Sultanahmet Camii', description: 'Altı minaresiyle dünyaca ünlü Mavi Cami. 1616 yılında tamamlanmıştır.', category: 'mosque', city: 'İstanbul', location: { type: 'Point', coordinates: [28.9772, 41.0054] }, period: 'Ottoman', entryFee: 0, openingHours: 'Namaz vakitleri dışında açık', address: 'Sultan Ahmet, Atmeydanı', images: [] },
  { name: 'Kapalıçarşı', description: 'Dünyanın en büyük ve en eski kapalı çarşılarından biri. 4000\'den fazla dükkan barındırır.', category: 'historical', city: 'İstanbul', location: { type: 'Point', coordinates: [28.9676, 41.0108] }, period: 'Ottoman', entryFee: 0, openingHours: '09:00 - 19:00', address: 'Beyazıt, Kalpakçılar Başı Cd.', images: [] },
  { name: 'Rumeli Hisarı', description: '1452 yılında Fatih Sultan Mehmet tarafından İstanbul kuşatmasından önce inşa ettirilen kale.', category: 'castle', city: 'İstanbul', location: { type: 'Point', coordinates: [29.0544, 41.0851] }, period: 'Ottoman', entryFee: 50, openingHours: '09:00 - 18:30', address: 'Rumeli Hisarı, Beykoz', images: [] },
  { name: 'Dolmabahce Sarayi', description: 'Bogaz kiyisinda yer alan, Osmanlinin son donem saray mimarisinin en gorkemli orneklerinden biri.', category: 'historical', city: 'İstanbul', location: { type: 'Point', coordinates: [28.9998, 41.0390] }, period: 'Ottoman', entryFee: 450, openingHours: '09:00 - 17:30', address: 'Dolmabahce, Besiktas/Istanbul', images: [] },
  { name: 'Galata Kulesi', description: 'Beyoglunda yukselen Orta Cag kulesi, Istanbul panoramasinin en bilinen simgelerindendir.', category: 'monument', city: 'İstanbul', location: { type: 'Point', coordinates: [28.9742, 41.0256] }, period: 'Genoese', entryFee: 650, openingHours: '08:30 - 23:00', address: 'Buyuk Hendek Cd., Beyoglu/Istanbul', images: [] },
  { name: 'Yerebatan Sarnici', description: 'Bizans doneminden kalma yeralti su sarnici; Medusa basli sutun kaideleriyle unludur.', category: 'historical', city: 'İstanbul', location: { type: 'Point', coordinates: [28.9779, 41.0084] }, period: 'Byzantine', entryFee: 600, openingHours: '09:00 - 22:00', address: 'Yerebatan Cd., Fatih/Istanbul', images: [] },

  // Ankara
  { name: 'Anıtkabir', description: 'Türkiye Cumhuriyeti\'nin kurucusu Atatürk\'ün anıt mezarı. Her yıl milyonlarca kişi ziyaret eder.', category: 'monument', city: 'Ankara', location: { type: 'Point', coordinates: [32.8362, 39.9255] }, period: 'Modern', entryFee: 0, openingHours: '09:00 - 17:00', address: 'Anıttepe, Çankaya/Ankara', images: [], panoramaUrl: 'https://commons.wikimedia.org/wiki/Special:Redirect/file/An%C4%B1tkabir_%28_Atat%C3%BCrk_%29_360_Derece_Video_Panorama_Gezinti_-_360_Degree_Video.webm', has360: true },
  { name: 'Ankara Kalesi', description: 'Romalılar döneminden kalma, şehrin merkezinde yükselen tarihi kale.', category: 'castle', city: 'Ankara', location: { type: 'Point', coordinates: [32.8639, 39.9409] }, period: 'Roman', entryFee: 0, openingHours: 'Gün boyu açık', address: 'Ulus, Altındağ/Ankara', images: [] },
  { name: 'Anadolu Medeniyetleri Müzesi', description: 'Dünyanın en önemli arkeoloji müzelerinden biri. Hitit ve Frigya eserlerini barındırır.', category: 'museum', city: 'Ankara', location: { type: 'Point', coordinates: [32.8618, 39.9397] }, period: 'Various', entryFee: 100, openingHours: '09:00 - 17:30', address: 'Gözcü Sk. No:2, Ulus/Ankara', images: [] },
  { name: 'Haci Bayram Veli Camii', description: 'Ankara Ulus bolgesinde yer alan, Haci Bayram Veli Turbesi ile birlikte ziyaret edilen onemli dini ve tarihi merkez.', category: 'mosque', city: 'Ankara', location: { type: 'Point', coordinates: [32.8185, 39.9421] }, period: 'Ottoman', entryFee: 0, openingHours: 'Namaz vakitleri disinda acik', address: 'Ulus/Ankara', images: [] },
  { name: 'Kocatepe Camii', description: 'Ankaranin en buyuk ve en bilinen camilerinden biri; merkezi konumu ve anitsal mimarisiyle dikkat ceker.', category: 'mosque', city: 'Ankara', location: { type: 'Point', coordinates: [32.8609, 39.9025] }, period: 'Modern', entryFee: 0, openingHours: 'Namaz vakitleri disinda acik', address: 'Kocatepe, Cankaya/Ankara', images: [] },
  { name: 'Atakule', description: 'Cankaya siluetinin simgelerinden olan kule, Ankara manzarasi icin populer bir duraktir.', category: 'monument', city: 'Ankara', location: { type: 'Point', coordinates: [32.8561, 39.8861] }, period: 'Modern', entryFee: 0, openingHours: '10:00 - 22:00', address: 'Cinnah Cd., Cankaya/Ankara', images: [] },

  // Bursa / Edirne / Canakkale - Marmara
  { name: 'Bursa Ulu Camii', description: 'Erken Osmanli mimarisinin anitsal eserlerinden biri; hat levhalari ve cok kubbeli planiyla one cikar.', category: 'mosque', city: 'Bursa', location: { type: 'Point', coordinates: [29.0619, 40.1838] }, period: 'Ottoman', entryFee: 0, openingHours: 'Namaz vakitleri disinda acik', address: 'Osmangazi/Bursa', images: [] },
  { name: 'Selimiye Camii', description: 'Mimar Sinanin ustalik eseri olarak kabul edilen UNESCO Dunya Mirasi camii.', category: 'mosque', city: 'Edirne', location: { type: 'Point', coordinates: [26.5593, 41.6781] }, period: 'Ottoman', entryFee: 0, openingHours: 'Namaz vakitleri disinda acik', address: 'Meydan Mah., Edirne Merkez', images: [] },
  { name: 'Troya Antik Kenti', description: 'Homeros destanlariyla taninan, Canakkale yakinlarindaki UNESCO Dunya Mirasi arkeolojik alan.', category: 'ruins', city: 'Canakkale', location: { type: 'Point', coordinates: [26.2391, 39.9573] }, period: 'Bronze Age', entryFee: 600, openingHours: '08:30 - 19:00', address: 'Tevfikiye, Canakkale Merkez', images: [] },

  // Konya
  { name: 'Mevlana Müzesi', description: 'Hz. Mevlana Celaleddin Rumi\'nin türbesinin bulunduğu ve Mevlevilik\'in merkezi olan müze.', category: 'museum', city: 'Konya', location: { type: 'Point', coordinates: [32.4939, 37.8714] }, period: 'Seljuk', entryFee: 0, openingHours: '09:00 - 18:30', address: 'Aziziye, Mevlana Cd., Karatay/Konya', images: [] },
  { name: 'Alaeddin Camii', description: '12. yüzyılda inşa edilmiş Selçuklu dönemi camii. Konya\'nın simgelerinden biri.', category: 'mosque', city: 'Konya', location: { type: 'Point', coordinates: [32.4861, 37.8745] }, period: 'Seljuk', entryFee: 0, openingHours: 'Namaz vakitleri', address: 'Alaeddin Tepesi, Karatay/Konya', images: [] },
  { name: 'Catalhoyuk', description: 'Neolitik donemin en onemli yerlesimlerinden biri olan UNESCO Dunya Mirasi arkeolojik alan.', category: 'ruins', city: 'Konya', location: { type: 'Point', coordinates: [32.8269, 37.6685] }, period: 'Neolithic', entryFee: 0, openingHours: '09:00 - 17:00', address: 'Cumra/Konya', images: [] },
  { name: 'Sille', description: 'Konya yakinlarinda tarihi kiliseleri, tas sokaklari ve geleneksel dokusuyla bilinen eski yerlesim.', category: 'cultural', city: 'Konya', location: { type: 'Point', coordinates: [32.4185, 37.9282] }, period: 'Various', entryFee: 0, openingHours: 'Gunun her saati', address: 'Sille, Selcuklu/Konya', images: [] },

  // Kayseri / Eskisehir / Sivas - Ic Anadolu
  { name: 'Kayseri Kalesi', description: 'Kayseri merkezinde yer alan tarihi kale, Roma ve Selcuklu donemlerinden izler tasir.', category: 'castle', city: 'Kayseri', location: { type: 'Point', coordinates: [35.4894, 38.7211] }, period: 'Roman / Seljuk', entryFee: 0, openingHours: '09:00 - 18:00', address: 'Cumhuriyet Meydani, Kayseri', images: [] },
  { name: 'Erciyes Dagi', description: 'Kayseri yakinlarinda yer alan volkanik dag; kis sporlari ve dogal manzarasiyla populer bir destinasyon.', category: 'cultural', city: 'Kayseri', location: { type: 'Point', coordinates: [35.5877, 38.6563] }, period: 'Natural', entryFee: 0, openingHours: 'Gunun her saati', address: 'Erciyes/Kayseri', images: [] },
  { name: 'Odunpazari Evleri', description: 'Eskisehirin tarihi dokusunu koruyan renkli geleneksel evleri ve sokaklariyla unlu bolge.', category: 'cultural', city: 'Eskisehir', location: { type: 'Point', coordinates: [30.5354, 39.7682] }, period: 'Ottoman', entryFee: 0, openingHours: 'Gunun her saati', address: 'Odunpazari/Eskisehir', images: [] },
  { name: 'Divrigi Ulu Camii ve Darussifasi', description: 'Tas isciligiyle unlu UNESCO Dunya Mirasi Selcuklu donemi cami ve sifahanesi.', category: 'mosque', city: 'Sivas', location: { type: 'Point', coordinates: [38.1219, 39.3714] }, period: 'Seljuk', entryFee: 0, openingHours: '09:00 - 17:00', address: 'Divrigi/Sivas', images: [] },
  { name: 'Gok Medrese', description: 'Sivas merkezinde yer alan, mavi cinileri ve tas suslemeleriyle taninan Selcuklu medresesi.', category: 'historical', city: 'Sivas', location: { type: 'Point', coordinates: [37.0168, 39.7443] }, period: 'Seljuk', entryFee: 0, openingHours: '09:00 - 17:00', address: 'Gokmedrese Cd., Sivas', images: [] },
  // Antalya
  { name: 'Aspendos Tiyatrosu', description: 'M.S. 2. yüzyılda inşa edilmiş, dünyanın en iyi korunmuş antik tiyatrosu.', category: 'ruins', city: 'Antalya', location: { type: 'Point', coordinates: [31.1717, 36.9408] }, period: 'Roman', entryFee: 200, openingHours: '08:00 - 19:00', address: 'Serik/Antalya', images: [] },
  { name: 'Perge Antik Kenti', description: 'Anadolu\'nun önemli antik şehirlerinden biri. Hadrian\'ın Kapısı ve Roma hamamları dikkat çekicidir.', category: 'ruins', city: 'Antalya', location: { type: 'Point', coordinates: [30.8536, 36.9611] }, period: 'Roman', entryFee: 150, openingHours: '08:30 - 19:30', address: 'Aksu/Antalya', images: [] },

  // Trabzon
  { name: 'Sümela Manastırı', description: 'Karadeniz dağlarında kayaya oyulmuş Rum Ortodoks manastırı. M.S. 386 yılında kurulmuştur.', category: 'historical', city: 'Trabzon', location: { type: 'Point', coordinates: [39.6572, 40.6908] }, period: 'Byzantine', entryFee: 200, openingHours: '09:00 - 18:00', address: 'Altındere Vadisi, Maçka/Trabzon', images: [] },

  // Cappadocia
  { name: 'Derinkuyu Yeraltı Şehri', description: '85 metre derinliğe inen, 20.000 kişinin yaşayabildiği Bizans dönemi yeraltı şehri.', category: 'historical', city: 'Cappadocia', location: { type: 'Point', coordinates: [34.7353, 38.3737] }, period: 'Byzantine', entryFee: 200, openingHours: '08:00 - 19:00', address: 'Derinkuyu/Nevşehir', images: [] },
  { name: 'Göreme Açık Hava Müzesi', description: 'UNESCO Dünya Mirası. Kaya kiliseleri ve fresklerle dolu vadide gezinti imkanı sunar.', category: 'museum', city: 'Cappadocia', location: { type: 'Point', coordinates: [34.8285, 38.6433] }, period: 'Byzantine', entryFee: 350, openingHours: '08:00 - 19:00', address: 'Göreme/Nevşehir', images: [] },
  { name: 'Uchisar Kalesi', description: 'Kapadokyanin en yuksek kaya kalelerinden biri; bolgenin panoramik manzarasiyla bilinir.', category: 'castle', city: 'Cappadocia', location: { type: 'Point', coordinates: [34.8053, 38.6304] }, period: 'Byzantine', entryFee: 250, openingHours: '08:00 - 19:00', address: 'Uchisar/Nevsehir', images: [] },
  { name: 'Pasabag Vadisi', description: 'Peri bacalari ve kaya olusumlariyla Kapadokyanin en populer acik hava duraklarindan biri.', category: 'ruins', city: 'Cappadocia', location: { type: 'Point', coordinates: [34.8549, 38.6770] }, period: 'Various', entryFee: 0, openingHours: 'Gunun her saati', address: 'Avanos/Nevsehir', images: [] },
  { name: 'Zelve Acik Hava Muzesi', description: 'Kaya oyma yasam alanlari ve kiliseleriyle Kapadokyanin tarihi dokusunu gosteren acik hava muzesi.', category: 'museum', city: 'Cappadocia', location: { type: 'Point', coordinates: [34.8653, 38.6657] }, period: 'Byzantine', entryFee: 280, openingHours: '08:00 - 19:00', address: 'Avanos/Nevsehir', images: [] },
  { name: 'Kaymakli Yeralti Sehri', description: 'Kapadokyada cok katli savunma ve yasam alanlariyla bilinen tarihi yeralti sehri.', category: 'historical', city: 'Cappadocia', location: { type: 'Point', coordinates: [34.7525, 38.4599] }, period: 'Byzantine', entryFee: 300, openingHours: '08:00 - 19:00', address: 'Kaymakli/Nevsehir', images: [] },

  // Ege Bölgesi (İzmir, Aydın, Denizli, Muğla)
  { name: 'Efes Antik Kenti', description: 'UNESCO Dünya Mirası. Antik çağın en önemli liman şehirlerinden ve Roma İmparatorluğu\'nun Asya eyaleti başkenti.', category: 'ruins', city: 'İzmir', location: { type: 'Point', coordinates: [27.3411, 37.9411] }, period: 'Roman', entryFee: 400, openingHours: '08:00 - 18:30', address: 'Selçuk/İzmir', images: [], has360: true, panoramaUrl: 'https://commons.wikimedia.org/wiki/Special:Redirect/file/Celsus_Library_Ephesus_Turkey.jpg' },
  { name: 'Hierapolis Antik Kenti', description: 'Pamukkale travertenlerinin hemen yanında bulunan kutsal Frigya kenti.', category: 'ruins', city: 'Denizli', location: { type: 'Point', coordinates: [29.1258, 37.9258] }, period: 'Roman', entryFee: 400, openingHours: '08:00 - 19:00', address: 'Pamukkale/Denizli', images: [] },
  { name: 'Bodrum Kalesi', description: '15. yüzyılda St. Jean Şövalyeleri tarafından inşa edilen ve Sualtı Arkeoloji Müzesi\'ne ev sahipliği yapan kale.', category: 'castle', city: 'Muğla', location: { type: 'Point', coordinates: [27.4288, 37.0316] }, period: 'Medieval', entryFee: 350, openingHours: '08:30 - 18:00', address: 'Bodrum/Muğla', images: [] },
  { name: 'Afrodisias Antik Kenti', description: 'Antik çağın en ünlü heykeltıraşlık okullarından birine sahip, Roma dönemi kenti.', category: 'ruins', city: 'Aydın', location: { type: 'Point', coordinates: [28.7230, 37.7088] }, period: 'Roman', entryFee: 200, openingHours: '08:30 - 18:30', address: 'Karacasu/Aydın', images: [] },
  { name: 'Agora Ören Yeri', description: 'İzmir\'in kalbinde yer alan, antik Roma dönemi çarşısı ve toplanma alanı.', category: 'ruins', city: 'İzmir', location: { type: 'Point', coordinates: [27.1378, 38.4173] }, period: 'Roman', entryFee: 130, openingHours: '08:30 - 17:30', address: 'Namazgah, İzmir', images: [] },
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
