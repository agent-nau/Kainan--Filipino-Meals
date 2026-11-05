import { MEALS } from './data/meals';
import { ING } from './data/ingredients';

export const SLOTS = ['breakfast', 'lunch', 'dinner'];
export const SLOT_LABEL = { breakfast: 'Almusal', lunch: 'Tanghalian', dinner: 'Hapunan', merienda: 'Merienda' };
export const SLOT_SHARE = { breakfast: 0.25, lunch: 0.35, dinner: 0.4, merienda: 0.1 };
export const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export const DIETS = [
  { id: 'everything', label: 'Kain lahat', exclude: [], note: '' },
  { id: 'nopork', label: 'No pork', exclude: ['pork'], note: 'Skips pork and pork-derived ingredients.' },
  { id: 'halal', label: 'Halal-friendly', exclude: ['pork', 'alcohol'], note: 'No pork or alcohol-based ingredients. Check labels; this is not halal certification.' },
  { id: 'pesc', label: 'Pescatarian', exclude: ['pork', 'beef', 'chicken'], note: 'Fish, seafood, eggs and veggies only.' },
  { id: 'veg', label: 'Vegetarian', exclude: ['pork', 'beef', 'chicken', 'fish', 'shellfish'], note: 'Eggs allowed, no meat, fish or bagoong. Fewer recipes for now.' },
];

export const ALLERGENS = [
  { id: 'egg', label: 'Egg' },
  { id: 'dairy', label: 'Dairy' },
  { id: 'peanut', label: 'Peanuts' },
  { id: 'shellfish', label: 'Shellfish / bagoong' },
  { id: 'fish', label: 'Fish' },
  { id: 'seafood', label: 'Seafood allergy' },
];

// Currency conversion and store multipliers are rough planning estimates, not live prices.
export const MARKETS = [
  { id: 'philippines', label: 'Philippines', currency: 'PHP', locale: 'en-PH', budget: 3500, store: 'puregold', priceFactor: 1 },
  { id: 'uae', label: 'United Arab Emirates', currency: 'AED', locale: 'en-AE', budget: 250, store: 'lulu', priceFactor: 0.067 },
  { id: 'saudi-arabia', label: 'Saudi Arabia', currency: 'SAR', locale: 'en-SA', budget: 250, store: 'lulu', priceFactor: 0.069 },
  { id: 'qatar', label: 'Qatar', currency: 'QAR', locale: 'en-QA', budget: 250, store: 'lulu', priceFactor: 0.067 },
  { id: 'kuwait', label: 'Kuwait', currency: 'KWD', locale: 'en-KW', budget: 20, store: 'lulu', priceFactor: 0.0055 },
  { id: 'singapore', label: 'Singapore', currency: 'SGD', locale: 'en-SG', budget: 100, store: 'local-supermarket', priceFactor: 0.023 },
  { id: 'hong-kong', label: 'Hong Kong', currency: 'HKD', locale: 'en-HK', budget: 600, store: 'local-supermarket', priceFactor: 0.14 },
  { id: 'taiwan', label: 'Taiwan', currency: 'TWD', locale: 'zh-TW', budget: 2000, store: 'local-supermarket', priceFactor: 0.55 },
  { id: 'japan', label: 'Japan', currency: 'JPY', locale: 'ja-JP', budget: 10000, store: 'local-supermarket', priceFactor: 2.7 },
  { id: 'south-korea', label: 'South Korea', currency: 'KRW', locale: 'ko-KR', budget: 100000, store: 'local-supermarket', priceFactor: 44 },
  { id: 'italy', label: 'Italy', currency: 'EUR', locale: 'en-IE', budget: 70, store: 'local-supermarket', priceFactor: 0.016 },
  { id: 'uk', label: 'United Kingdom', currency: 'GBP', locale: 'en-GB', budget: 55, store: 'tesco', priceFactor: 0.03 },
  { id: 'canada', label: 'Canada', currency: 'CAD', locale: 'en-CA', budget: 100, store: 'local-supermarket', priceFactor: 0.025 },
  { id: 'us', label: 'United States', currency: 'USD', locale: 'en-US', budget: 80, store: 'local-supermarket', priceFactor: 0.018 },
  { id: 'australia', label: 'Australia', currency: 'AUD', locale: 'en-AU', budget: 100, store: 'local-supermarket', priceFactor: 0.028 },
  { id: 'new-zealand', label: 'New Zealand', currency: 'NZD', locale: 'en-NZ', budget: 110, store: 'local-supermarket', priceFactor: 0.03 },
];

