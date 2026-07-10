'use client';
import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  ShoppingCart, Plus, Minus, Trash2, ChevronLeft, CheckCircle,
  Search, Package, X, ChevronDown, ChevronUp, Phone, User, Building2,
  Menu, ChevronRight, LayoutList, LayoutGrid, Trophy, Truck, BadgePercent,
} from 'lucide-react';

// ─── Types ───────────────────────────────────────────────────────────────────

interface Product {
  id: string;
  type: string;
  name: string;
  code: string;
  categoryId: string | null;
  categoryName: string;
  rootCategoryId: string | null;
  rootCategoryName: string;
  price: number;
  stock: number;
  imageHref: string;
  parentProductId?: string;
}

interface Category {
  id: string;
  name: string;
  children: { id: string; name: string }[];
  descendantIds: string[];
}

interface PriceType {
  id: string;
  name: string;
}

interface CartItem {
  product: Product;
  quantity: number;
}

type View = 'landing' | 'catalog' | 'cart' | 'checkout' | 'success';
type Lang = 'uz' | 'ru';

// ─── Translations ─────────────────────────────────────────────────────────────

const T = {
  uz: {
    storeName: "Online Buyurtma",
    catalog: "Katalog",
    cart: "Savat",
    checkout: "Rasmiylashtirish",
    search: "Mahsulot qidirish...",
    allCategories: "Barcha mahsulotlar",
    noProducts: "Mahsulot topilmadi",
    cartEmpty: "Savat bo'sh",
    cartEmptySub: "Katalogdan mahsulot qo'shing",
    backToCatalog: "Katalogga qaytish",
    total: "Jami",
    items: "ta",
    orderBtn: "Buyurtma berish",
    namePlaceholder: "Ism Familya *",
    companyPlaceholder: "Firma nomi (ixtiyoriy)",
    phonePlaceholder: "+998 XX XXX XX XX *",
    submitBtn: "Tasdiqlash va yuborish",
    orderSummary: "Buyurtma tarkibi",
    successTitle: "Buyurtma qabul qilindi!",
    successMsg: "Tez orada siz bilan bog'lanamiz",
    orderNumber: "Buyurtma raqami",
    newOrder: "Yangi buyurtma",
    nameRequired: "Ism Familya kiritish majburiy",
    phoneRequired: "Telefon raqam kiritish majburiy",
    phoneInvalid: "To'g'ri telefon raqam kiriting",
    sending: "Yuborilmoqda...",
    clearCart: "Tozalash",
    priceList: "Narx ro'yxati",
    loading: "Yuklanmoqda...",
    loadError: "Xatolik yuz berdi",
    retry: "Qayta urinish",
    sum: "so'm",
    add: "Qo'shish",
    categories: "Kategoriyalar",
    close: "Yopish",
    showMore: "Yana ko'rsatish",
    top50Cat: "TOP 50 mahsulotlar",
    freeDeliveryNeed: "Toshkent shahar ichida bepul yetkazib berish uchun yana",
    freeDeliveryNeedEnd: "qoldi",
    freeDeliveryDone: "Tabriklaymiz! Toshkent shahar ichida yetkazib berish sizga bepul.",
    freeDeliveryConfirmTitle: "Haqiqatan ham rasmiylashtirmoqchimisiz?",
    freeDeliveryConfirmMsg: "Buyurtmangiz summasini 2 mln so'mdan ortiq qilsangiz, Toshkent shahar ichida yetkazib berish bepul amalga oshiriladi.",
    addMoreBtn: "Mahsulot qo'shish",
    continueAnywayBtn: "Baribir davom etish",
  },
  ru: {
    storeName: "Онлайн Заказ",
    catalog: "Каталог",
    cart: "Корзина",
    checkout: "Оформление",
    search: "Поиск товара...",
    allCategories: "Все товары",
    noProducts: "Товары не найдены",
    cartEmpty: "Корзина пуста",
    cartEmptySub: "Добавьте товары из каталога",
    backToCatalog: "Вернуться в каталог",
    total: "Итого",
    items: "шт.",
    orderBtn: "Оформить заказ",
    namePlaceholder: "Имя Фамилия *",
    companyPlaceholder: "Название компании (необязательно)",
    phonePlaceholder: "+998 XX XXX XX XX *",
    submitBtn: "Подтвердить и отправить",
    orderSummary: "Состав заказа",
    successTitle: "Заказ принят!",
    successMsg: "Мы свяжемся с вами в ближайшее время",
    orderNumber: "Номер заказа",
    newOrder: "Новый заказ",
    nameRequired: "Введите имя и фамилию",
    phoneRequired: "Введите номер телефона",
    phoneInvalid: "Введите корректный номер телефона",
    sending: "Отправляем...",
    clearCart: "Очистить",
    priceList: "Прайс-лист",
    loading: "Загрузка...",
    loadError: "Произошла ошибка",
    retry: "Повторить",
    sum: "сум",
    add: "Добавить",
    categories: "Категории",
    close: "Закрыть",
    showMore: "Показать ещё",
    top50Cat: "ТОП 50 товаров",
    freeDeliveryNeed: "До бесплатной доставки по Ташкенту осталось",
    freeDeliveryNeedEnd: "",
    freeDeliveryDone: "Поздравляем! Доставка по Ташкенту для вас бесплатна.",
    freeDeliveryConfirmTitle: "Вы действительно хотите оформить заказ?",
    freeDeliveryConfirmMsg: "Если сумма заказа превысит 2 млн сум, доставка по Ташкенту будет бесплатной.",
    addMoreBtn: "Добавить товары",
    continueAnywayBtn: "Продолжить в любом случае",
  },
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function fmtPrice(val: number): string {
  const v = Math.round(val / 100);
  return v.toLocaleString('ru-RU');
}

const CART_STORAGE_KEY = 'moysklad-order-cart-v1';
const CATALOG_CACHE_PREFIX = 'moysklad-order-catalog-v1';
const INITIAL_PRODUCT_LIMIT = 160;
const PRODUCT_LIMIT_STEP = 160;
const TOP50_CAT_ID = '__top50__';
// Narxlar *100 birlikda saqlanadi (fmtPrice / 100), shuning uchun 2 000 000 so'm = 200 000 000
const FREE_DELIVERY_THRESHOLD = 200_000_000;
const NEW_ARRIVAL_CATEGORY_MARKER = 'Новинки';

function isNewArrivalProduct(p: Product): boolean {
  return p.categoryName.includes(NEW_ARRIVAL_CATEGORY_MARKER) || p.rootCategoryName.includes(NEW_ARRIVAL_CATEGORY_MARKER);
}

interface CatalogCache {
  products: Product[];
  categories: Category[];
  priceTypes: PriceType[];
  selectedPriceType: PriceType | null;
}

function catalogCacheKey(ptId: string) {
  return `${CATALOG_CACHE_PREFIX}:${ptId || 'default'}`;
}

function readCatalogCache(ptId: string): CatalogCache | null {
  try {
    const raw = window.localStorage.getItem(catalogCacheKey(ptId));
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || !Array.isArray(parsed.products) || !Array.isArray(parsed.categories)) return null;
    return parsed;
  } catch {
    return null;
  }
}

function writeCatalogCache(ptId: string, data: CatalogCache) {
  try {
    window.localStorage.setItem(catalogCacheKey(ptId), JSON.stringify(data));
  } catch {}
}

function parseStoredCart(): Record<string, CartItem> {
  try {
    const raw = window.localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    if (parsed?.version !== 1 || !Array.isArray(parsed.items)) return {};

    return parsed.items.reduce((acc: Record<string, CartItem>, item: any) => {
      if (!item?.product?.id || !Number.isFinite(Number(item.quantity))) return acc;
      acc[item.product.id] = {
        product: item.product,
        quantity: Math.max(1, Math.floor(Number(item.quantity))),
      };
      return acc;
    }, {});
  } catch {
    return {};
  }
}

function storeCart(cart: Record<string, CartItem>) {
  const items = Object.values(cart);
  if (!items.length) {
    window.localStorage.removeItem(CART_STORAGE_KEY);
    return;
  }
  window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify({ version: 1, items }));
}

function reconcileCart(
  cart: Record<string, CartItem>,
  products: Product[]
): Record<string, CartItem> {
  const byId = new Map(products.map(p => [p.id, p]));
  let changed = false;
  const next: Record<string, CartItem> = {};

  for (const [id, item] of Object.entries(cart)) {
    const currentProduct = byId.get(id) || item.product;
    next[id] = { product: currentProduct, quantity: item.quantity };
    if (currentProduct !== item.product) changed = true;
  }

  return changed ? next : cart;
}

