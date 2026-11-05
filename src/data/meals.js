import { ING } from './ingredients';

// [id, name, slot, kcal per serving, { ingredientKey: qty per serving }]
const RAW = [
  // ---------- Almusal (breakfast)
  ['tapsilog', 'Tapsilog (tapa, garlic rice, egg)', 'breakfast', 620, { tapa: 120, rice: 80, egg: 1, garlic: 3, oil: 1, soy: 1 }],
  ['longsilog', 'Longsilog (longganisa, garlic rice, egg)', 'breakfast', 640, { longganisa: 2, rice: 80, egg: 1, garlic: 3, oil: 1, ketchup: 1 }],
  ['tocilog', 'Tocilog (tocino, garlic rice, egg)', 'breakfast', 650, { tocino: 110, rice: 80, egg: 1, garlic: 3, oil: 1 }],
  ['bangsilog', 'Bangsilog (daing na bangus, rice, egg)', 'breakfast', 610, { bangus: 150, rice: 80, egg: 1, garlic: 3, oil: 2, vinegar: 1 }],
  ['tuyosilog', 'Tuyosilog (tuyo, rice, egg, tomato)', 'breakfast', 520, { tuyo: 3, rice: 80, egg: 1, garlic: 3, oil: 1, tomato: 1 }],
  ['champorado', 'Champorado', 'breakfast', 380, { malagkit: 60, tablea: 30, sugar: 2, evap: 60 }],
  ['pandesal-itlog', 'Pandesal with itlog na maalat & kamatis', 'breakfast', 360, { pandesal: 4, saltedEgg: 1, tomato: 1 }],
  ['arroz-caldo', 'Arroz caldo', 'breakfast', 430, { chicken: 100, rice: 70, ginger: 10, garlic: 3, egg: 1, calamansi: 2, scallion: 5, onion: 0.5 }],
  ['oatmeal-saging', 'Oatmeal with saging', 'breakfast', 380, { oats: 60, banana: 2, milk: 150 }],
  ['tortang-talong', 'Tortang talong with rice', 'breakfast', 470, { eggplant: 1, egg: 2, rice: 80, ketchup: 2, oil: 1 }],

  // ---------- Tanghalian (lunch)
  ['chicken-adobo', 'Chicken adobo with rice', 'lunch', 690, { chicken: 200, rice: 90, soy: 2, vinegar: 2, garlic: 4, bayLeaf: 1, oil: 1 }],
  ['pork-adobo', 'Pork adobo with rice', 'lunch', 780, { pork: 180, rice: 90, soy: 2, vinegar: 2, garlic: 4, bayLeaf: 1 }],
  ['sinigang-baboy', 'Sinigang na baboy', 'lunch', 700, { pork: 170, sinigangMix: 0.5, kangkong: 80, labanos: 50, tomato: 1, onion: 0.5, rice: 90 }],
  ['sinigang-hipon', 'Sinigang na hipon', 'lunch', 520, { shrimp: 150, sinigangMix: 0.5, kangkong: 80, labanos: 50, tomato: 1, onion: 0.5, rice: 90 }],
  ['tinola', 'Tinolang manok', 'lunch', 570, { chicken: 200, sayote: 100, siliLeaves: 30, ginger: 15, onion: 0.5, garlic: 2, rice: 90 }],
  ['munggo', 'Ginisang munggo', 'lunch', 490, { munggo: 80, garlic: 3, onion: 0.5, tomato: 1, siliLeaves: 20, rice: 80, oil: 1 }],
  ['pinakbet', 'Pinakbet', 'lunch', 540, { pork: 80, squash: 80, okra: 50, eggplant: 0.5, sitaw: 50, ampalaya: 50, bagoong: 1, tomato: 1, rice: 80 }],
  ['bistek', 'Bistek Tagalog', 'lunch', 640, { beef: 150, onion: 1, soy: 2, calamansi: 4, garlic: 2, oil: 1, rice: 90 }],
  ['fried-bangus', 'Pritong bangus with atchara', 'lunch', 640, { bangus: 200, rice: 90, atchara: 40, tomato: 1, oil: 2 }],
  ['inasal', 'Chicken inasal with rice', 'lunch', 710, { chicken: 220, calamansi: 3, vinegar: 2, lemongrass: 1, garlic: 3, rice: 90, oil: 1 }],
  ['ginataang-kalabasa', 'Ginataang kalabasa at sitaw', 'lunch', 540, { squash: 150, sitaw: 80, gata: 100, garlic: 2, onion: 0.5, rice: 80 }],
  ['pancit-bihon', 'Pancit bihon', 'lunch', 530, { bihon: 80, chicken: 80, carrot: 40, cabbage: 60, soy: 2, calamansi: 2, garlic: 2, oil: 1 }],
  ['pritong-tilapia', 'Pritong tilapia with kamatis', 'lunch', 600, { tilapia: 250, rice: 90, tomato: 1, onion: 0.5, oil: 2 }],
  ['ginisang-ampalaya', 'Ginisang ampalaya with itlog', 'lunch', 480, { ampalaya: 120, egg: 2, tomato: 1, onion: 0.5, garlic: 2, rice: 80, oil: 1 }],

  // ---------- Hapunan (dinner)
  ['kare-kare', 'Kare-kare', 'dinner', 790, { beef: 180, peanutButter: 3, eggplant: 1, sitaw: 50, pechay: 60, bagoong: 1, rice: 90 }],
  ['sinigang-bangus', 'Sinigang na bangus', 'dinner', 540, { bangus: 200, sinigangMix: 0.5, kangkong: 60, labanos: 50, tomato: 1, onion: 0.5, rice: 80 }],
  ['afritada', 'Chicken afritada', 'dinner', 700, { chicken: 200, potato: 100, carrot: 60, bellPepper: 0.5, tomatoSauce: 80, garlic: 2, onion: 0.5, rice: 90 }],
  ['menudo', 'Pork menudo', 'dinner', 720, { pork: 150, potato: 80, carrot: 50, tomatoSauce: 80, bellPepper: 0.5, garlic: 2, onion: 0.5, rice: 80 }],
  ['sisig', 'Pork sisig with rice', 'dinner', 790, { pork: 180, onion: 1, calamansi: 4, chili: 2, egg: 1, rice: 90 }],
  ['laing', 'Laing (gabi in gata)', 'dinner', 590, { gabi: 40, gata: 200, chili: 3, ginger: 10, garlic: 3, onion: 0.5, rice: 80 }],
  ['paksiw', 'Paksiw na tilapia', 'dinner', 520, { tilapia: 230, vinegar: 3, ginger: 15, eggplant: 1, garlic: 3, chili: 1, rice: 80 }],
  ['bulalo', 'Bulalo', 'dinner', 710, { beefShank: 250, corn: 1, pechay: 60, cabbage: 80, onion: 0.5, rice: 80 }],
  ['chicken-curry', 'Filipino chicken curry', 'dinner', 780, { chicken: 200, potato: 100, carrot: 50, gata: 100, curry: 2, garlic: 2, onion: 0.5, rice: 80 }],
  ['ginataang-hipon', 'Ginataang hipon at sitaw', 'dinner', 640, { shrimp: 150, gata: 150, sitaw: 80, garlic: 2, onion: 0.5, rice: 80 }],
  ['tortang-giniling', 'Tortang giniling', 'dinner', 640, { porkGround: 100, egg: 2, potato: 60, onion: 0.5, garlic: 2, oil: 2, rice: 80 }],
  ['pininyahan', 'Pininyahang manok', 'dinner', 690, { chicken: 200, pineapple: 80, evap: 60, carrot: 40, onion: 0.5, rice: 80 }],
  ['ginisang-tokwa', 'Ginisang tokwa at gulay', 'dinner', 550, { tofu: 200, cabbage: 60, carrot: 40, soy: 2, garlic: 3, oil: 2, rice: 80 }],
  ['nilaga', 'Nilagang baka', 'dinner', 640, { beef: 180, potato: 100, cabbage: 80, corn: 1, pechay: 60, onion: 0.5, rice: 80 }],
  ['bicol-express', 'Bicol Express', 'dinner', 760, { pork: 160, gata: 120, chili: 3, garlic: 3, onion: 0.5, bagoong: 1, rice: 80 }],
  ['chopsuey', 'Chopsuey', 'lunch', 510, { chicken: 90, cabbage: 80, carrot: 50, bellPepper: 0.5, sayote: 80, garlic: 2, onion: 0.5, soy: 1, oil: 1 }],
  ['lumpiang-shanghai', 'Lumpiang Shanghai', 'lunch', 650, { porkGround: 140, carrot: 40, onion: 0.5, egg: 0.5, springRollWrapper: 4, oil: 2, rice: 80 }],
  ['turon', 'Turon', 'merienda', 330, { banana: 2, sugar: 2, springRollWrapper: 2, oil: 1 }],
  ['maja-blanca', 'Maja Blanca', 'merienda', 300, { gata: 100, evap: 50, sugar: 2, cornstarch: 2, corn: 0.5 }],
  ['biko', 'Biko', 'merienda', 360, { malagkit: 80, gata: 80, sugar: 2 }],
  ['mechado', 'Mechadong Baka', 'dinner', 690, { beef: 170, potato: 80, carrot: 50, tomatoSauce: 80, bellPepper: 0.5, garlic: 2, onion: 0.5, rice: 80 }],
  ['lechon-kawali', 'Lechon Kawali', 'dinner', 820, { pork: 200, oil: 3, garlic: 2, vinegar: 1, rice: 80 }],
  ['daing-bangus', 'Daing na Bangus', 'breakfast', 600, { bangus: 160, vinegar: 2, garlic: 3, oil: 2, rice: 80 }],
  ['paksiw-bangus', 'Paksiw na Bangus', 'lunch', 540, { bangus: 180, vinegar: 3, ginger: 10, eggplant: 1, garlic: 3, chili: 1, rice: 80 }],
  ['pancit-canton', 'Pancit Canton', 'lunch', 570, { eggNoodles: 90, chicken: 70, cabbage: 60, carrot: 40, soy: 2, garlic: 2, oil: 1 }],
  ['champorado-tuyo', 'Champorado with Tuyo', 'breakfast', 430, { malagkit: 60, tablea: 30, sugar: 2, evap: 60, tuyo: 1 }],
  ['giniling', 'Giniling', 'dinner', 670, { porkGround: 140, potato: 80, carrot: 50, tomatoSauce: 60, garlic: 2, onion: 0.5, rice: 80 }],
  ['dinuguan', 'Dinuguan', 'dinner', 720, { pork: 130, porkBlood: 100, vinegar: 2, garlic: 3, onion: 0.5, chili: 1, rice: 80 }],
  ['adobong-kangkong', 'Adobong Kangkong', 'lunch', 380, { kangkong: 180, soy: 2, vinegar: 2, garlic: 3, oil: 1, rice: 80 }],
  ['misua-soup', 'Misua Soup', 'breakfast', 410, { misua: 50, chicken: 80, egg: 1, garlic: 2, onion: 0.5, scallion: 5 }],
];

