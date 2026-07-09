"use client";

import { createContext, useContext, useEffect, useState } from "react";

export const translations = {
  uz: {
    nav: { home: "Bosh sahifa", catalog: "Katalog", about: "Biz haqimizda", news: "Yangiliklar", contact: "Aloqa" },
    notFound: {
      title: "Sahifa topilmadi",
      message: "Kechirasiz, siz qidirayotgan sahifa mavjud emas yoki o'chirilgan. Havolani tekshiring yoki bosh sahifaga qayting.",
      homeBtn: "Bosh sahifaga qaytish",
      contactText: "Yordam kerak bo'lsa,",
      contactLink: "biz bilan bog'laning",
    },
    hero: {
      badge: "Tibbiyot buyumlari",
      title1: "Butun Oʻzbekiston boʻylab",
      title2: "tibbiyot buyumlarini ulgurji",
      title3: "yetkazib beramiz",
      desc: "Dorixona va klinikalar uchun zamonaviy tibbiyot buyumlari, qulay narx va tezkor xizmat taklif qilamiz.",
      catalogBtn: "Katalogni ko'rish",
      contactBtn: "Bog'lanish",
      stats: {
        clients: { num: 550, label: "Mijozlar" },
        products: { num: 700, label: "Mahsulotlar" },
        experience: { num: 11, label: "Yillik tajriba" },
      },
    },
    advantages: {
      title: "Nima uchun",
      experience: {
        title: "Tajriba asosida yondashuv",
        desc: "11 yillik tajriba davomida tibbiyot buyumlari bozorida ishonchli hamkor sifatida shakllandik va mijozlar ehtiyojiga mos yechimlarni taklif qilib kelmoqdamiz.",
      },
      warehouse: {
        title: "Xususiy ombor",
        desc: "Toshkentdagi xususiy omborimiz mahsulotlarni barqaror saqlash, tezkor ta'minlash va assortimentni muntazam kengaytirish imkonini beradi.",
      },
      distribution: {
        title: "Ishonchli ta'minot",
        desc: "Hamkorlarimizga mahsulotlarning O'zbekiston bo'ylab ishonchli va o'z vaqtida yetib borishini ta'minlaymiz.",
      },
      certificate: {
        title: "Rasmiy kafolat",
        desc: "Mahsulotlarga kafolat muddati taqdim etiladi va har qanday holatda ham mijozlarimizni qo'llab-quvvatlaymiz.",
      },
      guarantee: {
        title: "Rasmiy distribyutorlik",
        desc: "Ishonchli tibbiy brendlarning rasmiy distribyutori sifatida sifatli mahsulotlarni taqdim etamiz.",
      },
      delivery: {
        title: "Barqaror hamkorlik",
        desc: "Klinika va dorixonalar bilan uzoq muddatli va ishonchga asoslangan hamkorlik olib boramiz.",
      },
    },
    products: {
      title: "Biz taqdim etadigan distribyutor mahsulotlar",
      subtitle: "Rasmiy distribyutorlik orqali sifatli brendlar",
      seeAll: "Barchasini ko'rish",
      order: "Buyurtma",
      items: {
        satellite: {
          name: "Satellite Glukometrlari",
          desc: "Test-poloskalari va o'lchov apparatlari, rasmiy Сателлит distribyutori.",
          tag: "Rasmiy distribyutor",
        },
        palma: {
          name: "GK Palma kolopriyomniklari",
          desc: "Триоцел va Абуцел brendlari — keng spektrli tibbiy maxsus mahsulotlar.",
          tag: "Tibbiy maxsus",
        },
        easydrip: {
          name: "Easy Drip ignalar",
          desc: "Insulin uchun innovatsion ignalar — 4, 5, 6 va 8 mm o'lchamlarda.",
          tag: "Innovatsion",
        },
        makon: {
          name: "Makon Mirzo ortopediya",
          desc: "Keng assortimentdagi ortopedik mahsulotlar — bemorlar uchun.",
          tag: "Keng assortiment",
        },
      },
    },
    ownBrand: {
      title: "Ummed brendi ostidagi mahsulotlar",
      subtitle: "Bizning o'zimizning ishonchli sifatdagi mahsulotlarimiz",
      items: {
        tonometr: {
          name: "Ummed Tonometr Pro",
          desc: "Avtomatik raqamli tonometr — qon bosimi va puls aniq o'lchovi.",
        },
        glukometr: {
          name: "Ummed Smart Glukometr",
          desc: "Tez va aniq qon shakari o'lchov apparati, mobil ilovaga ulanadi.",
        },
        termometr: {
          name: "Ummed Touch Termometr",
          desc: "Infraqizil kontaktsiz termometr — bolalar va kattalar uchun.",
        },
        oksimetr: {
          name: "Ummed Pulse Oksimetr",
          desc: "Qon kislorod darajasi (SpO2) va puls — yorqin OLED ekran.",
        },
      },
    },
    cta: {
      title: "Ulgurji narxlar kerakmi?",
      desc: "Dorixona yoki klinika uchun maxsus narxlar va chegirmalar haqida menejerimiz bilan bog'laning.",
      btn: "Narx so'rash",
    },
    uzum: {
      title: "Bizning Uzum marketdagi do'konlarimiz",
      subtitle: "Uzum marketdagi Rasmiy do'konlarimiz",
      visit: "Do'konga o'tish",
      shops: {
        ummed:     { name: "Ummed",      tag: "Asosiy do'kon",           href: "https://uzum.uz/uz/shop/ummed" },
        ababil:    { name: "Ababil",     tag: "Premium brend",           href: "https://uzum.uz/uz/shop/ababil" },
      },
    },
    footer: {
      tagline: "Tibbiy jihozlar sohasida ishonchli hamkor. Sifat va kafolatga tayanib ishlaymiz.",
      pages: "Sahifalar",
      contact: "Aloqa",
      social: "Ijtimoiy tarmoqlar",
      workHours: "Ish vaqti: Du–Sha, 09:00–18:00",
      copyright: "© 2024 Ummed Tibbiy Jihozlar. Barcha huquqlar himoyalangan.",
      address: "Toshkent tumani, Hasanboy G'uzari MFY, THAY Yokasi ko'chasi",
    },
    about: {
      title: "Biz haqimizda",
      label: "Biz haqimizda",
      teamAlt: "Ummed jamoasi",
      stats: {
        experience: "Yillik tajriba",
        partners: "Hamkorlar",
        products: "Mahsulotlar",
      },
      text1: "Ummed — 11 yildan buyon O'zbekiston bo'ylab dorixona va klinikalarni sifatli tibbiyot buyumlari bilan ta'minlab kelayotgan kompaniya.",
      text2: "11 yillik faoliyat davomida bozordagi o'zgarishlar asosida kuchli tajriba shakllantirdik. Hamkorlar soni va mahsulotlar assortimenti muntazam kengayib bormoqda.",
      text3: "Bugungi kunda 700 dan ortiq mahsulot bilan O'zbekiston bo'ylab yuzlab hamkorlarga barqaror ta'minot xizmatini ko'rsatib kelmoqdamiz.",
      text4: "Har bir hamkor bilan uzoq muddatli ishonchli ishlash, sifatli mahsulot taqdim etish va bozor talabiga mos yechimlar bizning asosiy tamoyilimizdir.",
      values: {
        label: "Qadriyatlarimiz",
        items: [
          { title: "Ishonch va mas'uliyat", desc: "Har bir hamkorlikda ishonchni qadrlaymiz va mahsulotlar sifati hamda xizmat uchun mas'uliyat bilan yondashamiz." },
          { title: "Barqaror hamkorlik", desc: "Dorixona va tibbiy muassasalar bilan uzoq muddatli va ishonchli hamkorlikni ustuvor bilamiz." },
          { title: "Rivojlanishga intilish", desc: "Tibbiyot bozori talablari asosida doimiy o'sish va yangilanishni ustuvor bilamiz." },
        ],
      },
      gallery: {
        label: "Ish jarayoni va ombor faoliyati",
        caption: "Har bir buyurtma ombor, tayyorlash va jo'natish bosqichlari orqali nazorat bilan amalga oshiriladi.",
      },
      partners: { label: "Hamkorlarimiz" },
      founder: {
        label: "Asoschimiz",
        name: "Farhod Abdullayev",
        role: "Co-Founder",
        bio1: "1995-yilda tug'ilgan. O'zbekiston Farmatsevtika Universitetini tamomlagan.",
        bio2: "12 yildan ortiq tibbiyot va farmatsevtika sohasida faoliyat yuritadi. Ummed kompaniyasini asoslab, O'zbekiston bo'ylab 550+ dorixona va klinika bilan hamkorlikni yo'lga qo'ygan.",
        email: "farhod@ummed.uz",
        instagramLabel: "Instagram",
        telegramLabel: "Telegram",
        instagramUrl: "https://instagram.com/farkhod_abdullaev_",
        telegramUrl: "https://t.me/farkhod_abdullaev",
      },
      cta: {
        title: "Siz ham hamkorlik qilishga tayyormisiz?",
        btn: "Biz bilan bog'laning",
      },
    },
    contact: {
      label: "Aloqa",
      title: "Biz bilan bog'laning",
      desc: "Savol, taklif yoki ulgurji buyurtma uchun murojaat qiling — menejerimiz tez orada javob beradi.",
      form: {
        label: "Xabar yuborish",
        name: "Ism Familiya",
        namePlaceholder: "Masalan: Abdullayev Jasur",
        phone: "Telefon raqam",
        message: "Xabar",
        messagePlaceholder: "Savol, taklif yoki buyurtma haqida yozing...",
        submit: "Xabar yuborish",
        sending: "Yuborilmoqda...",
        errors: {
          name: "Ism kiritilmadi",
          phone: "Telefon kiritilmadi",
          message: "Xabar kiritilmadi",
        },
        success: {
          title: "Xabaringiz yuborildi",
          desc: "Menejerimiz ish vaqti ichida siz bilan bog'lanadi.",
          again: "Yana xabar yuborish",
        },
      },
      info: {
        phone: "Telefon",
        hours: "Du–Sha, 09:00–18:00",
        email: "Elektron pochta",
        emailDesc: "24 soat ichida javob",
        address: "Manzil",
        city: "Toshkent tumani",
        street: "Hasanboy G'uzari MFY, THAY Yokasi ko'chasi",
        social: "Ijtimoiy tarmoqlar",
      },
    },
    catalog: {
      label: "Katalog",
      title: "Barcha mahsulotlar",
      countSuffix: "ta mahsulot",
      search: "Qidiruv",
      searchPlaceholder: "Mahsulot nomi...",
      category: "Kategoriya",
      reset: "Filtrni tozalash",
      filterOpen: "Filtr",
      filterClose: "Filtrni yopish",
      notFound: "Mahsulot topilmadi",
      notFoundHint: "Filtr yoki qidiruvni o'zgartiring",
      detail: "Batafsil",
      availableLabel: "Mavjud",
      foundSuffix: "ta mahsulot topildi",
      categories: {
        hammasi: "Hammasi",
        diagnostika: "Diagnostika",
        nafas: "Nafas jihozlari",
        yurak: "Yurak jihozlari",
        mebel: "Tibbiy mebel",
        sterilizatsiya: "Sterilizatsiya",
      },
      badges: {
        Yangi: "Yangi",
        Ommabop: "Ommabop",
        Sertifikat: "Sertifikat",
        Professional: "Professional",
        tezOrada: "Tez orada",
        hit: "Хит Продаж",
        tugagan: "Tugagan",
      },
    },
    news: {
      label: "Yangiliklar",
      title: "So'nggi yangiliklar",
      items: [
        { id: 1, date: "15 May, 2025", title: "Ummed kompaniyasi yangi tibbiy jihozlar lineyasini taqdim etdi", desc: "2025 yilda kompaniyamiz xalqaro sifat standartlariga javob beradigan yangi diagnostika uskunalari bilan assortimentini kengaytirdi.", category: "Yangilik" },
        { id: 2, date: "2 May, 2025", title: "O'zbekistonda tibbiy jihozlar bozori: 2025 yil tendensiyalari", desc: "Mutaxassislar fikricha, tibbiy uskunalar sohasida raqamlashtirish va zamonaviy texnologiyalar joriy etilishi davom etmoqda.", category: "Tahlil" },
        { id: 3, date: "18 Aprel, 2025", title: "550 dan ortiq dorixona bilan hamkorlik: muvaffaqiyat sirlari", desc: "Ummed jamoasi butun O'zbekiston bo'ylab o'rnatgan ishonchli hamkorlik tarmog'i haqida batafsil ma'lumot.", category: "Hamkorlik" },
        { id: 4, date: "5 Aprel, 2025", title: "ISO sertifikatlash jarayoni: sifat nazoratimiz qanday ishlaydi", desc: "Kompaniyamiz mahsulotlari qat'iy xalqaro standartlar asosida tekshiriladi. Ushbu maqolada jarayon batafsil yoritilgan.", category: "Sifat" },
        { id: 5, date: "20 Mart, 2025", title: "Toshkent tibbiyot ko'rgazmasida Ummed stendi", desc: "Mart oyida bo'lib o'tgan xalqaro ko'rgazmada kompaniyamiz eng yangi mahsulotlarini namoyish etdi.", category: "Tadbir" },
        { id: 6, date: "10 Mart, 2025", title: "Yangi logistika markazi: yetkazib berish tezlashadi", desc: "Ummed O'zbekiston bo'ylab tezkor yetkazib berishni ta'minlash uchun yangi logistika infratuzilmasini ishga tushirdi.", category: "Yangilik" },
      ],
    },
    product: {
      breadcrumbHome: "Bosh sahifa",
      breadcrumbCatalog: "Katalog",
      tabDesc: "Tavsif",
      tabSpecs: "Texnik ma'lumot",
      outOfStock: "Sotib bo'lindi",
      inStock: "Mavjud",
      discount: "chegirma",
      delivery: "Tezkor yetkazib berish",
      warranty: "Kafolat bor",
      requestTitle: "Narx so'rash",
      requestDesc: "Ulgurji narx yoki qo'shimcha ma'lumot uchun",
      formName: "Ismingiz",
      formPhone: "Telefon",
      formComment: "Izoh",
      formCommentPlaceholder: "haqida savol yoki miqdor...",
      formSubmit: "Narx so'rash →",
      formSending: "Yuborilmoqda...",
      formPrivacy: "Ma'lumotlaringiz faqat aloqa uchun ishlatiladi",
      successTitle: "Arizangiz qabul qilindi!",
      successDesc: "Menejerimiz tez orada siz bilan bog'lanadi.",
      successAgain: "Yana so'rash",
      similar: "O'xshash mahsulotlar",
      detailBtn: "Batafsil →",
    },
  },
  ru: {
    nav: { home: "Главная", catalog: "Каталог", about: "О нас", news: "Новости", contact: "Контакты" },
    notFound: {
      title: "Страница не найдена",
      message: "Извините, страница, которую вы ищете, не существует или была удалена. Проверьте ссылку или вернитесь на главную.",
      homeBtn: "Вернуться на главную",
      contactText: "Если нужна помощь,",
      contactLink: "свяжитесь с нами",
    },
    hero: {
      badge: "Медицинские изделия",
      title1: "Надёжно поставляем",
      title2: "медицинские изделия оптом",
      title3: "по всему Узбекистану.",
      desc: "Современные медицинские изделия для аптек и клиник, удобные цены и быстрый сервис.",
      catalogBtn: "Смотреть каталог",
      contactBtn: "Связаться",
      stats: {
        clients: { num: 550, label: "Клиентов" },
        products: { num: 700, label: "Товаров" },
        experience: { num: 11, label: "Лет опыта" },
      },
    },
    advantages: {
      title: "Почему",
      experience: {
        title: "Опытный подход",
        desc: "11 лет практики — индивидуальные профессиональные решения для каждого клиента.",
      },
      warehouse: {
        title: "Собственный склад",
        desc: "Наш склад в Ташкенте — товары всегда в наличии, не нужно ждать.",
      },
      distribution: {
        title: "Надёжные поставки",
        desc: "Обеспечиваем партнёрам надёжную и своевременную доставку товаров по всему Узбекистану.",
      },
      certificate: {
        title: "Официальная гарантия",
        desc: "На продукцию предоставляется гарантийный срок, и мы поддерживаем наших клиентов в любой ситуации.",
      },
      guarantee: {
        title: "Официальная дистрибуция",
        desc: "Как официальный дистрибьютор надёжных медицинских брендов, мы предлагаем качественную продукцию.",
      },
      delivery: {
        title: "Стабильное партнёрство",
        desc: "Выстраиваем долгосрочные и доверительные партнёрские отношения с клиниками и аптеками.",
      },
    },
    products: {
      title: "Дистрибьюторские товары, которые мы представляем",
      subtitle: "Качественные бренды через официальную дистрибуцию",
      seeAll: "Смотреть все",
      order: "Заказ",
      items: {
        satellite: {
          name: "Глюкометры Сателлит",
          desc: "Тест-полоски и аппараты, официальный дистрибьютор Сателлит.",
          tag: "Официальный дистрибьютор",
        },
        palma: {
          name: "Калоприёмники ГК Пальма",
          desc: "Бренды Триоцел и Абуцел — широкий спектр медицинских изделий.",
          tag: "Медицинские специальные",
        },
        easydrip: {
          name: "Иглы Easy Drip",
          desc: "Инновационные иглы для инсулина — размеры 4, 5, 6 и 8 мм.",
          tag: "Инновация",
        },
        makon: {
          name: "Makon Mirzo ортопедия",
          desc: "Широкий ассортимент ортопедических товаров для пациентов.",
          tag: "Широкий ассортимент",
        },
      },
    },
    ownBrand: {
      title: "Товары под брендом Ummed",
      subtitle: "Наши собственные товары надёжного качества",
      items: {
        tonometr: {
          name: "Ummed Tonometr Pro",
          desc: "Автоматический тонометр — точное измерение давления и пульса.",
        },
        glukometr: {
          name: "Ummed Smart Glukometr",
          desc: "Быстрый и точный глюкометр с подключением к мобильному приложению.",
        },
        termometr: {
          name: "Ummed Touch Termometr",
          desc: "Бесконтактный инфракрасный термометр для детей и взрослых.",
        },
        oksimetr: {
          name: "Ummed Pulse Oksimetr",
          desc: "Уровень кислорода в крови (SpO2) и пульс — яркий OLED экран.",
        },
      },
    },
    cta: {
      title: "Нужны оптовые цены?",
      desc: "Свяжитесь с нашим менеджером для специальных цен и скидок для аптек или клиник.",
      btn: "Запросить цену",
    },
    uzum: {
      title: "Наши официальные магазины на Uzum market",
      subtitle: "Официальные магазины на Uzum market",
      visit: "Перейти в магазин",
      shops: {
        ummed:     { name: "Ummed",        tag: "Основной магазин",      href: "https://uzum.uz/uz/shop/ummed" },
        ababil:    { name: "Ababil",       tag: "Премиум бренд",         href: "https://uzum.uz/uz/shop/ababil" },
      },
    },
    footer: {
      tagline: "Надёжный партнёр в сфере медоборудования. Опираемся на качество и гарантию.",
      pages: "Страницы",
      contact: "Контакты",
      social: "Социальные сети",
      workHours: "Рабочие часы: Пн–Сб, 09:00–18:00",
      copyright: "© 2024 Ummed Медоборудование. Все права защищены.",
      address: "Ташкентский район, МСГ Хасанбой Гузари, ул. ТХАЙ Ёкаси",
    },
    about: {
      title: "О нас",
      label: "О нас",
      teamAlt: "Команда Ummed",
      stats: {
        experience: "Лет опыта",
        partners: "Партнёров",
        products: "Товаров",
      },
      text1: "Ummed — компания, которая уже 11 лет снабжает аптеки и клиники по всему Узбекистану качественными медицинскими изделиями.",
      text2: "За 11 лет работы мы накопили богатый опыт на рынке. Число партнёров и ассортимент продукции постоянно растут.",
      text3: "Сегодня мы обслуживаем сотни партнёров по всему Узбекистану, предлагая более 700 наименований товаров.",
      text4: "Долгосрочное сотрудничество, качественная продукция и решения, соответствующие потребностям рынка — наши главные принципы.",
      values: {
        label: "Наши ценности",
        items: [
          { title: "Доверие и ответственность", desc: "В каждом партнёрстве мы ценим доверие и несём ответственность за качество продукции и уровень сервиса." },
          { title: "Стабильное партнёрство", desc: "Долгосрочное и надёжное сотрудничество с аптеками и медицинскими учреждениями — наш приоритет." },
          { title: "Стремление к развитию", desc: "Мы постоянно развиваемся и обновляемся в соответствии с требованиями медицинского рынка." },
        ],
      },
      gallery: {
        label: "Рабочий процесс и складская деятельность",
        caption: "Каждый заказ проходит контроль на этапах складирования, подготовки и отправки.",
      },
      partners: { label: "Наши партнёры" },
      founder: {
        label: "Основатель",
        name: "Фархад Абдуллаев",
        role: "Co-Founder",
        bio1: "Родился в 1995 году. Окончил Ташкентский фармацевтический институт.",
        bio2: "Более 12 лет работает в сфере медицины и фармацевтики. Основал компанию Ummed и выстроил партнёрские отношения с 550+ аптеками и клиниками по всему Узбекистану.",
        email: "farhod@ummed.uz",
        instagramLabel: "Instagram",
        telegramLabel: "Telegram",
        instagramUrl: "https://instagram.com/farkhod_abdullaev_",
        telegramUrl: "https://t.me/farkhod_abdullaev",
      },
      cta: {
        title: "Готовы к сотрудничеству?",
        btn: "Свяжитесь с нами",
      },
    },
    contact: {
      label: "Контакты",
      title: "Свяжитесь с нами",
      desc: "Задайте вопрос, оставьте предложение или оформите оптовый заказ — наш менеджер ответит вам в ближайшее время.",
      form: {
        label: "Отправить сообщение",
        name: "Имя Фамилия",
        namePlaceholder: "Например: Иванов Иван",
        phone: "Номер телефона",
        message: "Сообщение",
        messagePlaceholder: "Напишите вопрос, предложение или заказ...",
        submit: "Отправить сообщение",
        sending: "Отправка...",
        errors: {
          name: "Введите имя",
          phone: "Введите номер телефона",
          message: "Введите сообщение",
        },
        success: {
          title: "Сообщение отправлено",
          desc: "Наш менеджер свяжется с вами в рабочее время.",
          again: "Отправить ещё раз",
        },
      },
      info: {
        phone: "Телефон",
        hours: "Пн–Сб, 09:00–18:00",
        email: "Электронная почта",
        emailDesc: "Ответим в течение 24 часов",
        address: "Адрес",
        city: "Ташкентский район",
        street: "МСГ Хасанбой Гузари, ул. ТХАЙ Ёкаси",
        social: "Социальные сети",
      },
    },
    catalog: {
      label: "Каталог",
      title: "Все товары",
      countSuffix: "товаров",
      search: "Поиск",
      searchPlaceholder: "Название товара...",
      category: "Категория",
      reset: "Сбросить фильтр",
      filterOpen: "Фильтр",
      filterClose: "Закрыть фильтр",
      notFound: "Товар не найден",
      notFoundHint: "Измените фильтр или поиск",
      detail: "Подробнее",
      availableLabel: "В наличии",
      foundSuffix: "товаров найдено",
      categories: {
        hammasi: "Все",
        diagnostika: "Диагностика",
        nafas: "Дыхательные аппараты",
        yurak: "Сердечные аппараты",
        mebel: "Медицинская мебель",
        sterilizatsiya: "Стерилизация",
      },
      badges: {
        Yangi: "Новый",
        Ommabop: "Популярный",
        Sertifikat: "Сертификат",
        Professional: "Профессиональный",
        tezOrada: "Скоро",
        hit: "Хит Продаж",
        tugagan: "Нет в наличии",
      },
    },
    news: {
      label: "Новости",
      title: "Последние новости",
      items: [
        { id: 1, date: "15 мая, 2025", title: "Компания Ummed представила новую линейку медицинского оборудования", desc: "В 2025 году наша компания расширила ассортимент новыми диагностическими приборами, соответствующими международным стандартам качества.", category: "Новость" },
        { id: 2, date: "2 мая, 2025", title: "Рынок медицинского оборудования в Узбекистане: тенденции 2025 года", desc: "По мнению экспертов, в сфере медицинского оборудования продолжается цифровизация и внедрение современных технологий.", category: "Аналитика" },
        { id: 3, date: "18 апреля, 2025", title: "Партнёрство с более чем 550 аптеками: секреты успеха", desc: "Подробная информация о надёжной партнёрской сети, выстроенной командой Ummed по всему Узбекистану.", category: "Партнёрство" },
        { id: 4, date: "5 апреля, 2025", title: "Процесс ISO-сертификации: как работает наш контроль качества", desc: "Продукция нашей компании проходит строгую проверку по международным стандартам. В этой статье процесс описан подробно.", category: "Качество" },
        { id: 5, date: "20 марта, 2025", title: "Стенд Ummed на Ташкентской медицинской выставке", desc: "На международной выставке, прошедшей в марте, наша компания представила новейшие продукты.", category: "Мероприятие" },
        { id: 6, date: "10 марта, 2025", title: "Новый логистический центр: доставка станет быстрее", desc: "Ummed запустила новую логистическую инфраструктуру для обеспечения оперативной доставки по всему Узбекистану.", category: "Новость" },
      ],
    },
    product: {
      breadcrumbHome: "Главная",
      breadcrumbCatalog: "Каталог",
      tabDesc: "Описание",
      tabSpecs: "Технические характеристики",
      outOfStock: "Нет в наличии",
      inStock: "В наличии",
      discount: "скидка",
      delivery: "Быстрая доставка",
      warranty: "Гарантия",
      requestTitle: "Запросить цену",
      requestDesc: "Для оптовой цены или дополнительной информации",
      formName: "Ваше имя",
      formPhone: "Телефон",
      formComment: "Комментарий",
      formCommentPlaceholder: "вопрос или количество...",
      formSubmit: "Запросить цену →",
      formSending: "Отправка...",
      formPrivacy: "Ваши данные используются только для связи",
      successTitle: "Заявка принята!",
      successDesc: "Наш менеджер свяжется с вами в ближайшее время.",
      successAgain: "Отправить ещё раз",
      similar: "Похожие товары",
      detailBtn: "Подробнее →",
    },
  },
};

