import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, formatMoney } from '../theme';
import { Button, Card, text } from '../ui';
import { Screen, Pill } from '../layout';
import { ING } from '../data/ingredients';
import { SLOT_LABEL, DAYS, getMeal, pantryShare, storeMult } from '../planner';
import { fmtQty, pluralUnit } from '../shopping';
import { Check, Heart, RefreshCw, X } from 'lucide-react-native';
import IngredientIcon from '../IngredientIcon';

const FRACTIONS = ['', '¼', '½', '¾'];

// Amounts shown on a recipe are for the whole household, so keep them readable.
function amount(q, unit, units) {
  if (unit === 'g' || unit === 'ml') return fmtQty(Math.max(5, Math.round(q / 5) * 5), unit, units);
  let whole = Math.floor(q + 1e-9);
  let idx = Math.round((q - whole) * 4);
  if (idx === 4) {
    whole += 1;
    idx = 0;
  }
  const str = (whole > 0 ? String(whole) : '') + FRACTIONS[idx] || '¼';
  return (str || '¼') + ' ' + pluralUnit(unit, q);
}

export default function MealDetail({ detail, settings, pantry, favorites = [], setFavorites, onBack, onSwap }) {
  const s = makeStyles();
  const meal = detail.mealId ? getMeal(detail.mealId) : null;
  if (!meal) return null;
  const have = new Set(pantry);
  const mult = storeMult(settings);
  const people = Math.max(1, settings.people);
  const share = meal ? pantryShare(meal, have) : 0;
  const fromPlan = detail.day != null && detail.slot;
  const favoriteId = meal.id;
  const isFavorite = favoriteId && favorites.includes(favoriteId);

  return (
    <Screen
      title={meal.name}
      subtitle={(fromPlan ? DAYS[detail.day] + ' · ' : '') + SLOT_LABEL[meal.slot] + ' · ' + meal.kcal + ' kcal per serving'}
      right={
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          {!!favoriteId && (
            <TouchableOpacity
              onPress={() => setFavorites?.(isFavorite ? favorites.filter((id) => id !== favoriteId) : [...favorites, favoriteId])}
              style={{ padding: 8 }}
              accessibilityLabel={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            >
              <Heart size={20} color={isFavorite ? colors.primary : colors.muted} fill={isFavorite ? colors.primary : 'transparent'} />
            </TouchableOpacity>
          )}
          <TouchableOpacity onPress={onBack} style={{ padding: 4 }}>
            <X size={22} color={colors.muted} />
          </TouchableOpacity>
        </View>
      }
    >
      <>
          <Card>
            <View style={s.stats}>
              <View style={s.stat}>
                <Text style={s.statVal}>{formatMoney(meal.cost * mult, settings.market, settings.currency)}</Text>
                <Text style={text.muted}>per serving</Text>
              </View>
              <View style={s.stat}>
                <Text style={s.statVal}>{formatMoney(meal.cost * mult * people, settings.market, settings.currency)}</Text>
                <Text style={text.muted}>for {people} {people === 1 ? 'person' : 'people'}</Text>
              </View>
              <View style={s.stat}>
                <Text style={s.statVal}>{meal.prepTime + meal.cookTime} min</Text>
                <Text style={text.muted}>est. prep + cook</Text>
              </View>
            </View>
            <View style={s.stats}>
              <View style={s.stat}>
                <Text style={s.statVal}>{Math.round(share * 100)}%</Text>
                <Text style={text.muted}>already home</Text>
              </View>
              <View style={s.stat}>
                <Text style={s.statVal}>{meal.abroadFriendlyRating}/5</Text>
                <Text style={text.muted}>abroad-friendly</Text>
              </View>
              <View style={s.stat}>
                <Text style={s.statVal}>{meal.servings}</Text>
                <Text style={text.muted}>servings per recipe</Text>
              </View>
            </View>
            <Text style={[text.muted, { marginTop: 10 }]}>Region: {meal.region.join(', ')} · Kitchen: {meal.equipment.join(', ')}</Text>
            {meal.tags.length > 0 && (
              <View style={s.pills}>
                {meal.tags.map((t) => (
                  <Pill key={t} label={'contains ' + t} />
                ))}
              </View>
            )}
          </Card>

          <Text style={text.h2}>Ingredients for {people}</Text>
          <Card>
            {Object.entries(meal.items).map(([k, q], i) => {
              const ing = ING[k];
              const inPantry = have.has(k);
              return (
                <View key={k} style={[s.ingRow, i > 0 && s.ingBorder]}>
                  <IngredientIcon ingredientKey={k} size={17} color={colors.primary} />
                  <Text style={[text.body, { flex: 1, marginLeft: 8 }]}>{ing.name}</Text>
                  <Text style={[text.muted, { marginRight: 10 }]}>{amount(q * people, ing.unit, settings.units)}</Text>
                  <View style={s.badge}>
                    {inPantry && <Check size={13} color={colors.green} />}
                    <Text style={[s.badgeText, inPantry && { color: colors.green }]}>{inPantry ? 'have' : 'buy'}</Text>
                  </View>
                </View>
              );
            })}
          </Card>
          <Text style={text.h2}>How to make it</Text>
          <Card>
            {meal.steps.map((step, index) => (
              <View key={`${meal.id}-step-${index}`} style={s.stepRow}>
                <View style={s.stepNumber}><Text style={s.stepNumberText}>{index + 1}</Text></View>
                <Text style={[text.body, { flex: 1 }]}>{step}</Text>
              </View>
            ))}
          </Card>
          <Card>
            <Text style={s.tipTitle}>Tipid hack</Text>
            <Text style={text.body}>{meal.tips.tipid}</Text>
            {settings.market !== 'philippines' && (
              <>
                <Text style={[s.tipTitle, { marginTop: 12 }]}>Kung abroad ka</Text>
                <Text style={text.body}>{meal.tips.abroad}</Text>
              </>
            )}
          </Card>
          <Text style={[text.muted, { marginBottom: 16 }]}>
            Prep and cook times, calories and prices are estimates. Check labels. We can't guarantee allergen safety.
          </Text>
      </>

      {fromPlan && <Button title="Swap this meal" icon={RefreshCw} variant="secondary" onPress={onSwap} style={{ marginBottom: 8 }} />}
      <Button title="Back" variant="ghost" onPress={onBack} />
    </Screen>
  );
}

function makeStyles() {
  return StyleSheet.create({
  stats: { flexDirection: 'row', justifyContent: 'space-between' },
  stat: { flex: 1, alignItems: 'center' },
  statVal: { fontSize: 18, fontWeight: '800', color: colors.text },
  pills: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 12 },
  ingRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10 },
  ingBorder: { borderTopWidth: 1, borderTopColor: colors.border },
  badge: { width: 48, flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', gap: 2 },
  badgeText: { fontSize: 12, fontWeight: '700', color: colors.muted },
  stepRow: { flexDirection: 'row', alignItems: 'flex-start', marginVertical: 6 },
  stepNumber: { width: 26, height: 26, borderRadius: 13, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.greenBg, marginRight: 10 },
  stepNumberText: { color: colors.green, fontWeight: '800', fontSize: 13 },
  tipTitle: { fontSize: 14, color: colors.green, fontWeight: '800', marginBottom: 5 },
  });
}
