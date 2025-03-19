const { dir: SOCIAL_IMAGES_PATH = '/images/social/default/', format: SOCIAL_IMAGES_FORMAT = 'svg' } = window.settings?.images?.social || {};
const { dir: UI_IMAGES_PATH = '/images/ui/default/', format: UI_IMAGES_FORMAT = 'svg' } = window.settings?.images?.ui || {};
const { dir: BONUSES_IMAGES_PATH = '/images/bonuses/default/', format: BONUSES_IMAGES_FORMAT = 'webp' } = window.settings?.images?.bonuses || {};
const { dir: TAGS_IMAGES_PATH = '/images/tags/white/', format: TAGS_IMAGES_FORMAT = 'webp' } = window.settings?.images?.tags || {};
const { dir: PROVIDERS_IMAGES_PATH = '/images/providers/menu/white/', format: PROVIDERS_IMAGES_FORMAT = 'webp' } = window.settings?.images?.providersMenu || {};
const { dir: PROVIDERS_ICONS_PATH = '/images/providers/menu/white/', format: PROVIDERS_ICONS_FORMAT = 'webp' } = window.settings?.images?.providersIcons || {};
const { dir: JACKPOTS_IMAGES_PATH = '/images/jackpots/lobby/default/', format: JACKPOTS_IMAGES_FORMAT = 'webp' } = window.settings?.images?.jackpotsLobby || {};
const { dir: JACKPOTS_WIN_IMAGES_PATH = '/images/jackpots/win/default/', format: JACKPOTS_WIN_IMAGES_FORMAT = 'webp' } = window.settings?.images?.jackpotsWin || {};
const { dir: PAYMENTS_IMAGES_PATH = '/images/payments/default/', format: PAYMENTS_IMAGES_FORMAT = 'svg' } = window.settings?.images?.payments || {};
const { dir: CURRENCY_IMAGES_PATH = '/images/currency/circle_white/', format: CURRENCY_IMAGES_FORMAT = 'svg' } = window.settings?.images?.currency || {};
const { dir: LANGUAGES_IMAGES_PATH = '/images/languages/default/', format: LANGUAGES_IMAGES_FORMAT = 'webp' } = window.settings?.images?.languages || {};
const { dir: WHEEL_IMAGES_PATH = '/images/wheel/default/', format: WHEEL_IMAGES_FORMAT = 'webp' } = window.settings?.images?.wheel || {};
const { dir: MISC_IMAGES_PATH = '/images/misc/default/' } = window.settings?.images?.misc || {};
const { dir: LOGOTYPE_IMAGES_PATH = '/images/logotypes/default/' } = window.settings?.images?.logotypes || {};

export {
  SOCIAL_IMAGES_PATH,
  SOCIAL_IMAGES_FORMAT,
  UI_IMAGES_PATH,
  UI_IMAGES_FORMAT,
  BONUSES_IMAGES_PATH,
  BONUSES_IMAGES_FORMAT,
  TAGS_IMAGES_PATH,
  TAGS_IMAGES_FORMAT,
  PROVIDERS_IMAGES_PATH,
  PROVIDERS_IMAGES_FORMAT,
  PROVIDERS_ICONS_PATH,
  PROVIDERS_ICONS_FORMAT,
  JACKPOTS_IMAGES_PATH,
  JACKPOTS_IMAGES_FORMAT,
  JACKPOTS_WIN_IMAGES_PATH,
  JACKPOTS_WIN_IMAGES_FORMAT,
  PAYMENTS_IMAGES_PATH,
  PAYMENTS_IMAGES_FORMAT,
  CURRENCY_IMAGES_PATH,
  CURRENCY_IMAGES_FORMAT,
  LANGUAGES_IMAGES_PATH,
  LANGUAGES_IMAGES_FORMAT,
  MISC_IMAGES_PATH,
  LOGOTYPE_IMAGES_PATH,
  WHEEL_IMAGES_PATH,
  WHEEL_IMAGES_FORMAT,
};
