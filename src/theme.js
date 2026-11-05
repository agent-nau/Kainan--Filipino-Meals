// App name and shared visual theme.
export const APP_NAME = 'Kainan';

const palettes = {
  dark: {
    bg: '#171512',
    card: '#24211D',
    primary: '#64503d',
    primaryDark: '#E8CCB2',
    accent: '#E8C878',
    text: '#F4EEE7',
    muted: '#B5AA9F',
    border: '#494139',
    green: '#91c966',
    greenBg: '#3d6431',
    red: '#8c4f48',
    chip: '#34302B',
    input: '#24211D',
    selected: '#57493d',
    onPrimary: '#211B16',
    mode: 'dark',
  },
};

export const colors = { ...palettes.dark };

export function setColorScheme(mode) {
  const palette = mode === 'dark' ? palettes.dark : palettes.light;
  Object.assign(colors, palette);
}

export const getColorScheme = () => colors.mode;

export const shadow = {
  shadowColor: '#000',
  shadowOpacity: 0.06,
  shadowRadius: 8,
  shadowOffset: { width: 0, height: 2 },
  elevation: 2,
};

const MONEY_FORMATS = {
  philippines: ['en-PH', 'PHP'],
  uae: ['en-AE', 'AED'],
  'saudi-arabia': ['en-SA', 'SAR'],
  qatar: ['en-QA', 'QAR'],
  kuwait: ['en-KW', 'KWD'],
  singapore: ['en-SG', 'SGD'],
  'hong-kong': ['en-HK', 'HKD'],
  taiwan: ['zh-TW', 'TWD'],
  japan: ['ja-JP', 'JPY'],
  'south-korea': ['ko-KR', 'KRW'],
  italy: ['en-IE', 'EUR'],
  uk: ['en-GB', 'GBP'],
  canada: ['en-CA', 'CAD'],
  us: ['en-US', 'USD'],
  australia: ['en-AU', 'AUD'],
  'new-zealand': ['en-NZ', 'NZD'],
};

export const formatMoney = (amount, market = 'philippines', currencyOverride = null) => {
  const [locale, defaultCurrency] = MONEY_FORMATS[market] || MONEY_FORMATS.philippines;
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currencyOverride || defaultCurrency,
    maximumFractionDigits: 0,
  }).format(Math.round(amount || 0));
};
