import React from 'react';
import { View } from 'react-native';
import { ING } from './data/ingredients';
import { colors } from './theme';

import ampalaya from '../public/ingredients/ampalaya.svg';
import atchara from '../public/ingredients/atchara.svg';
import bagoong from '../public/ingredients/bagoong.svg';
import banana from '../public/ingredients/banana.svg';
import bangus from '../public/ingredients/bangus.svg';
import bayLeaf from '../public/ingredients/bayLeaf.svg';
import beef from '../public/ingredients/beef.svg';
import beefShank from '../public/ingredients/beefShank.svg';
import bellPepper from '../public/ingredients/bellPepper.svg';
import bihon from '../public/ingredients/bihon.svg';
import bokChoy from '../public/ingredients/bokChoy.svg';
import cabbage from '../public/ingredients/cabbage.svg';
import calamansi from '../public/ingredients/calamansi.svg';
import carrot from '../public/ingredients/carrot.svg';
import chicken from '../public/ingredients/chicken.svg';
import chili from '../public/ingredients/chili.svg';
import collardGreens from '../public/ingredients/collardGreens.svg';
import corn from '../public/ingredients/corn.svg';
import cornstarch from '../public/ingredients/cornstarch.svg';
import curry from '../public/ingredients/curry.svg';
import egg from '../public/ingredients/egg.svg';
import eggNoodles from '../public/ingredients/eggNoodles.svg';
import eggplant from '../public/ingredients/eggplant.svg';
import evap from '../public/ingredients/evap.svg';
import fishSauceMiso from '../public/ingredients/fishSauceMiso.svg';
import gabi from '../public/ingredients/gabi.svg';
import garlic from '../public/ingredients/garlic.svg';
import gata from '../public/ingredients/gata.svg';
import ginger from '../public/ingredients/ginger.svg';
import greenBeans from '../public/ingredients/greenBeans.svg';
import kangkong from '../public/ingredients/kangkong.svg';
import ketchup from '../public/ingredients/ketchup.svg';
import labanos from '../public/ingredients/labanos.svg';
import lemonLime from '../public/ingredients/lemonLime.svg';
import lemongrass from '../public/ingredients/lemongrass.svg';
import longganisa from '../public/ingredients/longganisa.svg';
import malagkit from '../public/ingredients/malagkit.svg';
import milk from '../public/ingredients/milk.svg';
import misua from '../public/ingredients/misua.svg';
import munggo from '../public/ingredients/munggo.svg';
import oats from '../public/ingredients/oats.svg';
import oil from '../public/ingredients/oil.svg';
import okra from '../public/ingredients/okra.svg';
import onion from '../public/ingredients/onion.svg';
import pandesal from '../public/ingredients/pandesal.svg';
import peanutButter from '../public/ingredients/peanutButter.svg';
import pechay from '../public/ingredients/pechay.svg';
import pineapple from '../public/ingredients/pineapple.svg';
import pork from '../public/ingredients/pork.svg';
import porkBlood from '../public/ingredients/porkBlood.svg';
import porkGround from '../public/ingredients/porkGround.svg';
import potato from '../public/ingredients/potato.svg';
import rice from '../public/ingredients/rice.svg';
import saltedEgg from '../public/ingredients/saltedEgg.svg';
import sayote from '../public/ingredients/sayote.svg';
import scallion from '../public/ingredients/scallion.svg';
import shrimp from '../public/ingredients/shrimp.svg';
import siliLeaves from '../public/ingredients/siliLeaves.svg';
import sinigangMix from '../public/ingredients/sinigangMix.svg';
import sitaw from '../public/ingredients/sitaw.svg';
import spinach from '../public/ingredients/spinach.svg';
import springRollWrapper from '../public/ingredients/springRollWrapper.svg';
import soy from '../public/ingredients/soy.svg';
import squash from '../public/ingredients/squash.svg';
import sugar from '../public/ingredients/sugar.svg';
import tablea from '../public/ingredients/tablea.svg';
import tapa from '../public/ingredients/tapa.svg';
import tilapia from '../public/ingredients/tilapia.svg';
import tocino from '../public/ingredients/tocino.svg';
import tofu from '../public/ingredients/tofu.svg';
import tomato from '../public/ingredients/tomato.svg';
import tomatoSauce from '../public/ingredients/tomatoSauce.svg';
import tuyo from '../public/ingredients/tuyo.svg';
import vinegar from '../public/ingredients/vinegar.svg';
import zucchini from '../public/ingredients/zucchini.svg';

