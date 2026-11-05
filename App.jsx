import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Animated, BackHandler, Easing, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { BookOpen, CalendarDays, CookingPot, Package, Settings, ShoppingCart } from 'lucide-react-native';

import { colors } from './src/theme';
import { DEFAULTS, generatePlan, swapMeal, eligibleMeals, getMarket } from './src/planner';
import { usePersisted } from './src/storage';
import { deleteOnboardingProfile, getFirebaseErrorMessage, saveOnboardingProfile } from './src/firebaseProfile';

import Onboarding from './src/screens/Onboarding';
import PlanScreen from './src/screens/PlanScreen';
import RecipesScreen from './src/screens/RecipesScreen';
import GroceryScreen from './src/screens/GroceryScreen';
import PantryScreen from './src/screens/PantryScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import MealDetail from './src/screens/MealDetail';

const TABS = [
  { id: 'plan', label: 'Plan', icon: CalendarDays },
  { id: 'recipes', label: 'Recipes', icon: BookOpen },
  { id: 'grocery', label: 'Grocery', icon: ShoppingCart },
  { id: 'pantry', label: 'Pantry', icon: Package },
  { id: 'settings', label: 'Settings', icon: Settings },
];

function StartupScreen() {
  const pulse = React.useRef(new Animated.Value(1)).current;
  const fade = React.useRef(new Animated.Value(0)).current;
  const s = makeStyles();

  useEffect(() => {
    const entrance = Animated.timing(fade, {
      toValue: 1,
      duration: 450,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: Platform.OS !== 'web',
    });
    const breathing = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1.08, duration: 850, easing: Easing.inOut(Easing.ease), useNativeDriver: Platform.OS !== 'web' }),
        Animated.timing(pulse, { toValue: 1, duration: 850, easing: Easing.inOut(Easing.ease), useNativeDriver: Platform.OS !== 'web' }),
      ]),
    );
    entrance.start();
    breathing.start();
    return () => {
      entrance.stop();
      breathing.stop();
    };
  }, [fade, pulse]);

  return (
    <View style={[s.startup, { backgroundColor: colors.bg }]}>
      <Animated.View style={{ opacity: fade, alignItems: 'center', transform: [{ scale: pulse }] }}>
        <View style={[s.startupIcon, { backgroundColor: colors.greenBg }]}>
          <CookingPot size={46} color={colors.primary} strokeWidth={1.8} />
        </View>
        <Text style={[s.startupTitle, { color: colors.text }]}>Kainan</Text>
        <Text style={[s.startupTagline, { color: colors.muted }]}>Kain na! Plan your week, shop once.</Text>
      </Animated.View>
      <View style={s.startupLoading}>
        <ActivityIndicator color={colors.primary} />
        <Text style={[s.startupLoadingText, { color: colors.muted }]}>Setting the table…</Text>
      </View>
    </View>
  );
}

