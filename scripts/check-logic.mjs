// Sanity checks for the planner and grocery list. Run with: npm run check
import { register } from 'node:module';
register('./ext-hook.mjs', import.meta.url);

const { DIETS, ALLERGENS, MARKETS, getStores, SLOTS, DEFAULTS, generatePlan, getMeal, eligibleMeals, dayCalories } =
  await import('../src/planner.js');
const { buildShopping } = await import('../src/shopping.js');
const { MEALS } = await import('../src/data/meals.js');
const { ING } = await import('../src/data/ingredients.js');
const { formatMoney } = await import('../src/theme.js');

let failures = 0;
const fail = (msg) => {
  failures += 1;
  console.error('FAIL: ' + msg);
};

// 1. Data integrity
for (const m of MEALS) {
  for (const k of Object.keys(m.items)) if (!ING[k]) fail(`${m.id} uses unknown ingredient ${k}`);
  if (!(m.kcal > 100 && m.kcal < 1200)) fail(`${m.id} has odd kcal ${m.kcal}`);
  if (!(m.cost > 0)) fail(`${m.id} has no cost`);
  if (!m.steps?.length || !m.equipment?.length || !m.region?.length || !m.vibes?.length) fail(`${m.id} is missing recipe metadata`);
}
if (MEALS.length < 40) fail(`expected at least 40 recipes, got ${MEALS.length}`);
console.log(`${MEALS.length} meals, ${Object.keys(ING).length} ingredients`);

// 2. Every diet x allergy combo: plan never contains a banned meal
const allergyCombos = [[], ['egg'], ['shellfish', 'dairy'], ['peanut', 'fish'], ALLERGENS.map((a) => a.id)];
for (const diet of DIETS) {
  for (const allergens of allergyCombos) {
    const cfg = { ...DEFAULTS, diet: diet.id, allergens };
    const banned = new Set([
      ...diet.exclude,
      ...allergens.flatMap((allergen) => allergen === 'seafood' ? ['fish', 'shellfish'] : [allergen]),
    ]);
    const res = generatePlan(cfg, []);
    const label = `${diet.id} + [${allergens.join(',')}]`;
    if (res.error) {
      console.log(`  ${label}: no plan (${res.error.slice(0, 40)}...)`);
      continue;
    }
    if (res.days.length !== 7) fail(`${label}: ${res.days.length} days`);
    for (const d of res.days)
      for (const slot of SLOTS) {
        const m = getMeal(d[slot]);
        if (!m) fail(`${label}: missing meal ${d[slot]}`);
        else if (m.tags.some((t) => banned.has(t))) fail(`${label}: ${m.id} has banned tag`);
        else if (m.slot !== slot) fail(`${label}: ${m.id} in wrong slot`);
      }
  }
}

// 3. Shopping list behaviour
const plan = generatePlan(DEFAULTS, []);
const base = buildShopping(plan, DEFAULTS, []);
if (!(base.total > 0 && base.count > 0)) fail('empty shopping list for default plan');
const allKeys = Object.keys(ING);
const none = buildShopping(plan, DEFAULTS, allKeys);
if (none.count !== 0 || none.total !== 0) fail('pantry with everything should leave nothing to buy');
const twice = buildShopping(plan, { ...DEFAULTS, people: 2 }, []);
if (!(twice.total > base.total * 1.8)) fail('2 people should cost roughly double');
const cheap = buildShopping(plan, { ...DEFAULTS, store: 'palengke' }, []);
const pricey = buildShopping(plan, { ...DEFAULTS, store: 'snr' }, []);
if (!(cheap.total < base.total && pricey.total > base.total)) fail('store multipliers not applied');
const ukSettings = { ...DEFAULTS, market: 'uk', budget: 55, store: 'tesco' };
const ukList = buildShopping(plan, ukSettings, []);
const ukDiscount = buildShopping(plan, { ...ukSettings, store: 'aldi' }, []);
if (!(ukList.total > 0 && ukDiscount.total < ukList.total)) fail('UK market/store estimates not applied');
if (MARKETS.length < 15 || getStores('uk').length === 0 || !formatMoney(20, 'uk').includes('£'))
  fail('UK market setup or currency formatting is missing');

// 4. Cultural safety and abroad substitutions
for (const dietId of ['nopork', 'halal']) {
  const safePlan = generatePlan({ ...DEFAULTS, diet: dietId }, []);
  if (safePlan.error) fail(`${dietId} should have a starter plan`);
  else for (const day of safePlan.days) for (const slot of SLOTS) {
    const meal = getMeal(day[slot]);
    if (meal?.tags.includes('pork')) fail(`${dietId} produced pork in ${meal.id}`);
  }
}
const fridayPlan = generatePlan({ ...DEFAULTS, vibes: ['lenten'] }, []);
if (!fridayPlan.error) {
  for (const slot of SLOTS) {
    const meal = getMeal(fridayPlan.days[4][slot]);
    if (meal?.tags.some((tag) => ['pork', 'beef', 'chicken'].includes(tag))) fail(`Lenten Friday included meat in ${meal.id}`);
  }
}
const swapPlan = { days: [{ breakfast: 'sinigang-baboy', lunch: 'sinigang-baboy', dinner: 'sinigang-baboy' }] };
const swappedList = buildShopping(swapPlan, { ...DEFAULTS, substitutions: { kangkong: 'spinach' } }, []);
const swappedKeys = swappedList.sections.flatMap((section) => section.items.map((item) => item.key));
if (!swappedKeys.includes('spinach') || swappedKeys.includes('kangkong')) fail('accepted ingredient substitutions are not applied');

// Optional Merienda is planned and shopped when enabled.
const meriendaPlan = generatePlan({ ...DEFAULTS, includeMerienda: true }, []);
if (meriendaPlan.error || !meriendaPlan.days.every((day) => !!day.merienda)) fail('optional Merienda is missing from plan');
if (!buildShopping(meriendaPlan, { ...DEFAULTS, includeMerienda: true }, []).count) fail('Merienda ingredients are missing from shopping list');

// 5. Report
console.log('\nPhilippines defaults (1 person, 1800 kcal, budget P3500, Puregold)');
console.log('  Week bill:', Math.round(base.total), 'PHP across', base.count, 'items');
console.log('  Avg kcal/day:', Math.round(plan.days.reduce((s, d) => s + dayCalories(d), 0) / 7));
console.log('  Palengke:', Math.round(cheap.total), ' S&R:', Math.round(pricey.total));
console.log('  UK Tesco estimate:', formatMoney(ukList.total, 'uk'), ' Aldi:', formatMoney(ukDiscount.total, 'uk'));
for (const diet of DIETS) {
  const counts = SLOTS.map((s) => eligibleMeals({ ...DEFAULTS, diet: diet.id }, s).length);
  console.log(`  ${diet.id.padEnd(10)} meals per slot [breakfast, lunch, dinner]: ${counts.join(', ')}`);
}

if (failures) {
  console.error(`\n${failures} check(s) failed`);
  process.exit(1);
}
console.log('\nAll checks passed');