const REGIONS = {
  pinakbet: ['Ilocos'],
  'bicol-express': ['Bicol'],
  laing: ['Bicol'],
  'chicken-inasal': ['Iloilo', 'Western Visayas'],
  inasal: ['Iloilo', 'Western Visayas'],
  'pancit-bihon': ['Pampanga'],
  'sinigang-baboy': ['Batangas'],
  'bistek': ['Batangas', 'Metro Manila'],
  sisig: ['Pampanga'],
  'lechon-kawali': ['Pampanga'],
  dinuguan: ['Pampanga'],
};

const METHODS = {
  soup: [
    'Prep the vegetables and aromatics. Rinse the protein and measure the broth ingredients.',
    'Simmer the protein with aromatics until nearly tender, skimming the surface as needed.',
    'Add the vegetables in order of how long they take to cook. Simmer until tender and serve with rice.',
  ],
  braise: [
    'Prep and measure the ingredients. If rice is listed, cook it separately.',
    'Brown the protein in a pot, then add the garlic, onion and sauce ingredients.',
    'Add a little water, cover and simmer until the protein is cooked through and tender. Taste, adjust and serve.',
  ],
  saute: [
    'Chop the vegetables and prepare the measured ingredients.',
    'Warm oil in a pan. Cook garlic and onion until fragrant, then add the protein or vegetables.',
    'Add the remaining ingredients and a splash of water if needed. Cook until tender and serve with rice.',
  ],
  fry: [
    'Pat the main ingredient dry and prepare the measured sides.',
    'Heat a thin layer of oil in a pan. Cook the main ingredient in batches until browned and cooked through.',
    'Drain briefly, prepare the listed sides, and serve hot with rice.',
  ],
  breakfast: [
    'Prepare the measured ingredients and cook the rice or bread separately if listed.',
    'Warm a pan with a little oil. Cook the main ingredient, then prepare the egg or toppings.',
    'Serve together while hot. Add the listed sauce or fruit to taste.',
  ],
  merienda: [
    'Measure the ingredients and prepare a small pan or pot.',
    'Combine the listed ingredients over low heat, stirring often so the mixture does not stick.',
    'Cook until tender and glossy, then cool or serve warm as appropriate.',
  ],
};