// ─── Image Lightbox ───────────────────────────────────────────────────────────

function Lightbox({ product, onClose }: { product: Product; onClose: () => void }) {
  const [loaded, setLoaded] = useState(false);
  const fullSrc = `/api/order/image?id=${product.id}&t=${product.type}&full=1`;

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.88)' }}
      onClick={onClose}>
      <div className="relative max-w-xl w-full" onClick={e => e.stopPropagation()}>
        <button onClick={onClose}
          className="absolute -top-10 right-0 w-8 h-8 flex items-center justify-center rounded-full"
          style={{ background: 'rgba(255,255,255,0.15)' }}>
          <X size={18} color="#fff" />
        </button>
        {/* Show miniature while full image loads */}
        {!loaded && product.imageHref && (
          <img
            src={`/api/order/image?href=${encodeURIComponent(product.imageHref)}`}
            alt={product.name}
            className="w-full rounded-2xl object-contain"
            style={{ maxHeight: '70vh', filter: 'blur(0px)' }}
          />
        )}
        <img
          src={fullSrc}
          alt={product.name}
          className="w-full rounded-2xl object-contain"
          style={{ maxHeight: '70vh', display: loaded ? 'block' : 'none' }}
          onLoad={() => setLoaded(true)}
        />
        <p className="text-white text-center text-[13px] mt-3 opacity-70 leading-snug px-4">
          {product.name}
        </p>
      </div>
    </div>
  );
}

// ─── Product Row ──────────────────────────────────────────────────────────────

