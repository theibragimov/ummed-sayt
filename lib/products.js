export const PRODUCTS = [
  {
    id: 1,
    name: "Tonometr avtomatik",
    nameRu: "Автоматический тонометр",
    category: "diagnostika",
    categoryLabel: "Diagnostika",
    categoryLabelRu: "Диагностика",
    price: 320000,
    oldPrice: 380000,
    img: "🩺",
    badge: "Ommabop",
    badgeRu: "Популярный",
    desc: "Raqamli qon bosimi o'lchagich, bilak tipi",
    descRu: "Цифровой измеритель артериального давления, наручный тип",
    fullDesc: `Avtomatik tonometr — qon bosimini va puls tezligini aniq o'lchash uchun mo'ljallangan zamonaviy qurilma. Bilak tipidagi dizayni tufayli ishlatish juda qulay.

Katta LCD ekran o'lchovlarni aniq ko'rsatadi. Xotira funksiyasi oxirgi 60 ta o'lchovni saqlaydi. Aritmiya ko'rsatkichi yurak urishidagi tartibsizliklarni aniqlaydi.`,
    fullDescRu: `Автоматический тонометр — современный прибор для точного измерения артериального давления и частоты пульса. Наручная конструкция обеспечивает максимальное удобство использования.

Большой LCD-экран чётко отображает результаты измерений. Функция памяти сохраняет последние 60 измерений. Индикатор аритмии выявляет нарушения сердечного ритма.`,
    specs: [
      { label: "O'lchov usuli", value: "Oscillometric" },
      { label: "Manzil", value: "Bilak" },
      { label: "Xotira", value: "60 ta o'lchov" },
      { label: "Ekran", value: "LCD, katta" },
      { label: "Quvvat", value: "2 × AA batareya" },
      { label: "Kafolat", value: "2 yil" },
    ],
    specsRu: [
      { label: "Метод измерения", value: "Осциллометрический" },
      { label: "Место измерения", value: "Запястье" },
      { label: "Память", value: "60 измерений" },
      { label: "Экран", value: "LCD, большой" },
      { label: "Питание", value: "2 × AA батарейки" },
      { label: "Гарантия", value: "2 года" },
    ],
    inStock: true,
  },
  {
    id: 2,
    name: "Glukometr to'plami",
    nameRu: "Набор глюкометра",
    category: "diagnostika",
    categoryLabel: "Diagnostika",
    categoryLabelRu: "Диагностика",
    price: 180000,
    oldPrice: null,
    img: "💉",
    badge: null,
    badgeRu: null,
    desc: "Qand darajasini o'lchash, 50 ta test chizig'i bilan",
    descRu: "Измерение уровня сахара в крови, в комплекте 50 тест-полосок",
    fullDesc: `Glukometr — qondagi glyukoza darajasini tez va aniq o'lchash uchun mo'ljallangan qurilma. To'plam ichida qurilma, 50 ta test chizig'i va 10 ta lanset mavjud.

Natija 5 soniyada tayyor. Kichik qon namunasi (0.5 µL) talab qiladi. Diabetik bemorlar uchun eng qulay yechim.`,
    fullDescRu: `Глюкометр — прибор для быстрого и точного измерения уровня глюкозы в крови. В комплект входят прибор, 50 тест-полосок и 10 ланцетов.

Результат готов через 5 секунд. Требуется небольшая проба крови (0.5 мкл). Наилучшее решение для пациентов с диабетом.`,
    specs: [
      { label: "O'lchov vaqti", value: "5 soniya" },
      { label: "Qon hajmi", value: "0.5 µL" },
      { label: "O'lchov diapazoni", value: "1.1–33.3 mmol/L" },
      { label: "Xotira", value: "500 ta natija" },
      { label: "To'plamda", value: "50 test, 10 lanset" },
      { label: "Kafolat", value: "1 yil" },
    ],
    specsRu: [
      { label: "Время измерения", value: "5 секунд" },
      { label: "Объём крови", value: "0.5 мкл" },
      { label: "Диапазон измерений", value: "1.1–33.3 ммоль/л" },
      { label: "Память", value: "500 результатов" },
      { label: "В комплекте", value: "50 тест-полосок, 10 ланцетов" },
      { label: "Гарантия", value: "1 год" },
    ],
    inStock: true,
  },
  {
    id: 3,
    name: "Infraqizil termometr",
    nameRu: "Инфракрасный термометр",
    category: "diagnostika",
    categoryLabel: "Diagnostika",
    categoryLabelRu: "Диагностика",
    price: 95000,
    oldPrice: 120000,
    img: "🌡️",
    badge: "Yangi",
    badgeRu: "Новый",
    desc: "Kontaktsiz, 1 soniyada o'lchaydi",
    descRu: "Бесконтактный, измеряет за 1 секунду",
    fullDesc: `Infraqizil kontaktsiz termometr — bolalar va kattalar uchun tana haroratini tez va xavfsiz o'lchaydi. Peshonaga 3–5 sm masofadan turib 1 soniyada aniq natija beradi.

Ovozli va rangli signal: yashil (normal), sariq (subfebril), qizil (isitma). Xotiraga 32 ta o'lchov saqlanadi.`,
    fullDescRu: `Инфракрасный бесконтактный термометр — быстро и безопасно измеряет температуру тела у детей и взрослых. Точный результат за 1 секунду с расстояния 3–5 см от лба.

Звуковой и цветовой сигнал: зелёный (норма), жёлтый (субфебрильная), красный (температура). В памяти хранятся 32 измерения.`,
    specs: [
      { label: "O'lchov vaqti", value: "1 soniya" },
      { label: "Masofa", value: "3–5 sm" },
      { label: "Diapazon", value: "32–42.9°C" },
      { label: "Aniqlik", value: "±0.2°C" },
      { label: "Xotira", value: "32 ta o'lchov" },
      { label: "Kafolat", value: "1 yil" },
    ],
    specsRu: [
      { label: "Время измерения", value: "1 секунда" },
      { label: "Расстояние", value: "3–5 см" },
      { label: "Диапазон", value: "32–42.9°C" },
      { label: "Точность", value: "±0.2°C" },
      { label: "Память", value: "32 измерения" },
      { label: "Гарантия", value: "1 год" },
    ],
    inStock: true,
  },
  {
    id: 4,
    name: "Kompressor nebulayzer",
    nameRu: "Компрессорный небулайзер",
    category: "nafas",
    categoryLabel: "Nafas jihozlari",
    categoryLabelRu: "Дыхательные аппараты",
    price: 450000,
    oldPrice: null,
    img: "💨",
    badge: null,
    badgeRu: null,
    desc: "Nafas kasalliklari uchun, bolalar va kattalar",
    descRu: "Для лечения органов дыхания, для детей и взрослых",
    fullDesc: `Kompressor nebulayzer — bronxial astma, OEPD, bronxit va boshqa nafas yo'llari kasalliklarini davolashda dori moddalarini aerozol shaklida yetkazib beradi.

Bolalar va kattalar uchun alohida niqob to'plamlari bilan keladi. Soatiga 10 ml dori yuboradi. Jim ishlash darajasi 60 dB dan past.`,
    fullDescRu: `Компрессорный небулайзер — доставляет лекарственные препараты в виде аэрозоля при лечении бронхиальной астмы, ХОБЛ, бронхита и других заболеваний дыхательных путей.

Поставляется с отдельными масочными комплектами для детей и взрослых. Подаёт 10 мл лекарства в час. Уровень шума менее 60 дБ.`,
    specs: [
      { label: "Zarralar o'lchami", value: "MMAD ≤ 5 µm" },
      { label: "Dori sarfi", value: "≥ 0.2 ml/min" },
      { label: "Hajm", value: "2–8 ml" },
      { label: "Shovqin", value: "< 60 dB" },
      { label: "To'plamda", value: "Katta + bola niqobi" },
      { label: "Kafolat", value: "2 yil" },
    ],
    specsRu: [
      { label: "Размер частиц", value: "MMAD ≤ 5 мкм" },
      { label: "Расход лекарства", value: "≥ 0.2 мл/мин" },
      { label: "Объём", value: "2–8 мл" },
      { label: "Шум", value: "< 60 дБ" },
      { label: "В комплекте", value: "Маска взрослая + детская" },
      { label: "Гарантия", value: "2 года" },
    ],
    inStock: true,
  },
  {
    id: 5,
    name: "Ultratovush nebulayzer",
    nameRu: "Ультразвуковой небулайзер",
    category: "nafas",
    categoryLabel: "Nafas jihozlari",
    categoryLabelRu: "Дыхательные аппараты",
    price: 620000,
    oldPrice: 750000,
    img: "🌬️",
    badge: "Sertifikat",
    badgeRu: "Сертификат",
    desc: "Jimjit ishlaydi, kichik o'lchamli",
    descRu: "Работает бесшумно, компактный размер",
    fullDesc: `Ultratovush nebulayzer — eng zamonaviy texnologiya asosida ishlaydigan, ovoz chiqarmaydigan qurilma. Ko'chma format: cho'ntakka sigadi, batareyada ishlaydi.

Dori zarralarini 1–5 µm gacha maydalab, nafas yo'llarining eng chuqur qismlarigacha yetkazadi.`,
    fullDescRu: `Ультразвуковой небулайзер — устройство на основе новейших технологий, работающее совершенно бесшумно. Портативный формат: помещается в карман, работает от батареи.

Измельчает частицы лекарства до 1–5 мкм, доставляя их в самые глубокие части дыхательных путей.`,
    specs: [
      { label: "Texnologiya", value: "Ultratovush" },
      { label: "Zarralar", value: "1–5 µm" },
      { label: "Shovqin", value: "< 35 dB" },
      { label: "Quvvat", value: "USB yoki batareya" },
      { label: "Og'irlik", value: "120 g" },
      { label: "Kafolat", value: "2 yil" },
    ],
    specsRu: [
      { label: "Технология", value: "Ультразвук" },
      { label: "Частицы", value: "1–5 мкм" },
      { label: "Шум", value: "< 35 дБ" },
      { label: "Питание", value: "USB или батарея" },
      { label: "Вес", value: "120 г" },
      { label: "Гарантия", value: "2 года" },
    ],
    inStock: false,
  },
  {
    id: 6,
    name: "Pulse oksimetr",
    nameRu: "Пульсоксиметр",
    category: "diagnostika",
    categoryLabel: "Diagnostika",
    categoryLabelRu: "Диагностика",
    price: 120000,
    oldPrice: null,
    img: "❤️",
    badge: null,
    badgeRu: null,
    desc: "SpO2 va puls tezligini o'lchaydi",
    descRu: "Измеряет SpO2 и частоту пульса",
    fullDesc: `Pulse oksimetr — qon kislorod to'yinganligini (SpO2) va puls tezligini og'riqsiz va tez o'lchaydi. Barmoqqa kiyib 6 soniyada natija beradi.

Rangli OLED ekranda SpO2 foizi, puls tezligi va puls to'lqin grafigi ko'rsatiladi. Quyi SpO2 darajasida signal beradi.`,
    fullDescRu: `Пульсоксиметр — безболезненно и быстро измеряет насыщение крови кислородом (SpO2) и частоту пульса. Наденьте на палец — результат за 6 секунд.

На цветном OLED-экране отображаются процент SpO2, частота пульса и график пульсовой волны. Сигнализирует при низком уровне SpO2.`,
    specs: [
      { label: "O'lchov", value: "SpO2 + PR" },
      { label: "SpO2 diapazoni", value: "70–99%" },
      { label: "Aniqlik", value: "±2%" },
      { label: "Ekran", value: "Rangli OLED" },
      { label: "Quvvat", value: "2 × AAA batareya" },
      { label: "Kafolat", value: "1 yil" },
    ],
    specsRu: [
      { label: "Измерения", value: "SpO2 + PR" },
      { label: "Диапазон SpO2", value: "70–99%" },
      { label: "Точность", value: "±2%" },
      { label: "Экран", value: "Цветной OLED" },
      { label: "Питание", value: "2 × AAA батарейки" },
      { label: "Гарантия", value: "1 год" },
    ],
    inStock: true,
  },
  {
    id: 7,
    name: "ECG apparat 12-kanal",
    nameRu: "ЭКГ аппарат 12-канальный",
    category: "yurak",
    categoryLabel: "Yurak jihozlari",
    categoryLabelRu: "Сердечные аппараты",
    price: 2800000,
    oldPrice: null,
    img: "📈",
    badge: "Professional",
    badgeRu: "Профессиональный",
    desc: "Ko'chma elektrokardiograf, printer bilan",
    descRu: "Портативный электрокардиограф со встроенным принтером",
    fullDesc: `12 kanalli ECG apparat — klinika va kasalxonalar uchun professional darajadagi elektrokardiograf. Ichki termik printer bilan darhol natijani qog'ozga chiqaradi.

Wi-Fi orqali natijalarni kompyuterga yuborish imkoni bor. 7 dyuymli teginish ekrani. USB flesh xotira bilan ishlaydi.`,
    fullDescRu: `12-канальный ЭКГ аппарат — профессиональный электрокардиограф для клиник и больниц. Встроенный термопринтер мгновенно распечатывает результаты.

Возможность передачи результатов на компьютер по Wi-Fi. 7-дюймовый сенсорный экран. Поддержка USB флеш-накопителей.`,
    specs: [
      { label: "Kanallar", value: "12" },
      { label: "Ekran", value: "7\" teginish" },
      { label: "Printer", value: "Ichki termik" },
      { label: "Xotira", value: "1000 ta ECG" },
      { label: "Ulanish", value: "Wi-Fi, USB" },
      { label: "Kafolat", value: "3 yil" },
    ],
    specsRu: [
      { label: "Каналы", value: "12" },
      { label: "Экран", value: "7\" сенсорный" },
      { label: "Принтер", value: "Встроенный термо" },
      { label: "Память", value: "1000 ЭКГ" },
      { label: "Подключение", value: "Wi-Fi, USB" },
      { label: "Гарантия", value: "3 года" },
    ],
    inStock: true,
  },
  {
    id: 8,
    name: "Holter monitor",
    nameRu: "Холтер монитор",
    category: "yurak",
    categoryLabel: "Yurak jihozlari",
    categoryLabelRu: "Сердечные аппараты",
    price: 4500000,
    oldPrice: null,
    img: "🫀",
    badge: null,
    badgeRu: null,
    desc: "24 soatlik EKG monitoring tizimi",
    descRu: "Система мониторинга ЭКГ в течение 24 часов",
    fullDesc: `Holter monitor — bemorning kundalik hayoti davomida 24–72 soat mobaynida EKG signalini uzluksiz yozib boruvchi qurilma.

Yengil va kichik korpus (58 g) bemor uchun noqulaylik tug'dirmaydi. Maxsus dastur yordamida shifokor to'liq tahlil qiladi.`,
    fullDescRu: `Холтер монитор — устройство для непрерывной записи ЭКГ-сигнала в течение 24–72 часов в повседневной жизни пациента.

Лёгкий и компактный корпус (58 г) не доставляет дискомфорта пациенту. Врач проводит полный анализ с помощью специальной программы.`,
    specs: [
      { label: "Monitoring", value: "24–72 soat" },
      { label: "Kanallar", value: "3 yoki 12" },
      { label: "Xotira", value: "4 GB" },
      { label: "Og'irlik", value: "58 g" },
      { label: "Quvvat", value: "Li-Ion batareya" },
      { label: "Kafolat", value: "2 yil" },
    ],
    specsRu: [
      { label: "Мониторинг", value: "24–72 часа" },
      { label: "Каналы", value: "3 или 12" },
      { label: "Память", value: "4 ГБ" },
      { label: "Вес", value: "58 г" },
      { label: "Питание", value: "Li-Ion аккумулятор" },
      { label: "Гарантия", value: "2 года" },
    ],
    inStock: true,
  },
  {
    id: 9,
    name: "Tibbiy krovat",
    nameRu: "Медицинская кровать",
    category: "mebel",
    categoryLabel: "Tibbiy mebel",
    categoryLabelRu: "Медицинская мебель",
    price: 1200000,
    oldPrice: 1450000,
    img: "🛏️",
    badge: null,
    badgeRu: null,
    desc: "Statsionar, balandligi sozlanadi",
    descRu: "Стационарная, с регулируемой высотой",
    fullDesc: `Tibbiy krovat — kasalxona va klinikalar uchun mo'ljallangan statsionar yotoq. Balandligi mexanik ravishda 45–90 sm orasida sozlanadi.

Polimer qoplamali po'lat konstruktsiya — tez tozalanadi va dezinfeksiyaga chidamli. Kattaroq g'ildiraklar krovalni xonada osongina harakatlantirishga imkon beradi.`,
    fullDescRu: `Медицинская кровать — стационарная кровать для больниц и клиник. Высота механически регулируется в диапазоне 45–90 см.

Стальная конструкция с полимерным покрытием — легко чистится и устойчива к дезинфекции. Крупные колёса позволяют легко перемещать кровать по помещению.`,
    specs: [
      { label: "Balandlik", value: "45–90 sm" },
      { label: "O'lcham", value: "200 × 90 sm" },
      { label: "Yuk ko'tarish", value: "200 kg" },
      { label: "Material", value: "Po'lat + polimer" },
      { label: "G'ildiraklar", value: "To'xtatgich bilan" },
      { label: "Kafolat", value: "2 yil" },
    ],
    specsRu: [
      { label: "Высота", value: "45–90 см" },
      { label: "Размер", value: "200 × 90 см" },
      { label: "Грузоподъёмность", value: "200 кг" },
      { label: "Материал", value: "Сталь + полимер" },
      { label: "Колёса", value: "С фиксаторами" },
      { label: "Гарантия", value: "2 года" },
    ],
    inStock: true,
  },
  {
    id: 10,
    name: "Dropper stendi",
    nameRu: "Стойка для капельницы",
    category: "mebel",
    categoryLabel: "Tibbiy mebel",
    categoryLabelRu: "Медицинская мебель",
    price: 85000,
    oldPrice: null,
    img: "🪝",
    badge: null,
    badgeRu: null,
    desc: "Ko'chma, to'rtta tutqich bilan",
    descRu: "Передвижная, с четырьмя крючками",
    fullDesc: `Dropper stendi — tomchi qo'yish uchun ko'chma stend. To'rtta tutqich bir vaqtda bir nechta idishni osib qo'yish imkonini beradi.

Balandligi 125–185 sm orasida sozlanadi. Og'ir bo'lmagan (2.5 kg) va qulay g'ildiraklar bilan.`,
    fullDescRu: `Стойка для капельницы — передвижная стойка для проведения инфузионной терапии. Четыре крючка позволяют одновременно подвешивать несколько ёмкостей.

Высота регулируется от 125 до 185 см. Лёгкая конструкция (2.5 кг) с удобными колёсами.`,
    specs: [
      { label: "Tutqichlar", value: "4 ta" },
      { label: "Balandlik", value: "125–185 sm" },
      { label: "Og'irlik", value: "2.5 kg" },
      { label: "Material", value: "Zanglamaydigan po'lat" },
      { label: "G'ildiraklar", value: "5 ta" },
      { label: "Kafolat", value: "1 yil" },
    ],
    specsRu: [
      { label: "Крючки", value: "4 шт." },
      { label: "Высота", value: "125–185 см" },
      { label: "Вес", value: "2.5 кг" },
      { label: "Материал", value: "Нержавеющая сталь" },
      { label: "Колёса", value: "5 шт." },
      { label: "Гарантия", value: "1 год" },
    ],
    inStock: true,
  },
  {
    id: 11,
    name: "Sterilizator quruq issiq",
    nameRu: "Сухожаровой стерилизатор",
    category: "sterilizatsiya",
    categoryLabel: "Sterilizatsiya",
    categoryLabelRu: "Стерилизация",
    price: 380000,
    oldPrice: 420000,
    img: "🔥",
    badge: "Yangi",
    badgeRu: "Новый",
    desc: "200°C gacha, 20 litr hajmi",
    descRu: "До 200°C, объём 20 литров",
    fullDesc: `Quruq issiqlik sterilizatori — tibbiy asboblarni 160–200°C haroratda sterilizatsiya qilish uchun. Dorixona, stomatologiya va jarrohlik klinikalariga mos.

Mexanik taymeri bilan 0–60 daqiqagacha vaqt o'rnatiladi. Ichki 20 litr hajm turli o'lchamdagi asboblarga mos keladi.`,
    fullDescRu: `Сухожаровой стерилизатор — для стерилизации медицинских инструментов при температуре 160–200°C. Подходит для аптек, стоматологических и хирургических клиник.

Механический таймер устанавливается на 0–60 минут. Внутренний объём 20 литров вмещает инструменты различных размеров.`,
    specs: [
      { label: "Harorat", value: "160–200°C" },
      { label: "Hajm", value: "20 litr" },
      { label: "Taymer", value: "0–60 daqiqa" },
      { label: "Quvvat", value: "1000 Vt" },
      { label: "O'lcham", value: "370×370×250 mm" },
      { label: "Kafolat", value: "1 yil" },
    ],
    specsRu: [
      { label: "Температура", value: "160–200°C" },
      { label: "Объём", value: "20 литров" },
      { label: "Таймер", value: "0–60 минут" },
      { label: "Мощность", value: "1000 Вт" },
      { label: "Размер", value: "370×370×250 мм" },
      { label: "Гарантия", value: "1 год" },
    ],
    inStock: true,
  },
  {
    id: 12,
    name: "Avtoklav 24L",
    nameRu: "Автоклав 24 л",
    category: "sterilizatsiya",
    categoryLabel: "Sterilizatsiya",
    categoryLabelRu: "Стерилизация",
    price: 3200000,
    oldPrice: null,
    img: "⚗️",
    badge: "Professional",
    badgeRu: "Профессиональный",
    desc: "Bug' sterilizatsiya, LCD ekran",
    descRu: "Паровая стерилизация, LCD-экран",
    fullDesc: `Avtoklav — bug' bosimi ostida sterilizatsiya qiluvchi professional qurilma. 134°C da 3 daqiqada to'liq sterilizatsiya. Stomatologiya, jarrohlik va laboratoriyalar uchun.

LCD ekran va avtomatik dasturlar jarayonni nazorat qilishni osonlashtiradi. Xavfsizlik klapani ortiqcha bosimni oldini oladi.`,
    fullDescRu: `Автоклав — профессиональное устройство для стерилизации паром под давлением. Полная стерилизация при 134°C за 3 минуты. Для стоматологии, хирургии и лабораторий.

LCD-экран и автоматические программы упрощают контроль процесса. Предохранительный клапан предотвращает избыточное давление.`,
    specs: [
      { label: "Hajm", value: "24 litr" },
      { label: "Harorat", value: "121°C / 134°C" },
      { label: "Vaqt", value: "3–30 daqiqa" },
      { label: "Ekran", value: "LCD" },
      { label: "Quvvat", value: "2400 Vt" },
      { label: "Kafolat", value: "3 yil" },
    ],
    specsRu: [
      { label: "Объём", value: "24 литра" },
      { label: "Температура", value: "121°C / 134°C" },
      { label: "Время", value: "3–30 минут" },
      { label: "Экран", value: "LCD" },
      { label: "Мощность", value: "2400 Вт" },
      { label: "Гарантия", value: "3 года" },
    ],
    inStock: true,
  },
];

export function getProduct(id) {
  return PRODUCTS.find((p) => p.id === Number(id)) || null;
}

export function getSimilar(product, count = 3) {
  return PRODUCTS.filter(
    (p) => p.category === product.category && p.id !== product.id
  ).slice(0, count);
}

export function formatPrice(n) {
  return n.toLocaleString("uz-UZ") + " so'm";
}