const METHOD_BY_ID = {
  'sinigang-baboy': 'soup', 'sinigang-hipon': 'soup', 'tinola': 'soup',
  'arroz-caldo': 'soup', 'sinigang-bangus': 'soup', 'bulalo': 'soup', 'nilaga': 'soup',
  'paksiw-bangus': 'braise', 'misua-soup': 'soup',
  'chicken-adobo': 'braise', 'pork-adobo': 'braise', 'afritada': 'braise', 'menudo': 'braise',
  'bistek': 'braise', paksiw: 'braise', 'chicken-curry': 'braise', pininyahan: 'braise',
  'bicol-express': 'braise', mechado: 'braise', giniling: 'braise', dinuguan: 'braise',
  'lechon-kawali': 'fry', 'daing-bangus': 'fry',
  munggo: 'saute', pinakbet: 'saute', 'ginataang-kalabasa': 'saute', 'pancit-bihon': 'saute',
  'ginisang-ampalaya': 'saute', 'ginataang-hipon': 'saute', 'ginisang-tokwa': 'saute',
  chopsuey: 'saute', laing: 'saute', 'tortang-giniling': 'saute',
  'pancit-canton': 'saute', 'adobong-kangkong': 'saute',
  'fried-bangus': 'fry', inasal: 'fry', 'pritong-tilapia': 'fry', sisig: 'fry',
  'tapsilog': 'breakfast', longsilog: 'breakfast', tocilog: 'breakfast', bangsilog: 'breakfast',
  tuyosilog: 'breakfast', champorado: 'merienda', 'pandesal-itlog': 'breakfast',
  'oatmeal-saging': 'breakfast', 'tortang-talong': 'breakfast', 'lumpiang-shanghai': 'fry',
  turon: 'merienda', 'maja-blanca': 'merienda', biko: 'merienda',
};