const ICONS = {
  ampalaya, atchara, bagoong, banana, bangus, bayLeaf, beef, beefShank, bellPepper, bihon, bokChoy,
  cabbage, calamansi, carrot, chicken, chili, collardGreens, corn, cornstarch, curry, egg, eggNoodles,
  eggplant, evap, fishSauceMiso, gabi, garlic, gata, ginger, greenBeans, kangkong, ketchup, labanos,
  lemonLime, lemongrass, longganisa, malagkit, milk, misua, munggo, oats, oil, okra, onion, pandesal,
  peanutButter, pechay, pineapple, pork, porkBlood, porkGround, potato, rice, saltedEgg, sayote, scallion,
  shrimp, siliLeaves, sinigangMix, sitaw, spinach, springRollWrapper, soy, squash, sugar, tablea, tapa,
  tilapia, tocino, tofu, tomato, tomatoSauce, tuyo, vinegar, zucchini,
};

function NeutralDot({ size = 16, color = colors.muted }) {
  return (
    <View
      accessibilityLabel="Ingredient icon unavailable"
      style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: color }}
    />
  );
}

const normalize = (value) => value.toLowerCase().replace(/[^a-z0-9]/g, '');
const NAME_TO_KEY = Object.fromEntries(
  Object.entries(ING).flatMap(([key, ingredient]) => [
    [normalize(key), key],
    [normalize(ingredient.name), key],
  ])
);

const API_ALIASES = {
  chicken: 'chicken',
  poultry: 'chicken',
  porkbelly: 'pork',
  porkribs: 'pork',
  porkleg: 'pork',
  porkface: 'pork',
  porkears: 'pork',
  porkheadmeat: 'pork',
  porkliver: 'pork',
  porkblood: 'pork',
  porkbrain: 'pork',
  sucklingpig: 'pork',
  wholepig: 'pork',
  groundpork: 'porkGround',
  beef: 'beef',
  beeftripe: 'beef',
  oxtail: 'beefShank',
  beefshank: 'beefShank',
  beeftapa: 'tapa',
  sausage: 'longganisa',
  bangus: 'bangus',
  milkfish: 'bangus',
  tilapia: 'tilapia',
  fish: 'tilapia',
  freshfish: 'tilapia',
  wholefish: 'tilapia',
  freshtuna: 'tilapia',
  tinapa: 'tuyo',
  driedherring: 'tuyo',
  shrimp: 'shrimp',
  shrimppaste: 'bagoong',
  bagoongalamang: 'bagoong',
  garlic: 'garlic',
  onion: 'onion',
  tomato: 'tomato',
  ginger: 'ginger',
  kangkong: 'kangkong',
  radish: 'labanos',
  eggplant: 'eggplant',
  stringbeans: 'sitaw',
  bittermelon: 'ampalaya',
  chayote: 'sayote',
  chilileaves: 'siliLeaves',
  pechay: 'pechay',
  cabbage: 'cabbage',
  potato: 'potato',
  carrots: 'carrot',
  bellpepper: 'bellPepper',
  corn: 'corn',
  banana: 'banana',
  calamansi: 'calamansi',
  scallions: 'scallion',
  lemongrass: 'lemongrass',
  pineapple: 'pineapple',
  taro: 'gabi',
  egg: 'egg',
  duckegg: 'saltedEgg',
  saltedegg: 'saltedEgg',
  evaporatedmilk: 'evap',
  rice: 'rice',
  leftoverrice: 'rice',
  garlicrice: 'rice',
  glutinousrice: 'malagkit',
  oats: 'oats',
  pandesal: 'pandesal',
  ricenoodles: 'bihon',
  eggnoodles: 'bihon',
  fresheggnoodles: 'bihon',
  mungbeans: 'munggo',
  sweetenedbeans: 'munggo',
  tofu: 'tofu',
  tablea: 'tablea',
  brownsugar: 'sugar',
  muscovadosugar: 'sugar',
  cookingoil: 'oil',
  coconutmilk: 'gata',
  peanutbutter: 'peanutButter',
  peanutsauce: 'peanutButter',
  soysauce: 'soy',
  vinegar: 'vinegar',
  tamarind: 'sinigangMix',
  tomatosauce: 'tomatoSauce',
  currypowder: 'curry',
  bananaketchup: 'ketchup',
  bayleaves: 'bayLeaf',
  greenpapaya: 'atchara',
};

export function getIngredientIcon(ingredient) {
  const value = typeof ingredient === 'string' ? ingredient : '';
  const normalized = normalize(value);
  const alias = Object.keys(API_ALIASES)
    .sort((a, b) => b.length - a.length)
    .find((candidate) => normalized.includes(candidate));
  const key =
    (ICONS[normalized] && normalized) ||
    NAME_TO_KEY[normalized] ||
    API_ALIASES[normalized] ||
    (alias && API_ALIASES[alias]);
  return (key && ICONS[key]) || NeutralDot;
}

export default function IngredientIcon({ ingredientKey, name = '', ...props }) {
  const Icon = getIngredientIcon(ingredientKey || name);
  return <Icon {...props} />;
}
