import React, { useMemo, useState } from 'react';
import { Text, TextInput, TouchableOpacity, View, StyleSheet } from 'react-native';
import { BookOpen, Search } from 'lucide-react-native';
import IngredientIcon from '../IngredientIcon';
import { colors, formatMoney } from '../theme';
import { Card, Chip, text } from '../ui';
import { Screen, Empty } from '../layout';
import { MEALS } from '../data/meals';
import { storeMult } from '../planner';

export default function RecipesScreen({ onOpenMeal, settings, favorites = [] }) {
  const s = makeStyles();
  const [query, setQuery] = useState('');
  const [slot, setSlot] = useState('all');
  const [favoritesOnly, setFavoritesOnly] = useState(false);

  const rows = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return MEALS.filter((meal) => {
      const searchText = [
        meal.name,
        meal.titleEnglish,
        ...Object.keys(meal.items),
        ...meal.region,
        ...meal.vibes,
      ].join(' ').toLowerCase();
      return (
        (!needle || searchText.includes(needle)) &&
        (slot === 'all' || meal.slot === slot) &&
        (!favoritesOnly || favorites.includes(meal.id))
      );
    });
  }, [query, slot, favoritesOnly, favorites]);

  return (
    <Screen title="Recipes" subtitle={`${MEALS.length} Filipino home-cooking recipes · ingredients with icons`}>
      <View style={s.wrap}>
        <Chip label="All recipes" selected={!favoritesOnly} onPress={() => setFavoritesOnly(false)} />
        <Chip label="Favorites" selected={favoritesOnly} onPress={() => setFavoritesOnly(true)} />
      </View>
      <View style={s.search}>
        <Search size={18} color={colors.muted} />
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Search meals, regions or ingredients…"
          placeholderTextColor={colors.muted}
          style={s.input}
          autoCorrect={false}
          accessibilityLabel="Search recipes"
        />
      </View>
      <View style={s.wrap}>
        {[
          ['all', 'All'],
          ['breakfast', 'Almusal'],
          ['lunch', 'Tanghalian'],
          ['dinner', 'Hapunan'],
          ['merienda', 'Merienda'],
        ].map(([id, label]) => (
          <Chip key={id} label={label} selected={slot === id} onPress={() => setSlot(id)} />
        ))}
      </View>
      <Text style={[text.muted, { marginBottom: 10 }]}>{rows.length} recipes</Text>
      {rows.length === 0 ? (
        <Empty icon={Search} title="No recipes found" body="Try another search or save a recipe as a favorite." />
      ) : (
        rows.map((meal) => (
          <TouchableOpacity key={meal.id} activeOpacity={0.75} onPress={() => onOpenMeal(meal.id)}>
            <Card style={s.recipeCard}>
              <View style={s.colorBlock}>
                <BookOpen size={24} color={colors.green} />
                <Text style={s.englishName}>{meal.titleEnglish}</Text>
              </View>
              <Text style={[text.body, s.dishName]}>{meal.name}</Text>
              <Text style={[text.muted, { marginTop: 3 }]}>
                {meal.prepTime} min prep · {meal.cookTime} min cook · {formatMoney(meal.cost * storeMult(settings), settings.market, settings.currency)}
              </Text>
              <View style={s.ingredientList}>
                {Object.keys(meal.items).slice(0, 5).map((key) => (
                  <View key={key} style={s.ingredient}>
                    <IngredientIcon ingredientKey={key} size={16} color={colors.green} />
                    <Text style={s.ingredientText}>{key.replace(/[A-Z]/g, (letter) => ` ${letter.toLowerCase()}`)}</Text>
                  </View>
                ))}
              </View>
              <Text style={[text.muted, { marginTop: 8 }]}>
                {meal.region.join(' · ')} · {meal.abroadFriendlyRating}/5 abroad-friendly
              </Text>
            </Card>
          </TouchableOpacity>
        ))
      )}
    </Screen>
  );
}

function makeStyles() {
  return StyleSheet.create({
  search: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 12,
    marginBottom: 12,
  },
  input: { flex: 1, paddingHorizontal: 8, paddingVertical: 12, fontSize: 15, color: colors.text },
  wrap: { flexDirection: 'row', flexWrap: 'wrap' },
  recipeCard: { overflow: 'hidden' },
  colorBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 72,
    borderRadius: 10,
    padding: 14,
    marginBottom: 10,
    backgroundColor: colors.greenBg,
  },
  englishName: { flex: 1, marginLeft: 10, fontSize: 17, fontWeight: '800', color: colors.green },
  dishName: { fontWeight: '700', fontSize: 16 },
  ingredientList: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 10 },
  ingredient: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  ingredientText: { fontSize: 12, color: colors.muted, textTransform: 'capitalize' },
  });
}
