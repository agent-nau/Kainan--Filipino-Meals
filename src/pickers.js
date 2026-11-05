import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Check } from 'lucide-react-native';
import { colors, formatMoney } from './theme';
import { Chip, Stepper, text } from './ui';
import { DIETS, ALLERGENS, MARKETS, getMarket, getStores } from './planner';
import { ING, CATEGORIES } from './data/ingredients';
import { getIngredientIcon } from './IngredientIcon';

// Common pantry staples used as the pantry starting point.
export const BASICS = ['rice', 'garlic', 'onion', 'oil', 'soy', 'vinegar', 'sugar', 'bayLeaf', 'ketchup'];

export function MarketPicker({ value, onChange }) {
  const st = makeStyles();
  return (
    <View>
      <Text style={text.h1}>Where do you shop?</Text>
      <Text style={[text.muted, { marginTop: 4, marginBottom: 12 }]}>
        Choose your country so budgets and grocery estimates use your local currency and supermarkets.
      </Text>
      {MARKETS.map((market) => {
        const selected = value === market.id;
        return (
          <TouchableOpacity
            key={market.id}
            style={[st.row, selected && st.rowOn]}
            onPress={() => onChange(market)}
          >
            <View style={[st.radio, selected && st.radioOn]} />
            <View style={{ flex: 1 }}>
              <Text style={text.body}>{market.label}</Text>
              <Text style={text.muted}>{market.currency} · {formatMoney(market.budget, market.id, market.currency)} / week default</Text>
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

export function PantryPicker({ value = [], onChange, search = '', selectedOnly = false }) {
  const st = makeStyles();
  const pantry = Array.isArray(value) ? value : [];
  const have = new Set(pantry);
  const query = search.trim().toLowerCase();
  const toggle = (k) => onChange((current) => {
    const next = new Set(Array.isArray(current) ? current : []);
    if (next.has(k)) next.delete(k);
    else next.add(k);
    return [...next];
  });
  return (
    <View>
      {Object.keys(CATEGORIES).map((cat) => {
        const keys = Object.keys(ING).filter((k) => {
          const matchesCategory = ING[k].cat === cat;
          const matchesQuery = !query || ING[k].name.toLowerCase().includes(query);
          const matchesSelection = !selectedOnly || have.has(k);
          return matchesCategory && matchesQuery && matchesSelection;
        });
        if (!keys.length) return null;
        return (
          <View key={cat}>
            <Text style={[text.h2, { marginTop: 8 }]}>{CATEGORIES[cat]}</Text>
            <View style={st.pantryGrid}>
              {keys.map((k) => (
                <TouchableOpacity
                  key={k}
                  activeOpacity={0.78}
                  onPress={() => toggle(k)}
                  accessibilityRole="checkbox"
                  accessibilityState={{ checked: have.has(k) }}
                  accessibilityLabel={`${ING[k].name}, ${have.has(k) ? 'at home' : 'not at home'}`}
                  style={[st.pantryTile, have.has(k) && st.pantryTileSelected]}
                >
                  <View style={st.pantryTileContent}>
                    <View style={st.pantryTileTop}>
                      {React.createElement(getIngredientIcon(k), {
                        size: 24,
                        color: have.has(k) ? colors.green : colors.primary,
                      })}
                      <View style={[st.pantryCheck, have.has(k) && st.pantryCheckSelected]}>
                        {have.has(k) && <Check size={13} color={colors.onPrimary} strokeWidth={3} />}
                      </View>
                    </View>
                    <Text numberOfLines={2} style={[st.pantryName, have.has(k) && st.pantryNameSelected]}>
                      {ING[k].name}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        );
      })}
    </View>
  );
}

export function DietPicker({ diet, allergens, onChange }) {
  const st = makeStyles();
  const toggle = (id) =>
    onChange({ allergens: allergens.includes(id) ? allergens.filter((a) => a !== id) : [...allergens, id] });
  const current = DIETS.find((d) => d.id === diet);
  return (
    <View>
      <Text style={text.h2}>Diet</Text>
      <View style={st.wrap}>
        {DIETS.map((d) => (
          <Chip key={d.id} label={d.label} selected={diet === d.id} onPress={() => onChange({ diet: d.id })} />
        ))}
      </View>
      {!!(current && current.note) && <Text style={[text.muted, { marginBottom: 12 }]}>{current.note}</Text>}
      <Text style={[text.h2, { marginTop: 8 }]}>Allergies</Text>
      <View style={st.wrap}>
        {ALLERGENS.map((a) => (
          <Chip key={a.id} label={a.label} selected={allergens.includes(a.id)} onPress={() => toggle(a.id)} />
        ))}
      </View>
    </View>
  );
}

export function TargetsPicker({ value, onChange }) {
  const market = getMarket(value.market);
  const uk = market.id === 'uk';
  const perPersonDay = value.budget / Math.max(1, value.people) / 7;
  return (
    <View>
      <Text style={text.h2}>Your targets</Text>
      <Stepper
        label="Calories per day"
        value={value.calories}
        step={100}
        min={1200}
        max={3500}
        format={(v) => v + ' kcal'}
        onChange={(v) => onChange({ calories: v })}
      />
      <Stepper
        label="People eating"
        value={value.people}
        min={1}
        max={8}
        onChange={(v) => onChange({ people: v })}
      />
      <Stepper
        label="Grocery budget / week"
        value={value.budget}
        step={uk ? 5 : 250}
        min={uk ? 20 : 1000}
        max={uk ? 500 : 30000}
        format={(amount) => formatMoney(amount, market.id, value.currency)}
        onChange={(v) => onChange({ budget: v })}
      />
      <Text style={text.muted}>≈ {formatMoney(perPersonDay, market.id, value.currency)} per person per day</Text>
    </View>
  );
}

export function StorePicker({ value, stores: selectedStores = [], market, onChange }) {
  const st = makeStyles();
  const stores = getStores(market);
  return (
    <View>
      <Text style={text.h2}>Where do you usually shop?</Text>
      <Text style={[text.muted, { marginBottom: 8 }]}>Choose all that apply.</Text>
      {stores.map((s) => {
        const on = selectedStores.length ? selectedStores.includes(s.id) : value === s.id;
        const toggle = () => {
          if (!selectedStores.length) {
            onChange({ store: s.id, stores: [s.id] });
            return;
          }
          const next = on ? selectedStores.filter((id) => id !== s.id) : [...selectedStores, s.id];
          if (next.length) onChange({ stores: next, store: next.includes(value) ? value : next[0] });
        };
        return (
          <TouchableOpacity key={s.id} style={[st.row, on && st.rowOn]} onPress={toggle}>
            <View style={[st.radio, on && st.radioOn]} />
            <View style={{ flex: 1 }}>
              <Text style={text.body}>{s.label}</Text>
              {!!s.note && <Text style={text.muted}>{s.note}</Text>}
            </View>
          </TouchableOpacity>
        );
      })}
      <Text style={[text.muted, { marginTop: 6 }]}>
        Store price differences are rough estimates, not live shelf prices.
      </Text>
    </View>
  );
}

function makeStyles() {
  return StyleSheet.create({
  wrap: { flexDirection: 'row', flexWrap: 'wrap' },
  pantryGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  pantryTile: {
    width: '48%',
    minHeight: 88,
    marginBottom: 10,
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
  },
  pantryTileSelected: { backgroundColor: colors.greenBg, borderColor: colors.green },
  pantryTileContent: { flex: 1 },
  pantryTileTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 },
  pantryName: { color: colors.text, fontSize: 14, fontWeight: '600', lineHeight: 18 },
  pantryNameSelected: { color: colors.text, fontWeight: '700' },
  pantryCheck: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 5,
  },
  pantryCheckSelected: { backgroundColor: colors.green, borderColor: colors.green },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
    marginBottom: 8,
  },
  rowOn: { borderColor: colors.primary, backgroundColor: colors.selected },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.border,
    marginRight: 12,
  },
  radioOn: { borderColor: colors.primary, backgroundColor: colors.primary },
  });
}
