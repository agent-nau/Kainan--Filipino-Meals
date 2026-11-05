import React, { useMemo, useState } from 'react';
import { Alert, Share, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, formatMoney } from '../theme';
import { Button, Card, text } from '../ui';
import { Screen, ProgressBar, Empty } from '../layout';
import { SLOT_LABEL, DAYS, getMeal, dayCalories, eligibleMeals, storeMult, planSlots } from '../planner';
import { buildShopping } from '../shopping';
import { Cookie, Lock, Moon, RefreshCw, Sun, Sunrise, Utensils, Unlock } from 'lucide-react-native';

const todayIdx = () => (new Date().getDay() + 6) % 7;
const SLOT_ICON = { breakfast: Sunrise, lunch: Sun, dinner: Moon, merienda: Cookie };

export default function PlanScreen({ plan, planError, settings, pantry, onGenerate, onOpenMeal, onSwap, onToggleLock, onSettingsChange }) {
  const s = makeStyles();
  const [day, setDay] = useState(todayIdx());
  const shopping = useMemo(() => buildShopping(plan, settings, pantry), [plan, settings, pantry]);

  // True when the plan holds a meal the current diet/allergy filters would not allow.
  const stale = useMemo(() => {
    if (!plan || !plan.days) return false;
    return plan.days.some((dayPlan, dayIndex) =>
      planSlots(settings).some((slot) => {
        const noMeat = settings.vibes?.includes('lenten') && dayIndex === 4;
        const allowed = new Set(eligibleMeals(settings, slot, { noMeat }).map((meal) => meal.id));
        return !allowed.has(dayPlan[slot]);
      }),
    );
  }, [plan, settings]);

  if (!plan || !plan.days) {
    return (
      <Screen title={settings.name ? `Kain na, ${settings.name}!` : 'Weekly plan'} subtitle="Ang kakainin mo ngayong linggo">
        <Empty
          icon={Utensils}
          title="No plan yet"
          body={planError || 'Generate a week of meals that fits your budget, diet and pantry.'}
        >
          <Button title="Generate my week" onPress={onGenerate} />
        </Empty>
      </Screen>
    );
  }

  const mult = storeMult(settings);
  const days = plan.days;
  const avgKcal = Math.round(days.reduce((s, d) => s + dayCalories(d), 0) / days.length);
  const over = shopping.total - settings.budget;
  const cur = days[day];
  const sharePlan = async () => {
    const lines = [`Kainan week plan${settings.name ? ` for ${settings.name}` : ''}`, ''];
    days.forEach((dayPlan, index) => {
      lines.push(DAYS[index]);
      planSlots(settings).forEach((slot) => {
        const meal = getMeal(dayPlan[slot]);
        if (meal) lines.push(`  ${SLOT_LABEL[slot]}: ${meal.name}`);
      });
      lines.push('');
    });
    try {
      await Share.share({ message: lines.join('\n') });
    } catch (error) {
      console.error('Unable to share the weekly meal plan.', error);
      Alert.alert('Could not share the plan', 'Please try again.');
    }
  };

  return (
    <Screen title="Weekly plan" subtitle="Ang kakainin mo ngayong linggo">
      {stale && (
        <Card style={{ backgroundColor: colors.selected, borderWidth: 1, borderColor: colors.primary }}>
          <Text style={[text.body, { fontWeight: '700' }]}>Your plan no longer matches your diet</Text>
          <Text style={[text.muted, { marginVertical: 6 }]}>
            Some meals conflict with your current diet or allergy settings. Rebuild to fix it.
          </Text>
          <Button title="Rebuild plan" onPress={onGenerate} />
        </Card>
      )}

      <Card>
        <View style={s.row}>
          <View>
            <Text style={text.muted}>Estimated grocery bill</Text>
            <Text style={s.big}>{formatMoney(shopping.total, settings.market, settings.currency)}</Text>
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={text.muted}>Weekly budget</Text>
            <Text style={s.mid}>{formatMoney(settings.budget, settings.market, settings.currency)}</Text>
          </View>
        </View>
        <ProgressBar value={shopping.total} max={settings.budget} />
        <Text style={[text.muted, { marginTop: 8 }, over > 0 && { color: colors.red }]}>
          {over > 0
            ? formatMoney(over, settings.market, settings.currency) + ' over budget. Try regenerating, or pick a cheaper store.'
            : formatMoney(-over, settings.market, settings.currency) + ' left in your budget'}
        </Text>
        <Text style={[text.muted, { marginTop: 4 }]}>
          Avg {avgKcal} kcal/day per person · target {settings.calories}
          {pantry.length ? ' · pantry items already taken out' : ''}
        </Text>
      </Card>

      <View style={s.dayRow}>
        {DAYS.map((d, i) => (
          <TouchableOpacity key={d} style={[s.day, i === day && s.dayOn]} onPress={() => setDay(i)}>
            <Text style={[s.dayText, i === day && { color: colors.onPrimary }]}>{d}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity
        accessibilityRole="switch"
        accessibilityState={{ checked: !!settings.dinnersOnly }}
        style={s.viewToggle}
        onPress={() => onSettingsChange({ dinnersOnly: !settings.dinnersOnly })}
      >
        <Text style={s.viewToggleText}>{settings.dinnersOnly ? 'Dinner-only view · tap for all meals' : 'Show dinners only'}</Text>
      </TouchableOpacity>

      {(settings.dinnersOnly ? ['dinner'] : planSlots(settings)).map((slot) => {
        const meal = getMeal(cur[slot]);
        if (!meal) return null;
        const locked = (plan.locked || []).includes(`${day}_${slot}`);
        return (
          <Card key={slot}>
            <TouchableOpacity activeOpacity={0.7} onPress={() => onOpenMeal(day, slot)}>
              <View style={s.slotRow}>
                {React.createElement(SLOT_ICON[slot], { size: 15, color: colors.primary })}
                <Text style={s.slot}>{SLOT_LABEL[slot].toUpperCase()}</Text>
              </View>
              <Text style={[text.body, { fontWeight: '700', fontSize: 17, marginTop: 4 }]}>{meal.name}</Text>
              <Text style={[text.muted, { marginTop: 2 }]}>
                {meal.kcal} kcal · {formatMoney(meal.cost * mult, settings.market, settings.currency)} per serving
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={s.swap} disabled={locked} onPress={() => onSwap(day, slot)}>
              <View style={s.swapContent}>
                <RefreshCw size={14} color={colors.primary} />
                <Text style={s.swapText}>{locked ? 'Locked' : 'Swap'}</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={s.lock}
              accessibilityLabel={locked ? 'Unlock this meal' : 'Keep this meal when regenerating'}
              onPress={() => onToggleLock(day, slot)}
            >
              {locked ? <Lock size={16} color={colors.green} /> : <Unlock size={16} color={colors.muted} />}
            </TouchableOpacity>
          </Card>
        );
      })}

      <Text style={[text.muted, { textAlign: 'center', marginBottom: 12 }]}>
        {DAYS[day]} total: {dayCalories(cur)} kcal per person
      </Text>
      <Button title="Make a new plan" variant="secondary" onPress={onGenerate} />
      <Button title="Share this week" variant="ghost" onPress={sharePlan} style={{ marginTop: 6 }} />
    </Screen>
  );
}

function makeStyles() {
  return StyleSheet.create({
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
  big: { fontSize: 30, fontWeight: '800', color: colors.text },
  mid: { fontSize: 18, fontWeight: '700', color: colors.text },
  dayRow: { flexDirection: 'row', marginBottom: 12 },
  day: {
    flex: 1,
    paddingVertical: 10,
    marginHorizontal: 2,
    borderRadius: 10,
    alignItems: 'center',
    backgroundColor: colors.chip,
  },
  dayOn: { backgroundColor: colors.primary },
  dayText: { fontSize: 13, fontWeight: '700', color: colors.text },
  viewToggle: { alignSelf: 'flex-end', paddingVertical: 8, paddingHorizontal: 10, marginBottom: 8, borderRadius: 10, backgroundColor: colors.greenBg },
  viewToggleText: { color: colors.green, fontWeight: '700', fontSize: 12 },
  slotRow: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  slot: { fontSize: 12, fontWeight: '800', color: colors.primary, letterSpacing: 0.6 },
  swap: { position: 'absolute', right: 12, top: 12 },
  lock: { position: 'absolute', right: 68, top: 11, padding: 2 },
  swapContent: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  swapText: { color: colors.primary, fontWeight: '700', fontSize: 14 },
  });
}