export const STORES_BY_MARKET = {
  philippines: [
    { id: 'puregold', label: 'Puregold', mult: 1.0, note: 'Budget-friendly baseline' },
    { id: 'savemore', label: 'Savemore', mult: 1.0, note: '' },
    { id: 'sm', label: 'SM Supermarket', mult: 1.04, note: '' },
    { id: 'waltermart', label: 'WalterMart', mult: 1.02, note: '' },
    { id: 'robinsons', label: 'Robinsons Supermarket', mult: 1.06, note: '' },
    { id: 'metro', label: 'Metro Supermarket', mult: 1.08, note: '' },
    { id: 'landers', label: 'Landers (bulk)', mult: 0.95, note: 'Bulk packs, membership needed' },
    { id: 'snr', label: 'S&R', mult: 1.12, note: 'Premium cuts' },
    { id: 'palengke', label: 'Palengke (wet market)', mult: 0.9, note: 'Fresh meat, fish and veggies' },
  ],
  uk: [
    { id: 'tesco', label: 'Tesco', mult: 1.0, note: 'Baseline estimate' },
    { id: 'asda', label: 'Asda', mult: 0.97, note: '' },
    { id: 'aldi', label: 'Aldi', mult: 0.86, note: 'Discount supermarket estimate' },
    { id: 'lidl', label: 'Lidl', mult: 0.88, note: 'Discount supermarket estimate' },
    { id: 'sainsburys', label: "Sainsbury's", mult: 1.05, note: '' },
    { id: 'morrisons', label: 'Morrisons', mult: 1.02, note: '' },
    { id: 'waitrose', label: 'Waitrose', mult: 1.2, note: '' },
    { id: 'filipino-shop', label: 'Filipino grocery shop', mult: 1.15, note: 'Specialty ingredients may cost more' },
  ],
};

const ABROAD_STORES = [
  { id: 'local-supermarket', label: 'Local supermarket', mult: 1, note: 'Baseline estimate' },
  { id: 'filipino-asian-store', label: 'Filipino / Asian store', mult: 1.12, note: 'Specialty ingredients may cost more' },
  { id: 'seafood-city', label: 'Seafood City', mult: 1.08, note: '' },
  { id: 'h-mart', label: 'H Mart', mult: 1.06, note: '' },
  { id: '99-ranch', label: '99 Ranch Market', mult: 1.05, note: '' },
  { id: 'lulu', label: 'Lulu Hypermarket', mult: 1.02, note: '' },
  { id: 'other', label: 'Other', mult: 1, note: 'Edit prices as you shop' },
];

export const getStores = (market = 'philippines') =>
  STORES_BY_MARKET[market] || (market === 'philippines' ? STORES_BY_MARKET.philippines : ABROAD_STORES);
export const getMarket = (market = 'philippines') => MARKETS.find((item) => item.id === market) || MARKETS[0];

export const HOME_REGIONS = [
  'Mixed / not sure', 'Ilocos', 'Pampanga', 'Bicol', 'Batangas', 'Cagayan Valley',
  'Metro Manila', 'Western Visayas', 'Iloilo', 'Cebu', 'Central Visayas', 'Davao',
  'Cagayan de Oro', 'Northern Mindanao', 'Eastern Visayas', 'Other',
];
export const HOME_ISLANDS = ['Luzon', 'Visayas', 'Mindanao', 'Mixed / not sure'];
export const REGIONS_BY_ISLAND = {
  Luzon: ['Ilocos', 'Pampanga', 'Bicol', 'Batangas', 'Cagayan Valley', 'Metro Manila', 'Other'],
  Visayas: ['Western Visayas', 'Iloilo', 'Cebu', 'Central Visayas', 'Eastern Visayas', 'Other'],
  Mindanao: ['Davao', 'Cagayan de Oro', 'Northern Mindanao', 'Other'],
  'Mixed / not sure': ['Mixed / not sure'],
};