function Main() {
  const insets = useSafeAreaInsets();
  const [onboarded, setOnboarded, r1] = usePersisted('kainan.onboarded.v1', false);
  const [stored, setSettings, r2] = usePersisted('kainan.settings.v1', DEFAULTS);
  const [pantry, setPantry, r3] = usePersisted('kainan.pantry.v1', []);
  const [plan, setPlan, r4] = usePersisted('kainan.plan.v1', null);
  const [checked, setChecked, r5] = usePersisted('kainan.checked.v1', {});
  const [favorites, setFavorites, r6] = usePersisted('kainan.favorites.v1', []);
  const [planError, setPlanError] = useState(null);
  const [firebaseSyncError, setFirebaseSyncError] = useState('');
  const [firebaseSyncing, setFirebaseSyncing] = useState(false);
  const [building, setBuilding] = useState(false);
  const [tab, setTab] = useState('plan');
  const [detail, setDetail] = useState(null); // { mealId, day, slot } | null
  const s = makeStyles();

  // Fill in any settings added in later versions.
  const saved = stored || DEFAULTS;
  const savedMarket = getMarket(saved.market || saved.country || DEFAULTS.market);
  const settings = {
    ...DEFAULTS,
    ...saved,
    market: savedMarket.id,
    country: saved.country || savedMarket.id,
    currency: saved.currency || savedMarket.currency,
    units: saved.units || (savedMarket.id === 'us' ? 'imperial' : 'metric'),
    store: saved.store || savedMarket.store,
    stores: saved.stores || [saved.store || savedMarket.store],
  };

  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      if (detail) {
        setDetail(null);
        return true;
      }
      return false;
    });
    return () => sub.remove();
  }, [detail]);

  const build = useCallback(
    (cfg, pan) => {
      const res = generatePlan(cfg, pan);
      if (res.error) {
        setPlanError(res.error);
        return false;
      }
      const locks = (plan?.locked || []).filter((key) => {
        const [dayIndex, slot] = key.split('_');
        const previousMeal = plan.days[Number(dayIndex)]?.[slot];
        const noMeat = cfg.vibes?.includes('lenten') && Number(dayIndex) === 4;
        return previousMeal && eligibleMeals(cfg, slot, { noMeat }).some((meal) => meal.id === previousMeal);
      });
      locks.forEach((key) => {
        const [dayIndex, slot] = key.split('_');
        res.days[Number(dayIndex)][slot] = plan.days[Number(dayIndex)][slot];
      });
      res.locked = locks;
      setPlanError(null);
      setPlan(res);
      setChecked({});
      return true;
    },
    [plan, setPlan, setChecked]
  );

  const rebuild = () => {
    build(settings, pantry);
    setTab('plan'); // errors (e.g. filters too strict) are shown on the Plan tab
  };

  const finishOnboarding = async (cfg, pan) => {
    setBuilding(true);
    try {
      try {
        await saveOnboardingProfile(cfg);
        setFirebaseSyncError('');
      } catch (error) {
        console.error('Unable to save onboarding data to Firebase.', error);
        const message = getFirebaseErrorMessage(error);
        setFirebaseSyncError(message);
        Alert.alert('You can continue offline', message);
      }
      setSettings(cfg);
      setPantry(pan);
      build({ ...DEFAULTS, ...cfg }, pan);
      setOnboarded(true);
    } finally {
      setBuilding(false);
    }
  };

  const retryFirebaseSync = async () => {
    setFirebaseSyncing(true);
    try {
      await saveOnboardingProfile(settings);
      setFirebaseSyncError('');
    } catch (error) {
      console.error('Unable to retry the Firebase profile save.', error);
      setFirebaseSyncError(getFirebaseErrorMessage(error));
      throw new Error(getFirebaseErrorMessage(error));
    } finally {
      setFirebaseSyncing(false);
    }
  };

  const reset = async () => {
    await deleteOnboardingProfile();
    setFirebaseSyncError('');
    setSettings(DEFAULTS);
    setPantry([]);
    setPlan(null);
    setChecked({});
    setFavorites([]);
    setPlanError(null);
    setDetail(null);
    setTab('plan');
    setOnboarded(false);
  };

  const swap = (day, slot) => {
    const next = swapMeal(plan, day, slot, settings, pantry);
    setPlan(next);
    return next;
  };

  if (!(r1 && r2 && r3 && r4 && r5 && r6)) {
    return <StartupScreen />;
  }

  if (!onboarded) {
    return (
      <SafeAreaView style={s.root} edges={['top', 'bottom']}>
        <StatusBar style="light" />
        <Onboarding
          initialSettings={settings}
          onDraftChange={setSettings}
          onDone={finishOnboarding}
          busy={building}
        />
      </SafeAreaView>
    );
  }

  if (detail) {
    return (
      <SafeAreaView style={s.root} edges={['top', 'bottom']}>
        <StatusBar style="light" />
        <MealDetail
          detail={detail}
          settings={settings}
          pantry={pantry}
          favorites={favorites}
          setFavorites={setFavorites}
          onBack={() => setDetail(null)}
          onSwap={() => {
            const next = swap(detail.day, detail.slot);
            setDetail({ ...detail, mealId: next.days[detail.day][detail.slot] });
          }}
        />
      </SafeAreaView>
    );
  }

  return (
    <View style={[s.root, { backgroundColor: colors.bg }]}>
      <StatusBar style="light" />
      <SafeAreaView style={{ flex: 1 }} edges={['top']}>
        {tab === 'plan' && (
          <PlanScreen
            plan={plan}
            planError={planError}
            settings={settings}
            pantry={pantry}
            onGenerate={rebuild}
            onOpenMeal={(day, slot) => setDetail({ mealId: plan.days[day][slot], day, slot })}
            onSwap={swap}
            onSettingsChange={(change) => setSettings({ ...settings, ...change })}
            onToggleLock={(day, slot) => {
              const key = `${day}_${slot}`;
              const locks = plan.locked || [];
              setPlan({
                ...plan,
                locked: locks.includes(key) ? locks.filter((item) => item !== key) : [...locks, key],
              });
            }}
          />
        )}
        {tab === 'recipes' && (
          <RecipesScreen
            settings={settings}
            favorites={favorites}
            onOpenMeal={(mealId) => setDetail({ mealId })}
          />
        )}
        {tab === 'grocery' && (
          <GroceryScreen
            plan={plan}
            settings={settings}
            setSettings={(next) => setSettings(next)}
            pantry={pantry}
            checked={checked}
            setChecked={setChecked}
            onGoPlan={() => setTab('plan')}
          />
        )}
        {tab === 'pantry' && <PantryScreen pantry={pantry} setPantry={setPantry} />}
        {tab === 'settings' && (
          <SettingsScreen
            settings={settings}
            setSettings={setSettings}
            onRebuild={rebuild}
            onReset={reset}
            firebaseSyncError={firebaseSyncError}
            firebaseSyncing={firebaseSyncing}
            onRetryFirebaseSync={retryFirebaseSync}
          />
        )}
      </SafeAreaView>

      <View style={[s.tabBar, { backgroundColor: colors.card, borderTopColor: colors.border, paddingBottom: Math.max(insets.bottom, 8) }]}>
        {TABS.map((t) => {
          const on = tab === t.id;
          const Icon = t.icon;
          return (
            <TouchableOpacity key={t.id} style={s.tab} onPress={() => setTab(t.id)} activeOpacity={0.7}>
              <Icon size={20} color={on ? colors.primary : colors.muted} />
              <Text style={[s.tabLabel, on && s.tabLabelOn]}>{t.label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <Main />
    </SafeAreaProvider>
  );
}

function makeStyles() {
  return StyleSheet.create({
  root: { flex: 1 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  tabBar: {
    flexDirection: 'row',
    borderTopWidth: 1,
    paddingTop: 8,
  },
  tab: { flex: 1, alignItems: 'center' },
  tabLabel: { fontSize: 11, color: colors.muted, marginTop: 2, fontWeight: '600' },
  tabLabelOn: { color: colors.primary },
  startup: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  startupIcon: { width: 88, height: 88, borderRadius: 28, alignItems: 'center', justifyContent: 'center' },
  startupTitle: { marginTop: 18, fontSize: 32, fontWeight: '800', letterSpacing: 0.3 },
  startupTagline: { marginTop: 6, fontSize: 14 },
  startupLoading: { position: 'absolute', bottom: 56, alignItems: 'center' },
  startupLoadingText: { marginTop: 10, fontSize: 13, fontWeight: '600' },
  });
}
