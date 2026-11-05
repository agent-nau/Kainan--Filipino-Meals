import { ING } from './data/ingredients';
import { planSlots, getMeal, storeMult } from './planner';

export const SUBSTITUTIONS = {
  kangkong: {
    title: 'Kangkong',
    options: [{ id: 'spinach', label: 'Spinach', items: [{ key: 'spinach', factor: 1 }] }],
  },
  sayote: {
    title: 'Sayote',
    options: [{ id: 'zucchini', label: 'Zucchini', items: [{ key: 'zucchini', factor: 1 }] }],
  },
  calamansi: {
    title: 'Calamansi',
    options: [{ id: 'lemon-lime', label: 'Lemon + a little lime', items: [{ key: 'lemonLime', factor: 1 }] }],
  },
  ketchup: {
    title: 'Banana ketchup',
    options: [{ id: 'ketchup-sugar', label: 'Ketchup + a little sugar', items: [{ key: 'ketchup', factor: 1 }, { key: 'sugar', factor: 0.25 }] }],
  },
  bagoong: {
    title: 'Bagoong',
    options: [{ id: 'fish-sauce-miso', label: 'Fish sauce + a little miso', items: [{ key: 'fishSauceMiso', factor: 1 }] }],
  },
  sitaw: {
    title: 'Sitaw',
    options: [{ id: 'green-beans', label: 'Green beans', items: [{ key: 'greenBeans', factor: 1 }] }],
  },
  pechay: {
    title: 'Pechay',
    options: [{ id: 'bok-choy', label: 'Bok choy', items: [{ key: 'bokChoy', factor: 1 }] }],
  },
  gabi: {
    title: 'Gabi leaves',
    options: [{ id: 'collard-greens', label: 'Collard greens', items: [{ key: 'collardGreens', factor: 1 }] }],
  },
};

const FRUIT_KEYS = new Set(['banana', 'calamansi', 'pineapple', 'lemonLime']);
const AISLE_LABELS = {
  meat: 'Karne',
  seafood: 'Isda',
  produce: 'Gulay',
  fruit: 'Prutas',
  pantry: 'Pantry',
  sauces: 'Sarsa at Pampalasa',
};

function roundQty(q, unit) {
  if (unit === 'g' || unit === 'ml') return Math.ceil(q / 10) * 10;
  return Math.ceil(q - 1e-9);
}

export function fmtQty(qty, unit, units = 'metric') {
  if (units === 'imperial' && unit === 'g') return `${+(qty / 28.3495).toFixed(1)} oz`;
  if (units === 'imperial' && unit === 'ml') return `${+(qty / 29.5735).toFixed(1)} fl oz`;
  if (unit === 'g' && qty >= 1000) return String(+(qty / 1000).toFixed(2)) + ' kg';
  if (unit === 'ml' && qty >= 1000) return String(+(qty / 1000).toFixed(2)) + ' L';
  return qty + ' ' + pluralUnit(unit, qty);
}

export function pluralUnit(unit, qty) {
  return qty > 1 && (unit === 'clove' || unit === 'stalk' || unit === 'pack') ? unit + 's' : unit;
}

// Sum a plan's ingredients (x people), drop what's already in the pantry, group by aisle.
export function buildShopping(plan, settings, pantryKeys = []) {
  const empty = { sections: [], total: 0, count: 0 };
  if (!plan || !plan.days || !settings) return empty;
  const pantry = new Set(pantryKeys);
  const need = {};
  const substitutedFrom = {};
  const substitutions = settings.substitutions || {};
  plan.days.forEach((day) =>
    planSlots(settings).forEach((slot) => {
      const meal = getMeal(day[slot]);
      if (!meal) return;
      for (const [k, q] of Object.entries(meal.items)) {
        const selected = (SUBSTITUTIONS[k]?.options || []).find((option) => option.id === substitutions[k]);
        const targets = selected ? selected.items : [{ key: k, factor: 1 }];
        targets.forEach(({ key, factor }) => {
          need[key] = (need[key] || 0) + q * settings.people * factor;
          if (selected && key !== k) {
            substitutedFrom[key] = [...new Set([...(substitutedFrom[key] || []), k])];
          }
        });
      }
    })
  );
  const mult = storeMult(settings);
  const grouped = {};
  let total = 0;
  let count = 0;
  Object.entries(need).forEach(([k, q]) => {
    if (pantry.has(k)) return;
    const ing = ING[k];
    const qty = roundQty(q, ing.unit);
    const cost = qty * ing.price * mult;
    total += cost;
    count += 1;
    const aisle = ing.cat === 'meat' || ing.cat === 'seafood' || ing.cat === 'sauces'
      ? ing.cat
      : FRUIT_KEYS.has(k)
        ? 'fruit'
        : ing.cat === 'produce'
          ? 'produce'
          : 'pantry';
    if (!grouped[aisle]) grouped[aisle] = [];
    grouped[aisle].push({
      key: k,
      name: ing.name,
      qty,
      unit: ing.unit,
      label: fmtQty(qty, ing.unit, settings.units),
      cost,
      substitutedFrom: substitutedFrom[k] || [],
    });
  });
  const sections = Object.keys(AISLE_LABELS)
    .filter((c) => grouped[c])
    .map((c) => ({
      cat: c,
      label: AISLE_LABELS[c],
      items: grouped[c].sort((a, b) => a.name.localeCompare(b.name)),
    }));
  return { sections, total, count };
}