export const VIBES = [
  { id: 'lutong-bahay', label: 'Lutong Bahay' },
  { id: 'mabilis', label: 'Mabilis (30 min)' },
  { id: 'tipid', label: 'Tipid' },
  { id: 'handaan', label: 'Handaan' },
  { id: 'sabaw', label: 'Sabaw' },
  { id: 'healthy-pinoy', label: 'Healthy Pinoy' },
  { id: 'rice-cooker', label: 'Rice cooker' },
  { id: 'pang-bata', label: 'Pang-Bata' },
  { id: 'ofw-comfort', label: 'OFW Comfort' },
  { id: 'lenten', label: 'No-meat Friday' },
];

export const FOOD_PREFERENCES = [
  { id: 'rice-light', label: 'Rice-light' },
  { id: 'low-sodium', label: 'Lower sodium' },
];

export const EQUIPMENT = [
  'rice cooker', 'stove', 'oven', 'air fryer', 'microwave only', 'one burner',
];

export const DEFAULTS = {
  market: 'philippines',
  country: 'philippines',
  currency: 'PHP',
  units: 'metric',
  stores: ['puregold'],
  language: 'en',
  name: '',
  homeRegion: 'Mixed / not sure',
  homeIsland: 'Mixed / not sure',
  diet: 'everything',
  allergens: [],
  calories: 1800,
  budget: 3500,
  people: 1,
  store: 'puregold',
  vibes: ['lutong-bahay', 'mabilis', 'tipid'],
  preferences: [],
  equipment: ['stove', 'rice cooker'],
  cookingForOne: true,
  dinnersOnly: false,
  includeMerienda: false,
  substitutions: {},
};

export const planSlots = (settings) => settings && settings.includeMerienda ? [...SLOTS, 'merienda'] : SLOTS;

export const storeMult = (settings) => {
  const market = getMarket(settings && (settings.market || settings.country));
  const stores = getStores(market.id);
  const selectedStore = (settings && settings.store) || (settings && settings.stores && settings.stores[0]);
  return market.priceFactor * (stores.find((store) => store.id === selectedStore) || stores[0]).mult;
};

const byId = Object.fromEntries(MEALS.map((m) => [m.id, m]));
export const getMeal = (id) => byId[id];

export const dayCalories = (day) =>
  [...SLOTS, 'merienda'].reduce((s, slot) => s + (byId[day[slot]] ? byId[day[slot]].kcal : 0), 0);

export function eligibleMeals(settings, slot, { noMeat = false } = {}) {
  const diet = DIETS.find((d) => d.id === settings.diet) || DIETS[0];
  const allergyTags = (settings.allergens || []).flatMap((allergen) =>
    allergen === 'seafood' ? ['fish', 'shellfish'] : [allergen],
  );
  const banned = new Set([...diet.exclude, ...allergyTags]);
  return MEALS.filter((m) => {
    if (m.slot !== slot || m.tags.some((tag) => banned.has(tag))) return false;
    if (noMeat && m.tags.some((tag) => ['pork', 'beef', 'chicken'].includes(tag))) return false;
    if (settings.equipment && m.equipment && m.equipment.length) {
      return m.equipment.some((item) => settings.equipment.includes(item));
    }
    return true;
  });
}

export function pantryShare(meal, pantrySet) {
  let total = 0;
  let have = 0;
  for (const [k, q] of Object.entries(meal.items)) {
    const c = q * ING[k].price;
    total += c;
    if (pantrySet.has(k)) have += c;
  }
  return total ? have / total : 0;
}

