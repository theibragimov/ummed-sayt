"use client";

import { createContext, useContext, useEffect, useState } from "react";

export const translations = {
  uz: {
    nav: { home: "Bosh sahifa", catalog: "Katalog", about: "Biz haqimizda", news: "Yangiliklar", contact: "Aloqa" },
    hero: {
      badge: "Tibbiyot buyumlari",
      title1: "Butun Oʻzbekiston boʻylab",
      title2: "tibbiyot buyumlarini ulgurji",
      title3: "yetkazib beramiz.",
      desc:
        "Dorixona va klinikalar uchun zamonaviy tibbiyot buyumlari, qulay narx va tezkor xizmat taklif qilamiz.",
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
        desc: "11 yillik amaliy tajriba — har bir mijozga moslashtirilgan, professional yechim taklif qilamiz.",
      },
      warehouse: {
        title: "Xususiy ombor",
        desc: "Toshkentda joylashgan o'z omborimiz — mahsulotlar doim mavjud, kutib o'tirish kerak emas.",
      },
      distribution: {
        title: "Yetuk distribyutorlik",
        desc: "O'zbekiston bo'ylab keng tarqalgan yetkazib berish tarmog'i — viloyatlarga ham tezda yetib boradi.",
      },
      certificate: {
        title: "Sertifikat",
        desc: "Dorixona va klinikalar uchun zamonaviy tibbiyot buyumlari, qulay narx va tezkor xizmat taklif qilamiz.",
      },
      guarantee: {
        title: "Kafolat",
        desc: "Har bir jihozga 1 yildan 3 yilgacha rasmiy ishlab chiqaruvchi kafolati beriladi.",
      },
      delivery: {
        title: "Yetkazib berish",
        desc: "O'zbekiston bo'ylab tezkor yetkazib berish. Toshkent shahrida kuni bilan, viloyatlarga 1–3 kun.",
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
        ummed: { name: "Ummed", tag: "Asosiy do'kon" },
        ababil: { name: "Ababil", tag: "Premium brend" },
        ummedIhma: { name: "Ummed x IHMA", tag: "Hamkorlik kolleksiyasi" },
      },
    },
    footer: {
      tagline: "Tibbiy jihozlar sohasida ishonchli hamkor. Sifat va kafolatga tayanib ishlaymiz.",
      pages: "Sahifalar",
      contact: "Aloqa",
      social: "Ijtimoiy tarmoqlar",
      workHours: "Ish vaqti: Du–Sha, 09:00–18:00",
      copyright: "© 2024 Ummed Tibbiy Jihozlar. Barcha huquqlar himoyalangan.",
      address: "O'zbekiston, Toshkent",
    },
  },
  ru: {
    nav: { home: "Главная", catalog: "Каталог", about: "О нас", contact: "Контакты" },
    hero: {
      badge: "Медицинские изделия",
      title1: "Надёжно поставляем",
      title2: "медицинские изделия оптом",
      title3: "по всему Узбекистану.",
      desc:
        "Современные медицинские изделия для аптек и клиник, удобные цены и быстрый сервис.",
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
        title: "Зрелая дистрибуция",
        desc: "Широкая сеть доставки по всему Узбекистану — товары быстро доходят и в регионы.",
      },
      certificate: {
        title: "Сертификат",
        desc: "Современные медицинские изделия для аптек и клиник, удобные цены и быстрый сервис.",
      },
      guarantee: {
        title: "Гарантия",
        desc: "На каждое оборудование предоставляется официальная гарантия производителя от 1 до 3 лет.",
      },
      delivery: {
        title: "Доставка",
        desc: "Быстрая доставка по Узбекистану. В Ташкенте — в день заказа, в регионы — 1–3 дня.",
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
        ummed: { name: "Ummed", tag: "Основной магазин" },
        ababil: { name: "Ababil", tag: "Премиум бренд" },
        ummedIhma: { name: "Ummed x IHMA", tag: "Совместная коллекция" },
      },
    },
    footer: {
      tagline: "Надёжный партнёр в сфере медоборудования. Опираемся на качество и гарантию.",
      pages: "Страницы",
      contact: "Контакты",
      social: "Социальные сети",
      workHours: "Рабочие часы: Пн–Сб, 09:00–18:00",
      copyright: "© 2024 Ummed Медоборудование. Все права защищены.",
      address: "Узбекистан, Ташкент",
    },
  },
};

const LangContext = createContext({ lang: "uz", t: translations.uz, setLang: () => {} });

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState("uz");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const saved = typeof window !== "undefined" ? localStorage.getItem("ummed-lang") : null;
    if (saved === "uz" || saved === "ru") setLangState(saved);
    setReady(true);
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
