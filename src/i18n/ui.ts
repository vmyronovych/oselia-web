// UI strings + locale helpers. Content (products/docs) is translated in
// src/content/<collection>/<lang>/…; this file covers the chrome around it.

export const languages = {
  en: 'English',
  uk: 'Українська',
} as const;

export type Lang = keyof typeof languages;
export const defaultLang: Lang = 'en';

export const ui = {
  en: {
    'nav.hearth': 'Hearth DI16-G',
    'nav.ember': 'Ember DI-16X',
    'nav.gettingStarted': 'Getting Started',
    'nav.github': 'GitHub',

    'home.eyebrow': 'DIN-rail smart-home modules',
    'home.title': 'Turn ordinary wall switches into a robust, local smart home.',
    'home.lead':
      'OSELIA wires your 24 V switches back to compact DIN-rail modules, classifies every press, and publishes it to Home Assistant over MQTT — no cloud, no DNS, deterministic timing.',
    'home.cta.start': 'Get started →',
    'home.cta.hardware': 'Explore the hardware',
    'home.modules.title': 'The modules',
    'home.modules.sub': 'A gateway and its expander. Snap them onto the rail.',
    'home.why.title': 'Why OSELIA',
    'home.why.sub': 'Built for installs that have to keep working.',
    'home.final.title': 'Ready to bring one online?',
    'home.final.body':
      'Plug in USB, run one command, answer a few prompts. The provisioning wizard configures the gateway and wires up Home Assistant for you.',
    'home.final.cta': 'Read the guide →',

    'role.gateway': 'gateway',
    'role.expander': 'expander',

    'product.back': '← All modules',
    'product.cta': 'Get started →',
    'product.specs': 'Specifications',
    'product.highlights': 'Highlights',

    'footer.tagline': 'OSELIA — a local-first, wired smart-home system.',
    'footer.docs': 'Docs',
    'footer.firmware': 'Firmware',
    'footer.ha': 'HA Integration',
    'footer.cms': 'Edit (CMS)',

    '404.eyebrow': '404',
    '404.title': 'This page went cold.',
    '404.lead': "The page you're after doesn't exist.",
    '404.home': 'Back home',

    'lang.label': 'Language',
  },
  uk: {
    'nav.hearth': 'Hearth DI16-G',
    'nav.ember': 'Ember DI-16X',
    'nav.gettingStarted': 'Початок роботи',
    'nav.github': 'GitHub',

    'home.eyebrow': 'Модулі розумного дому на DIN-рейку',
    'home.title': 'Перетворіть звичайні настінні вимикачі на надійний локальний розумний дім.',
    'home.lead':
      'OSELIA заводить ваші вимикачі 24 В на компактні DIN-модулі, класифікує кожне натискання й публікує його в Home Assistant через MQTT — без хмари, без DNS, з детермінованим таймінгом.',
    'home.cta.start': 'Почати →',
    'home.cta.hardware': 'Переглянути обладнання',
    'home.modules.title': 'Модулі',
    'home.modules.sub': 'Шлюз і його розширювач. Клацніть на рейку.',
    'home.why.title': 'Чому OSELIA',
    'home.why.sub': 'Створено для інсталяцій, які мусять працювати завжди.',
    'home.final.title': 'Готові запустити модуль?',
    'home.final.body':
      'Під’єднайте USB, запустіть одну команду, дайте відповідь на кілька запитань. Майстер провіженінгу налаштує шлюз і підключить Home Assistant за вас.',
    'home.final.cta': 'Читати посібник →',

    'role.gateway': 'шлюз',
    'role.expander': 'розширювач',

    'product.back': '← Усі модулі',
    'product.cta': 'Почати →',
    'product.specs': 'Характеристики',
    'product.highlights': 'Ключові переваги',

    'footer.tagline': 'OSELIA — локальна дротова система розумного дому.',
    'footer.docs': 'Документація',
    'footer.firmware': 'Прошивка',
    'footer.ha': 'Інтеграція HA',
    'footer.cms': 'Редагувати (CMS)',

    '404.eyebrow': '404',
    '404.title': 'Ця сторінка охолола.',
    '404.lead': 'Сторінки, яку ви шукаєте, не існує.',
    '404.home': 'На головну',

    'lang.label': 'Мова',
  },
} as const;

export type UIKey = keyof (typeof ui)['en'];

/** Returns a translator bound to a language, falling back to English. */
export function useTranslations(lang: Lang) {
  return function t(key: UIKey): string {
    return ui[lang]?.[key] ?? ui[defaultLang][key];
  };
}

// ── Home page data (localized) ───────────────────────────────────────────────
export const pillars: Record<Lang, { title: string; body: string }[]> = {
  en: [
    { title: 'Local-first, no cloud', body: 'Presses go straight to your MQTT broker on the LAN. No accounts, no DNS dependency, deterministic timing.' },
    { title: 'Native Home Assistant', body: 'A first-party OSELIA integration — event entities, device triggers, diagnostics, controls and OTA updates.' },
    { title: 'Industrial reliability', body: 'Opto-isolated 24 V inputs, hardware debounce, watchdog, auto-reconnect, and verified over-the-air firmware.' },
    { title: 'Scales on the rail', body: 'One Hearth gateway plus up to seven Ember expanders — 128 isolated inputs on a single MQTT device.' },
  ],
  uk: [
    { title: 'Локально, без хмари', body: 'Натискання йдуть напряму до MQTT-брокера в локальній мережі. Без акаунтів, без залежності від DNS, з детермінованим таймінгом.' },
    { title: 'Рідний Home Assistant', body: 'Власна інтеграція OSELIA — сутності подій, тригери пристрою, діагностика, керування й OTA-оновлення.' },
    { title: 'Промислова надійність', body: 'Оптоізольовані входи 24 В, апаратний антидребезг, вотчдог, автоперепідключення та перевірена прошивка по повітрю.' },
    { title: 'Масштабується на рейці', body: 'Один шлюз Hearth плюс до семи розширювачів Ember — 128 ізольованих входів на одному MQTT-пристрої.' },
  ],
};
