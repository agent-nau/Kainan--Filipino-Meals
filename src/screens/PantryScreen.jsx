import React from 'react';
import { View, Text, TextInput } from 'react-native';
import { Button, Chip, text } from '../ui';
import { Screen } from '../layout';
import { PantryPicker, BASICS } from '../pickers';
import { colors } from '../theme';
import { ING } from '../data/ingredients';

export default function PantryScreen({ pantry = [], setPantry }) {
  const [search, setSearch] = React.useState('');
  const [selectedOnly, setSelectedOnly] = React.useState(false);
  const [pantryFeedback, setPantryFeedback] = React.useState('');
  const safePantry = Array.isArray(pantry) ? pantry.filter((key) => ING[key]) : [];
  const matchingCount = Object.values(ING).filter((ingredient) => {
    const matchesQuery = ingredient.name.toLowerCase().includes(search.trim().toLowerCase());
    if (!matchesQuery) return false;
    return !selectedOnly || safePantry.some((key) => ING[key] === ingredient);
  }).length;
  const addBasics = () => {
    const validBasics = BASICS.filter((key) => ING[key]);
    const existing = new Set(safePantry);
    const missing = validBasics.filter((key) => !existing.has(key));

    setSearch('');
    setSelectedOnly(false);
    if (!missing.length) {
      setPantryFeedback('Your pantry already has all the basics.');
      return;
    }

    setPantry([...safePantry, ...missing]);
    setPantryFeedback(`${missing.length} pantry staples added.`);
  };

  return (
    <Screen title="Pantry" subtitle="What's already in your kitchen? We'll leave it off your grocery list.">
      <View style={{ flexDirection: 'row', marginBottom: 12 }}>
        <View style={{ flex: 1, marginRight: 8 }}>
          <Button
            title="Add the basics"
            variant="secondary"
            onPress={addBasics}
          />
        </View>
        <View style={{ flex: 1 }}>
          <Button title="Clear all" variant="secondary" disabled={!safePantry.length} onPress={() => setPantry([])} />
        </View>
      </View>
      <Text style={[text.muted, { marginBottom: 8 }]}>{safePantry.length} items at home</Text>
      {!!pantryFeedback && (
        <Text accessibilityRole="status" style={{ color: colors.green, fontWeight: '600', marginBottom: 10 }}>
          {pantryFeedback}
        </Text>
      )}
      <TextInput
        value={search}
        onChangeText={setSearch}
        placeholder="Search ingredients"
        placeholderTextColor={colors.muted}
        accessibilityLabel="Search pantry ingredients"
        returnKeyType="search"
        style={{
          color: colors.text,
          backgroundColor: colors.input,
          borderColor: colors.border,
          borderWidth: 1,
          borderRadius: 12,
          padding: 12,
          marginBottom: 10,
        }}
      />
      <Chip
        label={selectedOnly ? 'Showing items at home' : 'Show only items at home'}
        selected={selectedOnly}
        onPress={() => setSelectedOnly((current) => !current)}
      />
      {matchingCount ? (
        <PantryPicker value={safePantry} onChange={setPantry} search={search} selectedOnly={selectedOnly} />
      ) : (
        <Text style={[text.muted, { marginTop: 16 }]}>
          {selectedOnly ? 'No pantry items match. Turn off this filter or add ingredients below.' : 'No ingredients found.'}
        </Text>
      )}
    </Screen>
  );
}