function ProductRow({
  product, cartQty, onAdd, onQtyChange, onImageClick, lang, isTop50, isNewArrival,
}: {
  product: Product;
  cartQty: number;
  onAdd: () => void;
  onQtyChange: (qty: number) => void;
  onImageClick: () => void;
  lang: Lang;
  isTop50: boolean;
  isNewArrival: boolean;
}) {
  const t = T[lang];
  const { base: baseName, variant } = parseVariant(product.name);
  const [imgErr, setImgErr] = useState(false);

  return (
    <div className="flex items-center gap-3 px-4 py-3"
      style={{ borderBottom: '1px solid #F0F0F0' }}>
      {/* Thumbnail */}
      <button
        onClick={product.imageHref && !imgErr ? onImageClick : undefined}
        className="flex-shrink-0 w-14 h-14 rounded-xl overflow-hidden"
        style={{
          background: '#F5F5F5',
          cursor: product.imageHref && !imgErr ? 'zoom-in' : 'default',
        }}>
        {product.imageHref && !imgErr ? (
          <img
            src={`/api/order/image?href=${encodeURIComponent(product.imageHref)}`}
            alt={product.name}
            className="w-full h-full object-cover"
            onError={() => setImgErr(true)}
            loading="lazy"
            decoding="async"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Package size={22} color="#D1D5DB" />
          </div>
        )}
      </button>

      {/* Name + code */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 mb-0.5">
          {isNewArrival && (
            <span className="px-1.5 py-0.5 rounded text-white text-[9px] font-bold flex-shrink-0"
              style={{ background: '#3DB851' }}>
              Новинка
            </span>
          )}
          {isTop50 && (
            <span className="px-1.5 py-0.5 rounded text-white text-[9px] font-bold flex-shrink-0"
              style={{ background: '#2563EB' }}>
              TOP 50
            </span>
          )}
        </div>
        <p className="text-[13px] font-semibold text-gray-800 leading-snug"
          style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' } as any}>
          {baseName}
        </p>
        <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
          {variant && (
            <span className="inline-flex items-center px-1.5 py-0.5 rounded-md text-[10px] font-bold"
              style={{ background: 'rgba(255,107,53,0.1)', color: '#FF6B35', border: '1px solid rgba(255,107,53,0.2)' }}>
              {variant}
            </span>
          )}
          {product.code && (
            <span className="text-[11px] text-gray-400">{product.code}</span>
          )}
        </div>
      </div>

      {/* Price + control */}
      <div className="flex-shrink-0 flex flex-col items-end gap-1.5">
        {product.price > 0 && (
          <p className="text-[13px] font-bold text-gray-900 whitespace-nowrap">
            {fmtPrice(product.price)} <span className="text-[10px] font-normal text-gray-400">{t.sum}</span>
          </p>
        )}

        {cartQty === 0 ? (
          <button
            data-testid={`add-to-cart-${product.id}`}
            onClick={onAdd}
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg,#FF6B35,#FF4500)', boxShadow: '0 3px 10px rgba(255,107,53,0.35)' }}>
            <Plus size={16} color="#fff" />
          </button>
        ) : (
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => onQtyChange(cartQty - 1)}
              className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={{ background: '#FFF0EB', border: '1px solid #FFD5C5' }}>
              {cartQty === 1 ? <Trash2 size={11} color="#FF6B35" /> : <Minus size={11} color="#FF6B35" />}
            </button>
            <span className="w-5 text-center text-[13px] font-bold text-gray-900">{cartQty}</span>
            <button
              onClick={() => onQtyChange(cartQty + 1)}
              className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg,#FF6B35,#FF4500)' }}>
              <Plus size={11} color="#fff" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// Extract variant label from product name: "Name (S/M/L)" → { base: "Name", variant: "S/M/L" }
function parseVariant(name: string): { base: string; variant: string | null } {
  // Try parentheses pattern first: "Name (variant)"
  let base = name, v: string | null = null;
  const parenMatch = name.match(/^(.*?)\s*\(([^)]+)\)\s*$/);
  const dashMatch = !parenMatch && name.match(/^(.*?)\s+[–—-]{1,2}\s+(.+)$/);
  if (parenMatch) {
    base = parenMatch[1].trim();
    v = parenMatch[2].trim();
  } else if (dashMatch) {
    base = dashMatch[1].trim();
    v = dashMatch[2].trim();
  }
  if (!v) return { base: name, variant: null };
  // Only show size/color/model chips — skip expiry dates, dosage info, descriptions
  const skip =
    v.length > 40 ||                              // too long = description
    /\d\s*(мг|МЕ|мкг|ЕПК|DGK)/i.test(v) ||      // dosage with numbers: "500 мг", "300 МЕ"
    /D3[-–\s]/i.test(v) ||                        // "D3-300" vitamin
    /год\b/i.test(v) ||                           // expiry year
    /=/.test(v) ||                                // formula "1 таб. = ..."
    /^для\s/i.test(v) ||                          // "для косметологии..."
    /таб\.|кап\.|амп\./i.test(v) ||              // dosage form abbreviations
    /ср\.год/i.test(v);                           // "ср.год. 2027"
  return { base, variant: skip ? null : v };
}

// ─── Product Card (Grid View) ─────────────────────────────────────────────────

function ProductCard({
  product, cartQty, onAdd, onQtyChange, onImageClick, lang, isTop50, isNewArrival,
}: {
  product: Product;
  cartQty: number;
  onAdd: () => void;
  onQtyChange: (qty: number) => void;
  onImageClick: () => void;
  lang: Lang;
  isTop50: boolean;
  isNewArrival: boolean;
}) {
  const t = T[lang];
  const { base: baseName, variant } = parseVariant(product.name);
  const fullSrc = `/api/order/image?id=${product.id}&t=${product.type}&full=1`;
  const miniSrc = product.imageHref ? `/api/order/image?href=${encodeURIComponent(product.imageHref)}` : '';
  const [imgSrc, setImgSrc] = useState(fullSrc);
  const [imgErr, setImgErr] = useState(false);

  function handleImgError() {
    if (imgSrc === fullSrc && miniSrc) {
      setImgSrc(miniSrc);
    } else {
      setImgErr(true);
    }
  }

  return (
    <div className="flex flex-col rounded-2xl overflow-hidden"
      style={{ background: '#fff', border: '1px solid #F0F0F0', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
      {/* Image */}
      <button
        onClick={product.imageHref && !imgErr ? onImageClick : undefined}
        className="relative w-full aspect-square overflow-hidden"
        style={{
          background: '#F8F8F8',
          cursor: product.imageHref && !imgErr ? 'zoom-in' : 'default',
        }}>
        {!imgErr ? (
          <img
            src={imgSrc}
            alt={product.name}
            className="w-full h-full object-contain transition-transform duration-300 hover:scale-105"
            onError={handleImgError}
            loading="lazy"
            decoding="async"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Package size={32} color="#D1D5DB" />
          </div>
        )}
        {(isNewArrival || isTop50) && (
          <div className="absolute top-2 left-2 flex flex-col items-start gap-1">
            {isNewArrival && (
              <div className="px-1.5 py-0.5 rounded-md text-white text-[9px] font-bold"
                style={{ background: '#3DB851', letterSpacing: '0.03em' }}>
                Новинка
              </div>
            )}
            {isTop50 && (
              <div className="px-1.5 py-0.5 rounded-md text-white text-[9px] font-bold"
                style={{ background: '#2563EB', letterSpacing: '0.03em' }}>
                TOP 50
              </div>
            )}
          </div>
        )}
        {cartQty > 0 && (
          <div className="absolute top-2 right-2 w-5 h-5 rounded-full flex items-center justify-center text-white text-[10px] font-bold"
            style={{ background: '#FF6B35' }}>
            {cartQty}
          </div>
        )}
      </button>

      {/* Info */}
      <div className="flex flex-col flex-1 p-3 gap-2">
        <div className="flex-1">
          <p className="text-[12px] font-semibold text-gray-800 leading-snug"
            style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' } as any}>
            {baseName}
          </p>
          <div className="flex items-center gap-1.5 mt-1 flex-wrap">
            {variant && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-lg text-[10px] font-bold"
                style={{ background: 'rgba(255,107,53,0.1)', color: '#FF6B35', border: '1px solid rgba(255,107,53,0.25)' }}>
                {variant}
              </span>
            )}
            {product.code && (
              <span className="text-[10px] text-gray-400">{product.code}</span>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between gap-1 mt-auto">
          {product.price > 0 ? (
            <p className="text-[12px] font-bold text-gray-900 leading-tight">
              {fmtPrice(product.price)}<br />
              <span className="text-[9px] font-normal text-gray-400">{t.sum}</span>
            </p>
          ) : <div />}

          {cartQty === 0 ? (
            <button
              onClick={onAdd}
              className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: 'linear-gradient(135deg,#FF6B35,#FF4500)', boxShadow: '0 3px 8px rgba(255,107,53,0.35)' }}>
              <Plus size={15} color="#fff" />
            </button>
          ) : (
            <div className="flex items-center gap-1">
              <button
                onClick={() => onQtyChange(cartQty - 1)}
                className="w-7 h-7 rounded-lg flex items-center justify-center"
                style={{ background: '#FFF0EB', border: '1px solid #FFD5C5' }}>
                {cartQty === 1 ? <Trash2 size={11} color="#FF6B35" /> : <Minus size={11} color="#FF6B35" />}
              </button>
              <span className="w-5 text-center text-[12px] font-bold text-gray-900">{cartQty}</span>
              <button
                onClick={() => onQtyChange(cartQty + 1)}
                className="w-7 h-7 rounded-xl flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg,#FF6B35,#FF4500)' }}>
                <Plus size={11} color="#fff" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function OrderPage() {
  const [lang, setLang] = useState<Lang>('ru');
  const t = T[lang];

  const [view, setView] = useState<View>('landing');
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [priceTypes, setPriceTypes] = useState<PriceType[]>([]);
  const [selectedPriceType, setSelectedPriceType] = useState<PriceType | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  const [selectedCat, setSelectedCat] = useState<string | null>(null); // can be parent or child ID
  const [search, setSearch] = useState('');
  const [cart, setCart] = useState<Record<string, CartItem>>({});
  const [cartHydrated, setCartHydrated] = useState(false);
  const [summaryOpen, setSummaryOpen] = useState(false);
  const [successOrderName, setSuccessOrderName] = useState('');
  const [showDeliveryConfirm, setShowDeliveryConfirm] = useState(false);
  const [lightboxProduct, setLightboxProduct] = useState<Product | null>(null);
  const [mobileCatOpen, setMobileCatOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState(INITIAL_PRODUCT_LIMIT);
  const [displayMode, setDisplayMode] = useState<'list' | 'grid'>('grid');
  useEffect(() => {
    const saved = localStorage.getItem('order-display-mode') as 'list' | 'grid' | null;
    if (saved) setDisplayMode(saved);
  }, []);

  // Sotilgan miqdori bo'yicha TO'LIQ tartiblangan ro'yxat (50 tadan ancha katta bo'lishi mumkin) —
  // ba'zi ko'p sotilgan mahsulotlar omborda vaqtincha tugab qolgan bo'lishi mumkin, shuning uchun
  // pastda shulardan HOZIR SOTUVDA BOR birinchi 50 tasi tanlab olinadi (top50DisplayList).
  const [top50Ranked, setTop50Ranked] = useState<string[]>([]);
  useEffect(() => {
    fetch('/api/order/topsales', { cache: 'no-store' })
      .then(r => r.json())
      .then(d => {
        setTop50Ranked(d.top50Ranked ?? []);
      })
      .catch(() => {});
  }, []);
  // Har bir aniq mahsulot/modifikatsiyaning o'rni — kichikroq raqam = ko'proq sotilgan
  const top50RankMap = useMemo(
    () => new Map(top50Ranked.map((id, i) => [id, i])),
    [top50Ranked]
  );
  // Hozir sotuvda bor (katalogda mavjud) mahsulotlardan eng ko'p sotilgan 50 tasi, ketma-ket tartibda
  const top50DisplayList = useMemo(() => {
    const matched = products.filter(p => top50RankMap.has(p.id));
    matched.sort((a, b) => top50RankMap.get(a.id)! - top50RankMap.get(b.id)!);
    return matched.slice(0, 50);
  }, [products, top50RankMap]);
  const top50DisplaySet = useMemo(
    () => new Set(top50DisplayList.map(p => p.id)),
    [top50DisplayList]
  );

  const [formName, setFormName] = useState('');
  const [formCompany, setFormCompany] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  // Restore form from localStorage
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('order-form') || '{}');
      if (saved.name) setFormName(saved.name);
      if (saved.company) setFormCompany(saved.company);
      if (saved.phone) setFormPhone(saved.phone);
    } catch {}
  }, []);

  // Save form to localStorage on change
  useEffect(() => {
    try {
      localStorage.setItem('order-form', JSON.stringify({ name: formName, company: formCompany, phone: formPhone }));
    } catch {}
  }, [formName, formCompany, formPhone]);

  const loadCatalog = useCallback(async (ptId = '', opts: { background?: boolean } = {}) => {
    if (!opts.background) {
      setLoading(true);
      setLoadError('');
    }
    try {
      const url = ptId ? `/api/order/catalog?priceTypeId=${ptId}` : '/api/order/catalog';
      const res = await fetch(url, { cache: 'no-store' });
      const json = await res.json();
      if (json.error) throw new Error(json.error);
      const nextProducts = json.products || [];
      const nextCategories = (json.categories || []).filter((c: Category) => c.name !== 'Прочее');
      const nextPriceTypes = json.priceTypes || [];
      const nextSelectedPriceType = json.selectedPriceType || null;
      setProducts(nextProducts);
      setCart(prev => reconcileCart(prev, nextProducts));
      setCategories(nextCategories);
      setPriceTypes(nextPriceTypes);
      setSelectedPriceType(nextSelectedPriceType);
      writeCatalogCache(ptId, {
        products: nextProducts,
        categories: nextCategories,
        priceTypes: nextPriceTypes,
        selectedPriceType: nextSelectedPriceType,
      });
    } catch (e: any) {
      // Fon rejimida (keshdan ko'rsatilgandan keyingi yangilanish) xatoni jim yutamiz —
      // foydalanuvchi allaqachon eski (lekin ishlaydigan) ma'lumotni ko'rib turibdi.
      if (!opts.background) setLoadError(e.message);
    } finally {
      if (!opts.background) setLoading(false);
    }
  }, []);

  // Katalogni ochish: keshda bo'lsa darhol ko'rsatamiz (qayta yuklanmaydi), fon rejimida yangilaymiz.
  // Kesh bo'lmasa (birinchi tashrif) — oddiy yuklash spinneri bilan.
  const openCatalog = useCallback(() => {
    setView('catalog');
    const cached = readCatalogCache('');
    if (cached) {
      setProducts(cached.products);
      setCart(prev => reconcileCart(prev, cached.products));
      setCategories(cached.categories);
      setPriceTypes(cached.priceTypes);
      setSelectedPriceType(cached.selectedPriceType);
      setLoading(false);
      loadCatalog('', { background: true });
    } else {
      loadCatalog('');
    }
  }, [loadCatalog]);

  useEffect(() => {
    setCart(parseStoredCart());
    setCartHydrated(true);
  }, []);

  useEffect(() => {
    if (!cartHydrated) return;
    storeCart(cart);
  }, [cart, cartHydrated]);

  // loadCatalog is called when user taps CTA on landing screen (not on mount)
  useEffect(() => { window.scrollTo({ top: 0 }); }, [view]);
  useEffect(() => {
    setVisibleCount(INITIAL_PRODUCT_LIMIT);
  }, [selectedCat, search, selectedPriceType?.id]);

  const cartItems = Object.values(cart);
  const cartCount = cartItems.reduce((s, i) => s + i.quantity, 0);
  const cartTotal = cartItems.reduce((s, i) => s + i.product.price * i.quantity, 0);

  function addToCart(p: Product) {
    setCart(prev => ({ ...prev, [p.id]: { product: p, quantity: (prev[p.id]?.quantity || 0) + 1 } }));
  }

  function setQty(productId: string, qty: number) {
    if (qty <= 0) {
      setCart(prev => { const n = { ...prev }; delete n[productId]; return n; });
    } else {
      setCart(prev => ({ ...prev, [productId]: { ...prev[productId], quantity: qty } }));
    }
  }

  // When a parent category is selected, include products from all its subcategories
  const selectedCatDescendants = useMemo<Set<string> | null>(() => {
    if (!selectedCat) return null;
    const cat = categories.find(c => c.id === selectedCat);
    if (cat) return new Set(cat.descendantIds);
    return new Set([selectedCat]);
  }, [selectedCat, categories]);

  const selectedCatName = useMemo(() => {
    if (!selectedCat) return '';
    if (selectedCat === TOP50_CAT_ID) return t.top50Cat;
    return categories.find(c => c.id === selectedCat)?.name
      || categories.flatMap(c => c.children).find(ch => ch.id === selectedCat)?.name
      || '';
  }, [selectedCat, categories, t]);

  const filteredProducts = useMemo(() => {
    const isTop50View = selectedCat === TOP50_CAT_ID;
    // TOP 50 ko'rinishida — allaqachon eng ko'p sotilgandan kamayib boruvchi ketma-ket
    // tartibda tanlangan 50 ta mavjud mahsulot ustida qidiruv qilinadi
    const base = isTop50View ? top50DisplayList : products;
    return base.filter(p => {
      const matchCat = isTop50View
        || !selectedCat || !!(p.categoryId && selectedCatDescendants?.has(p.categoryId));
      const q = search.toLowerCase();
      const matchSearch = !q || p.name.toLowerCase().includes(q) || p.code.toLowerCase().includes(q);
      return matchCat && matchSearch;
    });
  }, [products, selectedCat, selectedCatDescendants, search, top50DisplayList]);
  const visibleProducts = useMemo(
    () => filteredProducts.slice(0, visibleCount),
    [filteredProducts, visibleCount]
  );

  async function handleSubmit() {
    const errors: Record<string, string> = {};
    if (!formName.trim()) errors.name = t.nameRequired;
    if (!formPhone.trim()) errors.phone = t.phoneRequired;
    else if (formPhone.replace(/\D/g, '').length < 9) errors.phone = t.phoneInvalid;
    if (Object.keys(errors).length) { setFormErrors(errors); return; }

    setSubmitting(true);
    try {
      const res = await fetch('/api/order/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer: { name: formName.trim(), company: formCompany.trim(), phone: formPhone.trim() },
          items: cartItems.map(i => ({
            productId: i.product.id,
            type: i.product.type,
            name: i.product.name,
            quantity: i.quantity,
            price: i.product.price,
          })),
        }),
      });
      const json = await res.json();
      if (!res.ok || json.error) throw new Error(json.error || 'Submit failed');
      setSuccessOrderName(json.orderName || '');
      setCart({});
      setFormName(''); setFormCompany(''); setFormPhone('');
      try { localStorage.removeItem('order-form'); } catch {}
      setView('success');
    } catch (e: any) {
      setFormErrors({ submit: e.message });
    } finally {
      setSubmitting(false);
    }
  }

  // ─── LANDING VIEW ─────────────────────────────────────────────────────────

  if (view === 'landing') {
    const cartCount2 = Object.values(cart).reduce((s, i) => s + i.quantity, 0);
    const features = lang === 'uz'
      ? [
          { Icon: Package, label: '700+ mahsulot assortimenti', bg: '#E8491D' },
          { Icon: BadgePercent, label: 'Qulay narxlar va chegirmalar', bg: '#3DB851' },
          { Icon: Truck, label: 'Tezkor yetkazib berish', bg: '#E8491D' },
        ]
      : [
          { Icon: Package, label: 'Ассортимент 700+ товаров', bg: '#E8491D' },
          { Icon: BadgePercent, label: 'Удобные цены и скидки', bg: '#3DB851' },
          { Icon: Truck, label: 'Быстрая доставка', bg: '#E8491D' },
        ];
    const mockItems = lang === 'uz'
      ? [
          { name: 'Shprits insulinovyi 1ml', qty: 2, bg: '#FFE7DD' },
          { name: 'Tonometr mexanik', qty: 1, bg: '#DFF5E5' },
          { name: "Test polosalari №50", qty: 3, bg: '#FFE7DD' },
        ]
      : [
          { name: 'Шприц инсулиновый 1мл', qty: 2, bg: '#FFE7DD' },
          { name: 'Тонометр механический', qty: 1, bg: '#DFF5E5' },
          { name: 'Тест полоски №50', qty: 3, bg: '#FFE7DD' },
        ];
    return (
      <div className="min-h-screen relative overflow-hidden bg-white flex flex-col"
        style={{ fontFamily: '"Satoshi", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>

        {/* Dot-grid texture, fading toward edges */}
        <div className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(10,10,10,0.08) 1px, transparent 1px)',
            backgroundSize: '28px 28px',
            maskImage: 'radial-gradient(ellipse 70% 60% at 65% 35%, #000 20%, transparent 90%)',
            WebkitMaskImage: 'radial-gradient(ellipse 70% 60% at 65% 35%, #000 20%, transparent 90%)',
          }}
        />

        {/* ── Header ── */}
        <header className="relative z-10 flex items-center gap-3 px-5 sm:px-8 py-4 border-b"
          style={{ borderColor: 'rgba(0,0,0,0.06)' }}>
          <img src="/logo.webp" alt="Умmed" style={{ width: 34, height: 34, objectFit: 'contain' }} />
          <span className="font-bold text-[15px]" style={{ color: '#0a0a0a' }}>Умmed</span>
          <div className="flex-1" />
          <button onClick={() => setLang(l => l === 'uz' ? 'ru' : 'uz')}
            className="px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-colors"
            style={{ border: '1px solid rgba(0,0,0,0.1)', color: '#18181b', background: 'transparent', letterSpacing: '0.05em' }}>
            {lang === 'uz' ? 'RU' : 'UZ'}
          </button>
          {cartCount2 > 0 && (
            <button onClick={() => setView('cart')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[13px] font-bold text-white ml-1 transition-transform active:scale-95"
              style={{ background: '#E8491D' }}>
              <ShoppingCart size={14} />
              <span>{cartCount2}</span>
            </button>
          )}
        </header>

        {/* ── Main ── */}
        <main className="relative z-10 flex-1 w-full max-w-6xl mx-auto px-5 sm:px-8 py-10 lg:py-16 grid lg:grid-cols-[1.05fr_0.95fr] gap-12 lg:gap-16 items-center">

          {/* Left: content */}
          <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
            {/* Section label */}
            <div className="flex items-center gap-2.5 mb-7 anim-fade-up" style={{ animationDelay: '40ms' }}>
              <span className="inline-block w-1.5 h-1.5 flex-shrink-0" style={{ background: '#E8491D' }} />
              <span className="text-[11px] font-medium tracking-widest uppercase" style={{ color: '#18181b', letterSpacing: '0.16em' }}>
                {lang === 'uz' ? 'Online Buyurtma' : 'Онлайн Заказ'}
              </span>
            </div>

            {/* Title */}
            <h1 className="font-extrabold mb-5 leading-[1.08] anim-fade-up"
              style={{ fontSize: 'clamp(30px,4.2vw,48px)', color: '#0a0a0a', letterSpacing: '-0.03em', animationDelay: '120ms' }}>
              {lang === 'uz'
                ? <>Buyurtma berish uchun<br />mahsulotlar ro&apos;yxati</>
                : <>Список товаров<br />для заказа</>}
            </h1>

            {/* Description */}
            <p className="mb-9 leading-relaxed max-w-md anim-fade-up"
              style={{ fontSize: 16, color: '#7c7c80', animationDelay: '200ms' }}>
              {lang === 'uz'
                ? "Buyurtmani oson va qulay usulda bering — operatorimiz siz bilan tez orada bog'lanadi."
                : 'Оформите заказ быстро и удобно — наш оператор свяжется с вами в ближайшее время.'}
            </p>

            {/* Features */}
            <div className="w-full flex flex-col gap-2.5 mb-9">
              {features.map(({ Icon, label, bg }, i) => (
                <div key={i} className="flex items-center gap-3.5 px-4 py-3.5 rounded-xl anim-fade-up"
                  style={{ border: '1px solid rgba(0,0,0,0.06)', background: '#fafafa', animationDelay: `${260 + i * 80}ms` }}>
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: bg }}>
                    <Icon size={17} color="#fff" strokeWidth={2.2} />
                  </div>
                  <span className="text-[14px] font-medium" style={{ color: '#18181b' }}>{label}</span>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div className="w-full anim-fade-up" style={{ animationDelay: '500ms' }}>
              <button
                onClick={openCatalog}
                className="group w-full flex items-center justify-center gap-2 py-4 rounded-xl text-white font-bold text-[15px] transition-all duration-200 active:scale-[0.98]"
                style={{ background: '#E8491D', letterSpacing: '-0.01em', boxShadow: '0 10px 30px -8px rgba(232,73,29,0.55)' }}
                onMouseEnter={e => (e.currentTarget.style.background = '#3DB851')}
                onMouseLeave={e => (e.currentTarget.style.background = '#E8491D')}>
                {lang === 'uz' ? "100% to'lov uchun mahsulotlar ro'yxati" : 'Список товаров для 100% оплаты'}
                <ChevronRight size={17} className="transition-transform duration-200 group-hover:translate-x-1" />
              </button>

              <p className="text-center lg:text-left mt-4 text-[12px]" style={{ color: '#a3a3a8' }}>
                {lang === 'uz' ? 'Katalogni ko\'rish uchun bosing' : 'Нажмите, чтобы открыть каталог'}
              </p>
            </div>
          </div>

          {/* Right: decorative order-card mockup (desktop only) */}
          <div className="hidden lg:flex relative justify-center items-center h-full min-h-[420px]">
            {/* Back card for depth */}
            <div className="absolute w-[320px] h-[380px] rounded-3xl anim-fade-in"
              style={{ background: '#FFF3EC', transform: 'rotate(-7deg) translateY(10px)', animationDelay: '300ms' }} />

            {/* Main order card */}
            <div className="relative w-[320px] rounded-3xl bg-white p-6 anim-fade-in"
              style={{ boxShadow: '0 30px 60px -20px rgba(10,10,10,0.25)', transform: 'rotate(3deg)', animationDelay: '420ms' }}>
              <div className="flex items-center justify-between mb-5">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: '#a3a3a8', letterSpacing: '0.1em' }}>
                    {lang === 'uz' ? 'Buyurtma' : 'Заказ'}
                  </p>
                  <p className="text-[15px] font-extrabold" style={{ color: '#0a0a0a' }}>№ 0234</p>
                </div>
                <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ background: 'rgba(61,184,81,0.12)' }}>
                  <CheckCircle size={19} color="#3DB851" />
                </div>
              </div>

              <div className="flex flex-col gap-3.5 mb-5">
                {mockItems.map((it, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: it.bg }}>
                      <Package size={15} color="#E8491D" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[12.5px] font-semibold truncate" style={{ color: '#18181b' }}>{it.name}</p>
                    </div>
                    <span className="text-[12px] font-bold flex-shrink-0" style={{ color: '#a3a3a8' }}>×{it.qty}</span>
                  </div>
                ))}
              </div>

              <div className="pt-4 flex items-center justify-between" style={{ borderTop: '1px dashed rgba(0,0,0,0.1)' }}>
                <span className="text-[13px] font-semibold" style={{ color: '#7c7c80' }}>{lang === 'uz' ? 'Jami' : 'Итого'}</span>
                <span className="text-[19px] font-extrabold" style={{ color: '#E8491D' }}>2 380 000 <span className="text-[12px] font-medium" style={{ color: '#a3a3a8' }}>{lang === 'uz' ? "so'm" : 'сум'}</span></span>
              </div>
            </div>

            {/* Floating stat pill */}
            <div className="absolute -bottom-3 -left-3 flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white anim-fade-up"
              style={{ boxShadow: '0 12px 28px -10px rgba(10,10,10,0.2)', animationDelay: '600ms' }}>
              <span className="text-[17px] font-extrabold" style={{ color: '#3DB851' }}>700+</span>
              <span className="text-[11px] font-medium leading-tight" style={{ color: '#7c7c80', maxWidth: 64 }}>
                {lang === 'uz' ? "mahsulot turi" : 'товаров'}
              </span>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // ─── CATALOG VIEW ─────────────────────────────────────────────────────────

  if (view === 'catalog') {
    const displayCatName = selectedCatName || t.allCategories;

    return (
      <div className="min-h-screen" style={{ background: '#FAFAFA' }}>
        {lightboxProduct && (
          <Lightbox product={lightboxProduct} onClose={() => setLightboxProduct(null)} />
        )}

        {/* Mobile category drawer */}
        {mobileCatOpen && (
          <>
            <div className="lg:hidden fixed inset-0 z-50 bg-black/40" onClick={() => setMobileCatOpen(false)} />
            <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 rounded-t-3xl bg-white pb-8"
              style={{ boxShadow: '0 -8px 40px rgba(0,0,0,0.15)' }}>
              <div className="flex items-center justify-between px-5 py-4"
                style={{ borderBottom: '1px solid #F0F0F0' }}>
                <span className="text-[15px] font-bold text-gray-900">{t.categories}</span>
                <button onClick={() => setMobileCatOpen(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-full"
                  style={{ background: '#F5F5F5' }}>
                  <X size={16} color="#666" />
                </button>
              </div>
              <div className="overflow-y-auto" style={{ maxHeight: '60vh' }}>
                {/* All products */}
                <button
                  onClick={() => { setSelectedCat(null); setMobileCatOpen(false); }}
                  className="flex items-center justify-between w-full px-5 py-3.5 text-left"
                  style={{ borderBottom: '1px solid #F8F8F8', color: !selectedCat ? '#FF6B35' : '#374151', fontWeight: !selectedCat ? 700 : 500, fontSize: 14 }}>
                  {t.allCategories}
                  {!selectedCat && <ChevronRight size={16} color="#FF6B35" />}
                </button>
                {/* TOP 50 mahsulotlar */}
                <button
                  onClick={() => { setSelectedCat(TOP50_CAT_ID); setMobileCatOpen(false); }}
                  className="flex items-center justify-between w-full px-5 py-3.5 text-left"
                  style={{ borderBottom: '1px solid #F8F8F8', color: selectedCat === TOP50_CAT_ID ? '#2563EB' : '#374151', fontWeight: selectedCat === TOP50_CAT_ID ? 700 : 500, fontSize: 14 }}>
                  <span className="flex items-center gap-1.5"><Trophy size={14} />{t.top50Cat}</span>
                  {selectedCat === TOP50_CAT_ID && <ChevronRight size={16} color="#2563EB" />}
                </button>
                {categories.map(c => {
                  const isParentActive = selectedCat === c.id;
                  const isChildActive = c.children.some(ch => ch.id === selectedCat);
                  return (
                    <div key={c.id}>
                      <button
                        onClick={() => { setSelectedCat(c.id); setMobileCatOpen(false); }}
                        className="flex items-center justify-between w-full px-5 py-3 text-left"
                        style={{ borderBottom: '1px solid #F8F8F8', color: isParentActive ? '#FF6B35' : '#374151', fontWeight: isParentActive || isChildActive ? 700 : 500, fontSize: 14 }}>
                        {c.name}
                        {isParentActive && <ChevronRight size={16} color="#FF6B35" />}
                      </button>
                      {/* Subcategories */}
                      {c.children.map(ch => (
                        <button key={ch.id}
                          onClick={() => { setSelectedCat(ch.id); setMobileCatOpen(false); }}
                          className="flex items-center justify-between w-full pl-9 pr-5 py-2.5 text-left"
                          style={{ borderBottom: '1px solid #F8F8F8', color: selectedCat === ch.id ? '#FF6B35' : '#6B7280', fontWeight: selectedCat === ch.id ? 700 : 400, fontSize: 13 }}>
                          {ch.name}
                        </button>
                      ))}
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}

        {/* Header */}
        <header className="sticky top-0 z-40 bg-white"
          style={{ borderBottom: '1px solid #EBEBEB', boxShadow: '0 1px 6px rgba(0,0,0,0.05)' }}>
          <div className="flex items-center gap-1.5 sm:gap-3 px-2.5 sm:px-4 h-14 max-w-5xl mx-auto">
            <img src="/logo.webp" alt="Logo" className="flex-shrink-0" style={{ width: 32, height: 32, objectFit: 'contain' }} />
            <span className="hidden sm:inline font-bold text-gray-900 text-[15px] whitespace-nowrap flex-shrink-0">{t.storeName}</span>
            <span className="flex-shrink-0 px-1.5 py-0.5 rounded-md text-white text-[9px] font-bold whitespace-nowrap"
              style={{ background: '#2563EB' }}>
              TEST
            </span>

            {/* Mobile: category button */}
            <button
              onClick={() => setMobileCatOpen(true)}
              className="lg:hidden flex items-center gap-1 px-2 py-1.5 rounded-xl text-[11px] font-semibold ml-0.5 min-w-0"
              style={{ background: '#F5F5F5', color: selectedCat ? '#FF6B35' : '#666', border: selectedCat ? '1px solid rgba(255,107,53,0.3)' : '1px solid #E0E0E0' }}>
              <Menu size={12} className="flex-shrink-0" />
              <span className="max-w-[64px] truncate">{displayCatName}</span>
              <ChevronDown size={12} className="flex-shrink-0" />
            </button>

            <div className="flex-1" />

            {cartCount > 0 && (
              <button onClick={() => setView('cart')}
                className="relative flex items-center gap-1 px-2.5 py-1.5 rounded-xl font-bold text-[13px] text-white flex-shrink-0"
                style={{ background: 'linear-gradient(135deg,#FF6B35,#FF4500)' }}>
                <ShoppingCart size={15} className="flex-shrink-0" />
                <span>{cartCount > 99 ? '99+' : cartCount}</span>
              </button>
            )}
            {/* View toggle */}
            <button
              onClick={() => setDisplayMode(m => { const next = m === 'list' ? 'grid' : 'list'; localStorage.setItem('order-display-mode', next); return next; })}
              className="w-8 h-8 rounded-xl flex items-center justify-center border ml-1 flex-shrink-0"
              style={{ borderColor: '#E5E5E5', background: displayMode === 'grid' ? '#FFF0EB' : '#fff', color: displayMode === 'grid' ? '#FF6B35' : '#666' }}
              title={displayMode === 'list' ? 'Galereya ko\'rinish' : 'Ro\'yat ko\'rinish'}>
              {displayMode === 'list' ? <LayoutGrid size={15} /> : <LayoutList size={15} />}
            </button>

            <button onClick={() => setLang(l => l === 'uz' ? 'ru' : 'uz')}
              className="px-2 sm:px-2.5 py-1.5 rounded-xl text-[11px] font-bold border ml-1 flex-shrink-0"
              style={{ borderColor: '#E5E5E5', color: '#666' }}>
              {lang === 'uz' ? 'RU' : 'UZ'}
            </button>
          </div>

          {/* Search bar */}
          <div className="px-4 pb-2 max-w-5xl mx-auto">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder={t.search}
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-9 pr-9 py-2 rounded-xl text-[13px] font-medium outline-none"
                style={{ background: '#F5F5F5', border: '1px solid #EBEBEB' }}
              />
              {search && (
                <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2">
                  <X size={13} color="#999" />
                </button>
              )}
            </div>
            {/* Product count */}
            {!loading && !loadError && (
              <div className="mt-1.5 px-1 text-[12px]" style={{ color: '#9a9a9a' }}>
                {search || selectedCat ? (
                  <span>{filteredProducts.filter(p => p.stock > 0).length} {lang === 'uz' ? 'ta mavjud mahsulot topildi' : 'доступных товаров найдено'}</span>
                ) : (
                  <span>{lang === 'uz' ? `Mavjud: ${products.filter(p => p.stock > 0).length} xil mahsulot` : `Доступно: ${products.filter(p => p.stock > 0).length} наименований`}</span>
                )}
              </div>
            )}
          </div>
        </header>

        {/* Body: sidebar + product list */}
        <div className="max-w-5xl mx-auto flex">
          {/* Desktop sidebar */}
          <aside className="hidden lg:block w-56 flex-shrink-0 sticky top-[106px] self-start"
            style={{ height: 'calc(100vh - 106px)', overflowY: 'auto', padding: '8px 0 8px 8px' }}>
            {/* All products */}
            <button
              onClick={() => setSelectedCat(null)}
              className="flex items-center w-full px-3 py-2.5 text-left text-[13px] rounded-xl transition-all mb-0.5"
              style={{
                color: !selectedCat ? '#FF6B35' : '#555',
                fontWeight: !selectedCat ? 700 : 500,
                background: !selectedCat ? 'rgba(255,107,53,0.08)' : 'transparent',
              }}>
              {t.allCategories}
            </button>

            {/* TOP 50 mahsulotlar */}
            <button
              onClick={() => setSelectedCat(TOP50_CAT_ID)}
              className="flex items-center gap-1.5 w-full px-3 py-2.5 text-left text-[13px] rounded-xl transition-all mb-0.5"
              style={{
                color: selectedCat === TOP50_CAT_ID ? '#2563EB' : '#555',
                fontWeight: selectedCat === TOP50_CAT_ID ? 700 : 500,
                background: selectedCat === TOP50_CAT_ID ? 'rgba(37,99,235,0.08)' : 'transparent',
              }}>
              <Trophy size={13} />
              {t.top50Cat}
            </button>

            {categories.map(c => {
              const isParentActive = selectedCat === c.id;
              const isChildActive = c.children.some(ch => ch.id === selectedCat);
              const isExpanded = isParentActive || isChildActive;
              return (
                <div key={c.id}>
                  <button
                    onClick={() => setSelectedCat(c.id)}
                    className="flex items-center w-full px-3 py-2.5 text-left text-[13px] rounded-xl transition-all mb-0.5"
                    style={{
                      color: isParentActive ? '#FF6B35' : isChildActive ? '#FF8C5A' : '#555',
                      fontWeight: isParentActive || isChildActive ? 700 : 500,
                      background: isParentActive ? 'rgba(255,107,53,0.08)' : 'transparent',
                    }}>
                    {c.children.length > 0 && (
                      <ChevronRight size={12}
                        style={{
                          marginRight: 4, flexShrink: 0,
                          transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)',
                          transition: 'transform 0.15s',
                          color: isParentActive || isChildActive ? '#FF6B35' : '#aaa',
                        }} />
                    )}
                    {c.name}
                  </button>
                  {/* Subcategories - show when parent is active or a child is selected */}
                  {isExpanded && c.children.map(ch => {
                    const childActive = selectedCat === ch.id;
                    return (
                      <button key={ch.id}
                        onClick={() => setSelectedCat(ch.id)}
                        className="flex items-center w-full pl-7 pr-3 py-2 text-left text-[12px] rounded-xl transition-all mb-0.5"
                        style={{
                          color: childActive ? '#FF6B35' : '#777',
                          fontWeight: childActive ? 700 : 400,
                          background: childActive ? 'rgba(255,107,53,0.08)' : 'transparent',
                        }}>
                        {ch.name}
                      </button>
                    );
                  })}
                </div>
              );
            })}
          </aside>

          {/* Product list / grid */}
          <div className="flex-1 min-w-0 min-h-0 pb-32">

            {/* Category title */}
            {selectedCat && (
              <div className="px-4 py-3 bg-white lg:mx-4 lg:mt-3 lg:rounded-t-2xl" style={{ borderBottom: '1px solid #F0F0F0' }}>
                <h2 className="text-[14px] font-bold text-gray-900">{displayCatName}</h2>
              </div>
            )}

            {loading && (
              <div className="flex flex-col items-center justify-center py-24 gap-3">
                <div className="w-10 h-10 rounded-full border-t-transparent animate-spin"
                  style={{ borderWidth: 3, borderStyle: 'solid', borderColor: '#FF6B35 transparent transparent transparent' }} />
                <p className="text-[13px] text-gray-400">{t.loading}</p>
              </div>
            )}

            {loadError && (
              <div className="flex flex-col items-center py-16 gap-4 px-6">
                <p className="text-[13px] text-red-500 text-center">{t.loadError}: {loadError}</p>
                <button onClick={() => loadCatalog(selectedPriceType?.id)}
                  className="px-5 py-2.5 rounded-xl text-[13px] font-bold text-white"
                  style={{ background: 'linear-gradient(135deg,#FF6B35,#FF4500)' }}>
                  {t.retry}
                </button>
              </div>
            )}

            {!loading && !loadError && filteredProducts.length === 0 && (
              <div className="flex flex-col items-center py-20 gap-3">
                <Package size={40} color="#D1D5DB" />
                <p className="text-[13px] text-gray-400">{t.noProducts}</p>
              </div>
            )}

            {/* LIST MODE */}
            {!loading && !loadError && displayMode === 'list' && (
              <div className="bg-white lg:mx-4 lg:mb-3 lg:rounded-b-2xl overflow-hidden"
                style={{ borderTop: selectedCat ? 'none' : '1px solid #F0F0F0' }}>
                {visibleProducts.map(p => (
                  <ProductRow
                    key={p.id}
                    product={p}
                    cartQty={cart[p.id]?.quantity || 0}
                    onAdd={() => addToCart(p)}
                    onQtyChange={qty => setQty(p.id, qty)}
                    onImageClick={() => setLightboxProduct(p)}
                    lang={lang}
                    isTop50={top50DisplaySet.has(p.id)}
                    isNewArrival={isNewArrivalProduct(p)}
                  />
                ))}
              </div>
            )}

            {/* GRID MODE */}
            {!loading && !loadError && displayMode === 'grid' && (
              <div className="px-3 lg:px-4 pt-3 lg:mx-4 lg:mb-3">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                  {visibleProducts.map(p => (
                    <ProductCard
                      key={p.id}
                      product={p}
                      cartQty={cart[p.id]?.quantity || 0}
                      onAdd={() => addToCart(p)}
                      onQtyChange={qty => setQty(p.id, qty)}
                      onImageClick={() => setLightboxProduct(p)}
                      lang={lang}
                      isTop50={top50DisplaySet.has(p.id)}
                      isNewArrival={isNewArrivalProduct(p)}
                    />
                  ))}
                </div>
              </div>
            )}

            {!loading && !loadError && visibleProducts.length < filteredProducts.length && (
              <div className="px-4 py-5 flex justify-center">
                <button
                  onClick={() => setVisibleCount(c => c + PRODUCT_LIMIT_STEP)}
                  className="px-5 py-2.5 rounded-xl text-[13px] font-bold"
                  style={{ background: '#FFF0EB', color: '#FF6B35', border: '1px solid #FFD5C5' }}>
                  {t.showMore} ({visibleProducts.length}/{filteredProducts.length})
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Sticky cart bar */}
        {cartCount > 0 && (
          <div className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-4 pt-2"
            style={{ background: 'linear-gradient(to top, white 60%, transparent)' }}>
            <button
              onClick={() => setView('cart')}
              className="w-full max-w-5xl mx-auto flex items-center justify-between px-5 py-3.5 rounded-2xl text-white font-bold text-[14px]"
              style={{ background: 'linear-gradient(135deg,#FF6B35,#FF4500)', boxShadow: '0 8px 24px rgba(255,107,53,0.4)', display: 'flex' }}>
              <div className="flex items-center gap-2">
                <ShoppingCart size={17} />
                <span>{cartCount} {t.items}</span>
              </div>
              <div className="flex items-center gap-1">
                <span>{fmtPrice(cartTotal)}</span>
                <span className="text-[11px] opacity-80">{t.sum}</span>
                <ChevronRight size={16} />
              </div>
            </button>
          </div>
        )}
      </div>
    );
  }

  // ─── CART VIEW ────────────────────────────────────────────────────────────

  if (view === 'cart') {
    return (
      <div className="min-h-screen bg-white">
        <header className="sticky top-0 z-40 bg-white"
          style={{ borderBottom: '1px solid #EBEBEB', boxShadow: '0 1px 6px rgba(0,0,0,0.05)' }}>
          <div className="flex items-center gap-3 px-4 h-14 max-w-2xl mx-auto">
            <button onClick={() => setView('catalog')}
              className="w-8 h-8 flex items-center justify-center rounded-full"
              style={{ background: '#F5F5F5' }}>
              <ChevronLeft size={18} color="#333" />
            </button>
            <span className="font-bold text-gray-900 text-[15px] flex-1">{t.cart}</span>
            <button onClick={() => setLang(l => l === 'uz' ? 'ru' : 'uz')}
              className="px-2.5 py-1.5 rounded-xl text-[11px] font-bold border"
              style={{ borderColor: '#E5E5E5', color: '#666' }}>
              {lang === 'uz' ? 'RU' : 'UZ'}
            </button>
          </div>
        </header>

        <div className="max-w-2xl mx-auto px-4 py-4">
          {cartItems.length === 0 ? (
            <div className="flex flex-col items-center py-20 gap-4">
              <ShoppingCart size={48} color="#D1D5DB" />
              <p className="text-[15px] font-bold text-gray-700">{t.cartEmpty}</p>
              <p className="text-[13px] text-gray-400">{t.cartEmptySub}</p>
              <button onClick={() => setView('catalog')}
                className="mt-2 px-6 py-3 rounded-2xl text-[14px] font-bold text-white"
                style={{ background: 'linear-gradient(135deg,#FF6B35,#FF4500)' }}>
                {t.backToCatalog}
              </button>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-4">
                <span className="text-[13px] text-gray-500 font-medium">{cartCount} {t.items}</span>
                <button onClick={() => setCart({})} className="text-[12px] font-semibold text-red-400 flex items-center gap-1">
                  <Trash2 size={13} />
                  {t.clearCart}
                </button>
              </div>

              <div className="rounded-2xl overflow-hidden mb-6"
                style={{ border: '1px solid #F0F0F0' }}>
                {cartItems.map(({ product: p, quantity }) => (
                  <div key={p.id} className="flex items-center gap-3 px-4 py-3"
                    style={{ borderBottom: '1px solid #F8F8F8' }}>
                    <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0"
                      style={{ background: '#F5F5F5' }}>
                      {p.imageHref ? (
                        <img src={`/api/order/image?href=${encodeURIComponent(p.imageHref)}`}
                          alt={p.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package size={18} color="#D1D5DB" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[12px] font-semibold text-gray-800 leading-snug"
                        style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' } as any}>
                        {p.name}
                      </p>
                      {p.price > 0 && (
                        <p className="text-[12px] font-bold text-orange-500 mt-0.5">
                          {fmtPrice(p.price * quantity)} <span className="text-[10px] font-normal text-gray-400">{t.sum}</span>
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      <button onClick={() => setQty(p.id, quantity - 1)}
                        className="w-7 h-7 rounded-lg flex items-center justify-center"
                        style={{ background: '#FFF0EB', border: '1px solid #FFD5C5' }}>
                        {quantity === 1 ? <Trash2 size={11} color="#FF6B35" /> : <Minus size={11} color="#FF6B35" />}
                      </button>
                      <span className="w-5 text-center text-[13px] font-bold text-gray-900">{quantity}</span>
                      <button onClick={() => setQty(p.id, quantity + 1)}
                        className="w-7 h-7 rounded-lg flex items-center justify-center"
                        style={{ background: 'linear-gradient(135deg,#FF6B35,#FF4500)' }}>
                        <Plus size={11} color="#fff" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {cartTotal > 0 && (
                <div className="rounded-2xl p-4 mb-4"
                  style={{ background: '#FFF8F5', border: '1px solid #FFE5D9' }}>
                  <div className="flex items-center justify-between">
                    <span className="text-[14px] font-semibold text-gray-700">{t.total}</span>
                    <span className="text-[18px] font-bold text-orange-500">
                      {fmtPrice(cartTotal)} <span className="text-[12px] text-gray-400 font-normal">{t.sum}</span>
                    </span>
                  </div>
                </div>
              )}

              {/* Bepul yetkazib berish holati */}
              <div className="rounded-2xl p-3.5 mb-6 flex items-center gap-3"
                style={{
                  background: cartTotal >= FREE_DELIVERY_THRESHOLD ? '#F0FBF3' : '#F5F8FF',
                  border: `1px solid ${cartTotal >= FREE_DELIVERY_THRESHOLD ? '#CDEFD8' : '#DCE7FF'}`,
                }}>
                <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ background: cartTotal >= FREE_DELIVERY_THRESHOLD ? 'rgba(61,184,81,0.15)' : 'rgba(37,99,235,0.12)' }}>
                  <Truck size={17} color={cartTotal >= FREE_DELIVERY_THRESHOLD ? '#3DB851' : '#2563EB'} />
                </div>
                <p className="text-[12.5px] font-medium leading-snug" style={{ color: '#374151' }}>
                  {cartTotal >= FREE_DELIVERY_THRESHOLD
                    ? t.freeDeliveryDone
                    : <>{t.freeDeliveryNeed} <b style={{ color: '#2563EB' }}>{fmtPrice(FREE_DELIVERY_THRESHOLD - cartTotal)} {t.sum}</b> {t.freeDeliveryNeedEnd}</>}
                </p>
              </div>

              <button onClick={() => { if (cartTotal < FREE_DELIVERY_THRESHOLD) setShowDeliveryConfirm(true); else setView('checkout'); }}
                className="w-full py-4 rounded-2xl text-[15px] font-bold text-white"
                style={{ background: 'linear-gradient(135deg,#FF6B35,#FF4500)', boxShadow: '0 8px 24px rgba(255,107,53,0.35)' }}>
                {t.orderBtn}
              </button>
            </>
          )}
        </div>

        {/* Bepul yetkazib berish chegarasiga yetmasa tasdiqlash oynasi */}
        {showDeliveryConfirm && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-5"
            style={{ background: 'rgba(10,10,10,0.5)' }}
            onClick={() => setShowDeliveryConfirm(false)}>
            <div className="w-full max-w-sm rounded-3xl bg-white p-6" onClick={e => e.stopPropagation()}
              style={{ boxShadow: '0 30px 60px -20px rgba(10,10,10,0.35)' }}>
              <div className="w-12 h-12 rounded-full flex items-center justify-center mb-4"
                style={{ background: 'rgba(37,99,235,0.12)' }}>
                <Truck size={22} color="#2563EB" />
              </div>
              <h3 className="text-[17px] font-extrabold mb-2" style={{ color: '#0a0a0a' }}>
                {t.freeDeliveryConfirmTitle}
              </h3>
              <p className="text-[13.5px] leading-relaxed mb-6" style={{ color: '#7c7c80' }}>
                {t.freeDeliveryConfirmMsg}
              </p>
              <div className="flex flex-col gap-2.5">
                <button onClick={() => { setShowDeliveryConfirm(false); setView('catalog'); }}
                  className="w-full py-3.5 rounded-xl text-[14px] font-bold text-white transition-transform active:scale-[0.98]"
                  style={{ background: '#2563EB' }}>
                  {t.addMoreBtn}
                </button>
                <button onClick={() => { setShowDeliveryConfirm(false); setView('checkout'); }}
                  className="w-full py-3.5 rounded-xl text-[14px] font-bold transition-transform active:scale-[0.98]"
                  style={{ background: '#F5F5F5', color: '#374151' }}>
                  {t.continueAnywayBtn}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ─── CHECKOUT VIEW ────────────────────────────────────────────────────────

  if (view === 'checkout') {
    return (
      <div className="min-h-screen bg-white">
        <header className="sticky top-0 z-40 bg-white"
          style={{ borderBottom: '1px solid #EBEBEB', boxShadow: '0 1px 6px rgba(0,0,0,0.05)' }}>
          <div className="flex items-center gap-3 px-4 h-14 max-w-2xl mx-auto">
            <button onClick={() => setView('cart')}
              className="w-8 h-8 flex items-center justify-center rounded-full"
              style={{ background: '#F5F5F5' }}>
              <ChevronLeft size={18} color="#333" />
            </button>
            <span className="font-bold text-gray-900 text-[15px] flex-1">{t.checkout}</span>
            <button onClick={() => setLang(l => l === 'uz' ? 'ru' : 'uz')}
              className="px-2.5 py-1.5 rounded-xl text-[11px] font-bold border"
              style={{ borderColor: '#E5E5E5', color: '#666' }}>
              {lang === 'uz' ? 'RU' : 'UZ'}
            </button>
          </div>
        </header>

        <div className="max-w-2xl mx-auto px-4 py-6 pb-10">
          <div className="space-y-3 mb-6">
            <div>
              <div className="relative">
                <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="text" placeholder={t.namePlaceholder} value={formName}
                  onChange={e => { setFormName(e.target.value); setFormErrors(p => ({ ...p, name: '' })); }}
                  className="w-full pl-10 pr-4 py-3.5 rounded-2xl text-[14px] font-medium outline-none"
                  style={{ border: `2px solid ${formErrors.name ? '#EF4444' : '#F0F0F0'}`, background: '#FAFAFA' }} />
              </div>
              {formErrors.name && <p className="mt-1 ml-1 text-[11px] text-red-500 font-medium">{formErrors.name}</p>}
            </div>
            <div className="relative">
              <Building2 size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="text" placeholder={t.companyPlaceholder} value={formCompany}
                onChange={e => setFormCompany(e.target.value)}
                className="w-full pl-10 pr-4 py-3.5 rounded-2xl text-[14px] font-medium outline-none"
                style={{ border: '2px solid #F0F0F0', background: '#FAFAFA' }} />
            </div>
            <div>
              <div className="relative">
                <Phone size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="tel" placeholder={t.phonePlaceholder} value={formPhone}
                  onChange={e => { setFormPhone(e.target.value); setFormErrors(p => ({ ...p, phone: '' })); }}
                  className="w-full pl-10 pr-4 py-3.5 rounded-2xl text-[14px] font-medium outline-none"
                  style={{ border: `2px solid ${formErrors.phone ? '#EF4444' : '#F0F0F0'}`, background: '#FAFAFA' }} />
              </div>
              {formErrors.phone && <p className="mt-1 ml-1 text-[11px] text-red-500 font-medium">{formErrors.phone}</p>}
            </div>
          </div>

          <button onClick={() => setSummaryOpen(o => !o)}
            className="w-full flex items-center justify-between py-3.5 px-4 rounded-2xl mb-2"
            style={{ background: '#F5F5F5', border: '1px solid #EBEBEB' }}>
            <span className="text-[13px] font-bold text-gray-700">{t.orderSummary}</span>
            <div className="flex items-center gap-2">
              {cartTotal > 0 && (
                <span className="text-[13px] font-bold text-orange-500">{fmtPrice(cartTotal)} {t.sum}</span>
              )}
              {summaryOpen ? <ChevronUp size={15} color="#999" /> : <ChevronDown size={15} color="#999" />}
            </div>
          </button>

          {summaryOpen && (
            <div className="rounded-2xl overflow-hidden mb-4" style={{ border: '1px solid #F0F0F0' }}>
              {cartItems.map(({ product: p, quantity }) => (
                <div key={p.id} className="flex items-center justify-between px-4 py-3"
                  style={{ borderBottom: '1px solid #F8F8F8' }}>
                  <div className="min-w-0 flex-1 mr-3">
                    <p className="text-[12px] font-medium text-gray-700 leading-snug">{p.name}</p>
                    {p.price > 0 && (
                      <p className="text-[11px] text-gray-400 mt-0.5">{quantity} × {fmtPrice(p.price)} {t.sum}</p>
                    )}
                  </div>
                  {p.price > 0 && (
                    <p className="text-[13px] font-bold text-gray-900 flex-shrink-0">{fmtPrice(p.price * quantity)}</p>
                  )}
                </div>
              ))}
              {cartTotal > 0 && (
                <div className="flex items-center justify-between px-4 py-3 font-bold"
                  style={{ background: '#FFF8F5' }}>
                  <span className="text-[13px] text-gray-700">{t.total}</span>
                  <span className="text-[15px] text-orange-500">{fmtPrice(cartTotal)} {t.sum}</span>
                </div>
              )}
            </div>
          )}

          {formErrors.submit && (
            <div className="mb-4 p-3 rounded-xl text-[12px] text-red-600 font-medium"
              style={{ background: '#FEF2F2', border: '1px solid #FEE2E2' }}>
              {formErrors.submit}
            </div>
          )}

          <button onClick={handleSubmit} disabled={submitting}
            className="w-full py-4 rounded-2xl text-[15px] font-bold text-white mt-2"
            style={{
              background: submitting ? '#FFA984' : 'linear-gradient(135deg,#FF6B35,#FF4500)',
              boxShadow: '0 8px 24px rgba(255,107,53,0.35)',
            }}>
            {submitting ? t.sending : t.submitBtn}
          </button>
        </div>
      </div>
    );
  }

  // ─── SUCCESS VIEW ─────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6">
      <div className="text-center max-w-sm">
        <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
          style={{ background: 'rgba(16,185,129,0.1)', border: '2px solid rgba(16,185,129,0.2)' }}>
          <CheckCircle size={40} color="#10B981" />
        </div>
        <h2 className="text-[22px] font-bold text-gray-900 mb-2">{t.successTitle}</h2>
        <p className="text-[14px] text-gray-500 mb-4">{t.successMsg}</p>
        {successOrderName && (
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl mb-8"
            style={{ background: 'rgba(255,107,53,0.08)', border: '1px solid rgba(255,107,53,0.15)' }}>
            <span className="text-[12px] text-gray-500">{t.orderNumber}:</span>
            <span className="text-[13px] font-bold text-orange-500">{successOrderName}</span>
          </div>
        )}
        <button onClick={() => setView('catalog')}
          className="w-full py-4 rounded-2xl text-[15px] font-bold text-white"
          style={{ background: 'linear-gradient(135deg,#FF6B35,#FF4500)', boxShadow: '0 8px 24px rgba(255,107,53,0.35)' }}>
          {t.newOrder}
        </button>
      </div>
    </div>
  );
}