// Lower score = better pick.
function score(meal, settings, pantrySet, used, prevId, ingredientUse = {}) {
  const target = settings.calories * SLOT_SHARE[meal.slot];
  const calFit = Math.abs(meal.kcal - target) / target;
  const perMealBudget = settings.budget / Math.max(1, settings.people) / 21;
  const costPenalty = Math.max(0, meal.cost / perMealBudget - 1);
  const pantry = pantryShare(meal, pantrySet);
  const repeats = used[meal.id] || 0;
  const vibeFit = settings.vibes && settings.vibes.length
    ? (meal.vibes || []).some((vibe) => settings.vibes.includes(vibe)) ? -0.4 : 0.15
    : 0;
  const regionFit = settings.homeRegion && settings.homeRegion !== 'Mixed / not sure'
    ? (meal.region || []).includes(settings.homeRegion) ? -0.3 : 0.15
    : 0;
  const preferences = settings.preferences || [];
  const riceFit = preferences.includes('rice-light')
    ? meal.items.rice && meal.items.rice > 80 ? 0.35 : -0.2
    : 0;
  const sodiumFit = preferences.includes('low-sodium')
    ? ['soy', 'bagoong', 'sinigangMix'].some((key) => meal.items[key]) ? 0.2 : -0.15
    : 0;
  const overlap = Object.keys(meal.items).filter((key) => ingredientUse[key]).length /
    Math.max(1, Object.keys(meal.items).length);
  return (
    calFit +
    costPenalty * 0.8 -
    pantry * 0.6 +
    repeats * 0.7 +
    vibeFit +
    regionFit +
    riceFit +
    sodiumFit +
    overlap * -0.25 +
    (meal.id === prevId ? 1 : 0) +
    Math.random() * 0.25
  );
}

export function generatePlan(settings, pantryKeys = []) {
  const pantrySet = new Set(pantryKeys);
  const slots = planSlots(settings);
  const missing = slots.filter((s) => eligibleMeals(settings, s).length === 0);
  if (settings.vibes?.includes('lenten')) {
    slots.forEach((slot) => {
      if (eligibleMeals(settings, slot, { noMeat: true }).length === 0) missing.push(`Friday ${SLOT_LABEL[slot]}`);
    });
  }
  if (missing.length) {
    return {
      days: null,
      error:
        'No ' + missing.map((s) => SLOT_LABEL[s] || s).join(' / ') +
        ' meals match your diet and allergy filters yet. Try relaxing one of them in Settings.',
    };
  }
  const used = {};
  const ingredientUse = {};
  const prev = {};
  const days = [];
  for (let d = 0; d < 7; d++) {
    const day = {};
    for (const slot of slots) {
      const noMeat = settings.vibes?.includes('lenten') && d === 4;
      const eligible = eligibleMeals(settings, slot, { noMeat });
      let best = null;
      let bestScore = Infinity;
      for (const m of eligible) {
        const s = score(m, settings, pantrySet, used, prev[slot], ingredientUse);
        if (s < bestScore) {
          bestScore = s;
          best = m;
        }
      }
      day[slot] = best.id;
      used[best.id] = (used[best.id] || 0) + 1;
      Object.keys(best.items).forEach((key) => (ingredientUse[key] = (ingredientUse[key] || 0) + 1));
      prev[slot] = best.id;
    }
    days.push(day);
  }
  return { days, locked: [], createdAt: Date.now() };
}

export function swapMeal(plan, dayIdx, slot, settings, pantryKeys = []) {
  if (!plan || !plan.days) return plan;
  if ((plan.locked || []).includes(`${dayIdx}_${slot}`)) return plan;
  const pantrySet = new Set(pantryKeys);
  const current = plan.days[dayIdx][slot];
  const used = {};
  plan.days.forEach((d) => [...SLOTS, 'merienda'].forEach((s) => d[s] && (used[d[s]] = (used[d[s]] || 0) + 1)));
  const noMeat = settings.vibes?.includes('lenten') && dayIdx === 4;
  const pool = eligibleMeals(settings, slot, { noMeat }).filter((m) => m.id !== current);
  if (!pool.length) return plan;
  const ranked = pool
    .map((m) => ({ m, s: score(m, settings, pantrySet, used, null) }))
    .sort((a, b) => a.s - b.s)
    .slice(0, 3);
  const pick = ranked[Math.floor(Math.random() * ranked.length)].m;
  return {
    ...plan,
    days: plan.days.map((d, i) => (i === dayIdx ? { ...d, [slot]: pick.id } : d)),
  };
}