const ENGLISH_NAMES = {
  'chicken-adobo': 'Chicken Adobo', 'sinigang-baboy': 'Pork Sinigang', tinola: 'Chicken Tinola',
  nilaga: 'Beef Nilaga', 'kare-kare': 'Kare-Kare', menudo: 'Pork Menudo', afritada: 'Chicken Afritada',
  pinakbet: 'Pinakbet', munggo: 'Ginisang Munggo', 'bicol-express': 'Bicol Express',
  laing: 'Laing', sisig: 'Pork Sisig', inasal: 'Chicken Inasal', bulalo: 'Bulalo',
  paksiw: 'Paksiw na Tilapia', 'fried-bangus': 'Fried Bangus', 'tortang-talong': 'Eggplant Omelette',
  'ginataang-kalabasa': 'Squash and String Beans in Coconut Milk', chopsuey: 'Chop Suey',
  'lumpiang-shanghai': 'Lumpiang Shanghai', tapsilog: 'Tapsilog', tocilog: 'Tocilog',
  longsilog: 'Longsilog', champorado: 'Champorado', 'arroz-caldo': 'Arroz Caldo',
  'pancit-bihon': 'Pancit Bihon', pininyahan: 'Pineapple Chicken', bistek: 'Bistek Tagalog',
  'sinigang-hipon': 'Shrimp Sinigang', 'sinigang-bangus': 'Bangus Sinigang',
  'ginisang-ampalaya': 'Bitter Melon with Egg', 'chicken-curry': 'Filipino Chicken Curry',
  'ginataang-hipon': 'Shrimp in Coconut Milk', 'tortang-giniling': 'Ground Pork Omelette',
  'ginisang-tokwa': 'Tofu and Vegetables', turon: 'Turon', 'maja-blanca': 'Maja Blanca', biko: 'Biko',
  mechado: 'Beef Mechado', 'lechon-kawali': 'Lechon Kawali', 'daing-bangus': 'Daing na Bangus',
  'paksiw-bangus': 'Paksiw na Bangus', 'pancit-canton': 'Pancit Canton',
  'champorado-tuyo': 'Champorado with Tuyo', giniling: 'Giniling', dinuguan: 'Dinuguan',
  'adobong-kangkong': 'Adobong Kangkong', 'misua-soup': 'Misua Soup',
};