translations.en = {
  nav: { home: "Home", catalog: "Catalog", about: "About Us", news: "News", contact: "Contact" },
  notFound: {
    title: "Page not found",
    message: "Sorry, the page you're looking for doesn't exist or has been moved. Check the link or head back to the homepage.",
    homeBtn: "Back to homepage",
    contactText: "Need help?",
    contactLink: "Contact us",
  },
  hero: {
    badge: "Medical Supplies",
    title1: "Reliable wholesale delivery",
    title2: "of medical supplies",
    title3: "across all of Uzbekistan.",
    desc: "Modern medical products for pharmacies and clinics — competitive prices and fast service.",
    catalogBtn: "View Catalog",
    contactBtn: "Contact Us",
    stats: {
      clients: { num: 550, label: "Clients" },
      products: { num: 700, label: "Products" },
      experience: { num: 11, label: "Years of Experience" },
    },
  },
  advantages: {
    title: "Why",
    experience: {
      title: "Experience-Driven Approach",
      desc: "11 years of practice — tailored professional solutions for every client.",
    },
    warehouse: {
      title: "Private Warehouse",
      desc: "Our Tashkent warehouse keeps products in stock, available for immediate dispatch.",
    },
    distribution: {
      title: "Reliable Supply",
      desc: "We ensure partners receive products reliably and on time across all of Uzbekistan.",
    },
    certificate: {
      title: "Official Guarantee",
      desc: "All products come with a warranty period, and we fully support our clients in any situation.",
    },
    guarantee: {
      title: "Official Distributorship",
      desc: "As an official distributor of trusted medical brands, we deliver quality products.",
    },
    delivery: {
      title: "Stable Partnership",
      desc: "We build long-term, trust-based partnerships with clinics and pharmacies.",
    },
  },
  products: {
    title: "Distributor Products We Offer",
    subtitle: "Quality brands through official distribution",
    seeAll: "View All",
    order: "Order",
    items: {
      satellite: {
        name: "Satellite Glucometers",
        desc: "Test strips and measurement devices — official Satellite distributor.",
        tag: "Official Distributor",
      },
      palma: {
        name: "GK Palma Colostomy Bags",
        desc: "Triocel and Abucel brands — wide range of specialized medical products.",
        tag: "Medical Specialty",
      },
      easydrip: {
        name: "Easy Drip Needles",
        desc: "Innovative insulin needles — sizes 4, 5, 6 and 8 mm.",
        tag: "Innovative",
      },
      makon: {
        name: "Makon Mirzo Orthopaedics",
        desc: "Wide range of orthopaedic products for patients.",
        tag: "Wide Assortment",
      },
    },
  },
  ownBrand: {
    title: "Products Under the Ummed Brand",
    subtitle: "Our own reliable quality products",
    items: {
      tonometr: {
        name: "Ummed Tonometer Pro",
        desc: "Automatic digital tonometer — precise blood pressure and pulse measurement.",
      },
      glukometr: {
        name: "Ummed Smart Glucometer",
        desc: "Fast and accurate blood sugar monitor, connects to mobile app.",
      },
      termometr: {
        name: "Ummed Touch Thermometer",
        desc: "Non-contact infrared thermometer for children and adults.",
      },
      oksimetr: {
        name: "Ummed Pulse Oximeter",
        desc: "Blood oxygen level (SpO2) and pulse — bright OLED display.",
      },
    },
  },
  cta: {
    title: "Need Wholesale Prices?",
    desc: "Contact our manager for special prices and discounts for pharmacies or clinics.",
    btn: "Request Price",
  },
  uzum: {
    title: "Our Official Stores on Uzum Market",
    subtitle: "Official stores on Uzum Market",
    visit: "Visit Store",
    shops: {
      ummed:     { name: "Ummed",        tag: "Main Store",            href: "https://uzum.uz/uz/shop/ummed" },
      ababil:    { name: "Ababil",       tag: "Premium Brand",         href: "https://uzum.uz/uz/shop/ababil" },
    },
  },
  footer: {
    tagline: "A trusted partner in the medical equipment industry. We operate on quality and guarantee.",
    pages: "Pages",
    contact: "Contact",
    social: "Social Media",
    workHours: "Working hours: Mon–Sat, 09:00–18:00",
    copyright: "© 2024 Ummed Medical Equipment. All rights reserved.",
    address: "Tashkent district, Hasanboy Guzari, THAY Yokasi street",
  },
  about: {
    title: "About Us",
    label: "About Us",
    teamAlt: "Ummed team",
    stats: {
      experience: "Years of Experience",
      partners: "Partners",
      products: "Products",
    },
    text1: "Ummed is a company that has been supplying pharmacies and clinics across Uzbekistan with quality medical products for over 11 years.",
    text2: "Over 11 years of operation, we have built strong expertise in the market. Our partner network and product range continue to grow steadily.",
    text3: "Today we serve hundreds of partners across Uzbekistan with over 700 product items.",
    text4: "Long-term cooperation, quality products, and market-driven solutions are our core principles.",
    values: {
      label: "Our Values",
      items: [
        { title: "Trust & Responsibility", desc: "We value trust in every partnership and take full responsibility for product quality and service." },
        { title: "Stable Partnership", desc: "Long-term and reliable collaboration with pharmacies and medical institutions is our top priority." },
        { title: "Drive to Improve", desc: "We continuously grow and update in line with the demands of the medical market." },
      ],
    },
    gallery: {
      label: "Work Process & Warehouse Operations",
      caption: "Every order is processed through warehouse, preparation, and shipping stages under strict supervision.",
    },
    partners: { label: "Our Partners" },
    founder: {
      label: "Our Founder",
      name: "Farhod Abdullayev",
      role: "Co-Founder",
      bio1: "Born in 1995. Graduated from the Tashkent Pharmaceutical Institute.",
      bio2: "Over 12 years of experience in medicine and pharmaceuticals. Founded Ummed and built a partner network of 550+ pharmacies and clinics across Uzbekistan.",
      email: "farhod@ummed.uz",
      instagramLabel: "Instagram",
      telegramLabel: "Telegram",
      instagramUrl: "https://instagram.com/farkhod_abdullaev_",
      telegramUrl: "https://t.me/farkhod_abdullaev",
    },
    cta: {
      title: "Ready to Partner With Us?",
      btn: "Get in Touch",
    },
  },
  contact: {
    label: "Contact",
    title: "Get in Touch",
    desc: "Ask a question, leave a suggestion, or place a wholesale order — our manager will respond promptly.",
    form: {
      label: "Send a Message",
      name: "Full Name",
      namePlaceholder: "E.g.: John Smith",
      phone: "Phone Number",
      message: "Message",
      messagePlaceholder: "Write your question, suggestion, or order...",
      submit: "Send Message",
      sending: "Sending...",
      errors: {
        name: "Name is required",
        phone: "Phone number is required",
        message: "Message is required",
      },
      success: {
        title: "Message Sent",
        desc: "Our manager will contact you during working hours.",
        again: "Send Another Message",
      },
    },
    info: {
      phone: "Phone",
      hours: "Mon–Sat, 09:00–18:00",
      email: "Email",
      emailDesc: "Response within 24 hours",
      address: "Address",
      city: "Tashkent district",
      street: "Hasanboy Guzari, THAY Yokasi street",
      social: "Social Media",
    },
  },
  catalog: {
    label: "Catalog",
    title: "All Products",
    countSuffix: "products",
    search: "Search",
    searchPlaceholder: "Product name...",
    category: "Category",
    reset: "Reset Filter",
    filterOpen: "Filter",
    filterClose: "Close Filter",
    notFound: "No products found",
    notFoundHint: "Try changing the filter or search term",
    detail: "Details",
    availableLabel: "In stock",
    foundSuffix: "products found",
    categories: {
      hammasi: "All",
      diagnostika: "Diagnostics",
      nafas: "Respiratory Devices",
      yurak: "Cardiac Devices",
      mebel: "Medical Furniture",
      sterilizatsiya: "Sterilization",
    },
    badges: {
      Yangi: "New",
      Ommabop: "Popular",
      Sertifikat: "Certificate",
      tezOrada: "Coming soon",
      hit: "Bestseller",
      tugagan: "Out of stock",
      Professional: "Professional",
    },
  },
  news: {
    label: "News",
    title: "Latest News",
    items: [
      { id: 1, date: "May 15, 2025", title: "Ummed Introduces New Medical Equipment Line", desc: "In 2025, our company expanded its range with new diagnostic equipment meeting international quality standards.", category: "News" },
      { id: 2, date: "May 2, 2025", title: "Medical Equipment Market in Uzbekistan: 2025 Trends", desc: "Experts note that digitalization and modern technology adoption continue to advance in the medical equipment sector.", category: "Analysis" },
      { id: 3, date: "April 18, 2025", title: "Partnership with 550+ Pharmacies: Keys to Success", desc: "Detailed information about the trusted partner network built by the Ummed team across Uzbekistan.", category: "Partnership" },
      { id: 4, date: "April 5, 2025", title: "ISO Certification Process: How Our Quality Control Works", desc: "Our products are tested against strict international standards. This article explains the process in detail.", category: "Quality" },
      { id: 5, date: "March 20, 2025", title: "Ummed Booth at Tashkent Medical Exhibition", desc: "At the international exhibition held in March, our company showcased its latest products.", category: "Event" },
      { id: 6, date: "March 10, 2025", title: "New Logistics Center: Faster Deliveries Ahead", desc: "Ummed launched new logistics infrastructure to ensure fast delivery across all of Uzbekistan.", category: "News" },
    ],
  },
  product: {
    breadcrumbHome: "Home",
    breadcrumbCatalog: "Catalog",
    tabDesc: "Description",
    tabSpecs: "Specifications",
    outOfStock: "Out of Stock",
    inStock: "In Stock",
    discount: "discount",
    delivery: "Fast Delivery",
    warranty: "Warranty included",
    requestTitle: "Request Price",
    requestDesc: "For wholesale price or additional information",
    formName: "Your Name",
    formPhone: "Phone",
    formComment: "Comment",
    formCommentPlaceholder: "question or quantity...",
    formSubmit: "Request Price →",
    formSending: "Sending...",
    formPrivacy: "Your data is used for contact purposes only",
    successTitle: "Request Received!",
    successDesc: "Our manager will contact you shortly.",
    successAgain: "Send Another Request",
    similar: "Similar Products",
    detailBtn: "Details →",
  },
};

const LangContext = createContext({ lang: "uz", t: translations.uz, setLang: () => {} });

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState("uz");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      const saved = localStorage.getItem("ummed-lang");
      if (saved === "uz" || saved === "ru" || saved === "en") setLangState(saved);
      setReady(true);
    });

    return () => cancelAnimationFrame(frame);
  }, []);

  function setLang(l) {
    setLangState(l);
    try { localStorage.setItem("ummed-lang", l); } catch {}
  }

  return (
    <LangContext.Provider value={{ lang, t: translations[lang], setLang }}>
      <div style={{ visibility: ready ? "visible" : "visible" }}>{children}</div>
    </LangContext.Provider>
  );
}

export const useLang = () => useContext(LangContext);
