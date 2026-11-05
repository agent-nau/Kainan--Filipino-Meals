import React, { useMemo } from 'react';
import { Alert, View, Text, TouchableOpacity, Share, StyleSheet } from 'react-native';
import { colors, formatMoney, APP_NAME } from '../theme';
import { Button, Card, text } from '../ui';
import { Screen, ProgressBar, Empty } from '../layout';
import { getStores } from '../planner';
import { buildShopping, SUBSTITUTIONS } from '../shopping';
import { ING } from '../data/ingredients';
import { Check, PackageCheck, ShoppingCart } from 'lucide-react-native';
import IngredientIcon from '../IngredientIcon';

export default function GroceryScreen({ plan, settings, setSettings, pantry, checked, setChecked, onGoPlan }) {
  const s = makeStyles();
  const list = useMemo(() => buildShopping(plan, settings, pantry), [plan, settings, pantry]);
  const stores = getStores(settings.market);
  const store = stores.find((x) => x.id === settings.store) || stores[0];

  if (!plan || !plan.days) {
    return (
      <Screen title="Grocery list" subtitle="Pamilihin">
        <Empty icon={ShoppingCart} title="Nothing to buy yet" body="Make a weekly plan and your list shows up here.">
          <Button title="Go to plan" onPress={onGoPlan} />
        </Empty>
      </Screen>
    );
  }

  const items = list.sections.flatMap((sec) => sec.items);
  const done = items.filter((it) => checked[it.key]).length;
  const remaining = items.reduce((t, it) => t + (checked[it.key] ? 0 : it.cost), 0);
  const toggle = (k) => setChecked({ ...checked, [k]: !checked[k] });

  const share = async () => {
    const lines = [APP_NAME + ' grocery list (' + store.label + ')', ''];
    list.sections.forEach((sec) => {
      lines.push(sec.label.toUpperCase());
      sec.items.forEach((it) => lines.push((checked[it.key] ? '☑ ' : '☐ ') + it.name + ' – ' + it.label));
      lines.push('');
    });
    lines.push('Estimated total: ' + formatMoney(list.total, settings.market, settings.currency));
    try {
      await Share.share({ message: lines.join('\n') });
    } catch (error) {
      console.error('Unable to share the grocery list.', error);
      Alert.alert('Could not share the list', 'Please try again or copy the items manually.');
    }
  };

  const chooseSubstitution = (key) => {
    const substitution = SUBSTITUTIONS[key];
    if (!substitution) return;
    Alert.alert(
      `${substitution.title} wala sa store?`,
      'Use this swap in this and future shopping lists? You can change it later.',
      [
        ...substitution.options.map((option) => ({
          text: option.label,
          onPress: () => setSettings({
            ...settings,
            substitutions: { ...(settings.substitutions || {}), [key]: option.id },
          }),
        })),
        {
          text: 'Use original ingredient',
          onPress: () => {
            const next = { ...(settings.substitutions || {}) };
            delete next[key];
            setSettings({ ...settings, substitutions: next });
          },
        },
        { text: 'Cancel', style: 'cancel' },
      ],
    );
  };

  return (
    <Screen title="Grocery list" subtitle={'Pamilihin · ' + store.label}>
      <Card>
        <View style={s.row}>
          <View>
            <Text style={text.muted}>Estimated total</Text>
            <Text style={s.big}>{formatMoney(list.total, settings.market, settings.currency)}</Text>
            <Text style={text.muted}>Budget: {formatMoney(settings.budget, settings.market, settings.currency)}</Text>
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={text.muted}>Still to buy</Text>
            <Text style={s.mid}>{formatMoney(remaining, settings.market, settings.currency)}</Text>
          </View>
        </View>
        <ProgressBar value={done} max={Math.max(1, items.length)} />
        <Text style={[text.muted, { marginTop: 8 }]}>
          {done} of {items.length} items checked
          {pantry.length ? ' · pantry items left off' : ''}
        </Text>
      </Card>

      {items.length === 0 ? (
        <Empty icon={PackageCheck} title="You already have everything" body="Your pantry covers this whole plan." />
      ) : (
        list.sections.map((sec) => (
          <View key={sec.cat}>
            <Text style={[text.h2, { marginTop: 4 }]}>{sec.label}</Text>
            <Card style={{ paddingVertical: 4 }}>
              {sec.items.map((it, i) => {
                const on = !!checked[it.key];
                return (
                  <TouchableOpacity
                    key={it.key}
                    activeOpacity={0.7}
                    onPress={() => toggle(it.key)}
                    style={[s.item, i > 0 && s.itemBorder]}
                  >
                    <View style={[s.box, on && s.boxOn]}>{on && <Check size={16} color={colors.onPrimary} strokeWidth={3} />}</View>
                    <View style={{ flex: 1 }}>
                      <View style={s.itemName}>
                        <IngredientIcon ingredientKey={it.key} size={16} color={colors.primary} />
                        <Text style={[text.body, on && s.struck]}>{it.name}</Text>
                      </View>
                      <Text style={text.muted}>{it.label}</Text>
                      {it.substitutedFrom.length > 0 && (
                        <Text style={s.swapNote}>
                          {`Instead of ${it.substitutedFrom.map((key) => ING[key]?.name || key).join(', ')}`}
                        </Text>
                      )}
                      {SUBSTITUTIONS[it.key] && (
                        <TouchableOpacity onPress={() => chooseSubstitution(it.key)} accessibilityRole="button">
                          <Text style={s.swapLink}>Wala sa store? Find a swap</Text>
                        </TouchableOpacity>
                      )}
                    </View>
                    <Text style={[text.muted, on && s.struck]}>{formatMoney(it.cost, settings.market, settings.currency)}</Text>
                  </TouchableOpacity>
                );
              })}
            </Card>
          </View>
        ))
      )}

      <Text style={[text.muted, { marginBottom: 14 }]}>
        Rough estimates for {store.label}, not live prices. Check shelf prices in store.
      </Text>
      <Button title="Share list" onPress={share} style={{ marginBottom: 8 }} />
      {done > 0 && <Button title="Clear checkmarks" variant="ghost" onPress={() => setChecked({})} />}
    </Screen>
  );
}

function makeStyles() {
  return StyleSheet.create({
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
  big: { fontSize: 30, fontWeight: '800', color: colors.text },
  mid: { fontSize: 18, fontWeight: '700', color: colors.text },
  item: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12 },
  itemName: { flexDirection: 'row', alignItems: 'center', gap: 7 },
  itemBorder: { borderTopWidth: 1, borderTopColor: colors.border },
  box: {
    width: 24,
    height: 24,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: colors.border,
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  boxOn: { backgroundColor: colors.green, borderColor: colors.green },
  struck: { textDecorationLine: 'line-through', opacity: 0.5 },
  swapNote: { fontSize: 12, color: colors.green, marginTop: 3 },
  swapLink: { fontSize: 12, color: colors.primary, fontWeight: '700', marginTop: 4 },
  });
}