export const MEALS = RAW.map(([id, name, slot, kcal, items]) => {
  const tags = Array.from(
    new Set(Object.keys(items).map((k) => ING[k] && ING[k].tag).filter(Boolean))
  );
  const cost = Object.entries(items).reduce((s, [k, q]) => s + q * ING[k].price, 0);
  const methodKey = METHOD_BY_ID[id] || (slot === 'breakfast' ? 'breakfast' : 'saute');
  const prepTime = methodKey === 'soup' || methodKey === 'merienda' ? 15 : 10;
  const cookTime = {
    soup: 40,
    braise: 35,
    saute: 20,
    fry: 20,
    breakfast: 15,
    merienda: 25,
  }[methodKey];
  const method = METHODS[methodKey];
  const keySet = new Set(Object.keys(items));
  const abroadFriendlyRating = Math.max(1, 5 - ['kangkong', 'sayote', 'calamansi', 'bagoong', 'sitaw', 'pechay', 'gabi', 'siliLeaves']
    .filter((key) => keySet.has(key)).length);
  const vibes = ['lutong-bahay', 'ofw-comfort'];
  if (cost < 85) vibes.push('tipid');
  if (prepTime + cookTime <= 30) vibes.push('mabilis');
  if (METHOD_BY_ID[id] === 'soup') vibes.push('sabaw');
  if (kcal <= 520) vibes.push('healthy-pinoy');
  if (slot === 'merienda' || ['champorado', 'turon'].includes(id)) vibes.push('pang-bata');
  if (slot === 'dinner' && ['bicol-express', 'sisig', 'bulalo', 'kare-kare'].includes(id)) vibes.push('handaan');
  const equipment = ['stove', 'one burner'];
  if (['champorado', 'oatmeal-saging', 'munggo', 'arroz-caldo'].includes(id)) equipment.push('rice cooker', 'microwave only');
  if (['inasal', 'afritada', 'pininyahan'].includes(id)) equipment.push('oven', 'air fryer');
  if (equipment.includes('rice cooker')) vibes.push('rice-cooker');
  return {
    id,
    name,
    titleFilipino: name,
    titleEnglish: ENGLISH_NAMES[id] || name,
    slot,
    kcal,
    items,
    tags,
    dietaryFlags: tags,
    cost,
    costEstimate: cost,
    servings: 1,
    prepTime,
    cookTime,
    time: prepTime + cookTime,
    region: REGIONS[id] || ['Mixed / not sure'],
    vibes,
    equipment,
    abroadFriendlyRating,
    steps: method,
    tips: {
      tipid: 'Cook an extra portion and reuse it for tomorrow’s lunch to save time and reduce waste.',
      abroad: abroadFriendlyRating <= 3
        ? 'Check the “Wala sa store?” swaps on your shopping list for easier-to-find alternatives.'
        : 'Most ingredients are common at mainstream supermarkets. Check Filipino or Asian shops for specialty sauces.',
    },
  };
});
