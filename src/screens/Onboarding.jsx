import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Keyboard, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { CookingPot } from 'lucide-react-native';
import { colors, APP_NAME, formatMoney } from '../theme';
import { Button, Card, Chip, Stepper, text } from '../ui';
import { DEFAULTS, DIETS, ALLERGENS, MARKETS, HOME_ISLANDS, REGIONS_BY_ISLAND, VIBES, EQUIPMENT, FOOD_PREFERENCES, getStores } from '../planner';

const LAST = 3;
const POPULAR_COUNTRIES = [
  'uae', 'saudi-arabia', 'qatar', 'kuwait', 'singapore', 'hong-kong', 'taiwan',
  'japan', 'south-korea', 'italy', 'uk', 'canada', 'us', 'australia', 'new-zealand',
];
const COUNTRY_FLAGS = {
  philippines: '🇵🇭', uae: '🇦🇪', 'saudi-arabia': '🇸🇦', qatar: '🇶🇦', kuwait: '🇰🇼',
  singapore: '🇸🇬', 'hong-kong': '🇭🇰', taiwan: '🇹🇼', japan: '🇯🇵',
  'south-korea': '🇰🇷', italy: '🇮🇹', uk: '🇬🇧', canada: '🇨🇦', us: '🇺🇸',
  australia: '🇦🇺', 'new-zealand': '🇳🇿',
};

export default function Onboarding({ onDone, initialSettings = DEFAULTS, onDraftChange, busy = false }) {
  const [step, setStep] = useState(0);
  const [settings, setSettings] = useState({ ...DEFAULTS, ...initialSettings });
  const [countryQuery, setCountryQuery] = useState('');
  const [nameTouched, setNameTouched] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const stepOpacity = useRef(new Animated.Value(1)).current;
  const progressValue = useRef(new Animated.Value(0)).current;
  const progressWidth = progressValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });
  const patch = (change) => {
    setSettings((current) => ({ ...current, ...change }));
  };
  useEffect(() => onDraftChange?.(settings), [settings, onDraftChange]);
  useEffect(() => {
    stepOpacity.setValue(0);
    Animated.timing(stepOpacity, { toValue: 1, duration: 220, useNativeDriver: Platform.OS !== 'web' }).start();
    Animated.timing(progressValue, {
      toValue: (step + 1) / 4,
      duration: 420,
      useNativeDriver: false,
    }).start();
  }, [step, stepOpacity, progressValue]);
  const setMarket = (market) =>
    patch({
      market: market.id,
      country: market.id,
      currency: market.currency,
      units: market.id === 'us' ? 'imperial' : 'metric',
      budget: market.budget,
      store: market.store,
      stores: [market.store],
    });
  const isAbroad = settings.market !== 'philippines';
  const countryOptions = useMemo(() => {
    const ordered = POPULAR_COUNTRIES.map((id) => MARKETS.find((item) => item.id === id)).filter(Boolean);
    const query = countryQuery.trim().toLowerCase();
    return ordered
      .filter((country) => !query || country.label.toLowerCase().includes(query))
      .concat(
        query
          ? MARKETS.filter((country) => !POPULAR_COUNTRIES.includes(country.id) && country.label.toLowerCase().includes(query))
          : [],
      );
  }, [countryQuery]);
  const stores = getStores(settings.market);
  const chosenStores = settings.stores || [settings.store];

  const toggleArray = (field, value) => {
    const current = settings[field] || [];
    patch({ [field]: current.includes(value) ? current.filter((item) => item !== value) : [...current, value] });
  };

  const advance = async () => {
    if (busy) return;
    if (step === 0 && !settings.name?.trim()) {
      setNameTouched(true);
      return;
    }
    Keyboard.dismiss();
    if (step === LAST) {
      setSubmitError('');
      try {
        await onDone({ ...settings, name: settings.name.trim() }, []);
      } catch (error) {
        console.error('Unable to save onboarding data.', error);
        setSubmitError(error instanceof Error ? error.message : 'Unable to save your profile. Please try again.');
      }
    } else {
      setStep(step + 1);
    }
  };

  const s = makeStyles();

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.bg }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={s.top}>
        <Text style={s.stepLabel}>STEP {step + 1} OF 4</Text>
        <View style={s.progressTrack}>
          <Animated.View style={[s.progress, { width: progressWidth }]} />
        </View>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={s.content}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        showsVerticalScrollIndicator={false}
      >
        <Animated.View style={{ opacity: stepOpacity }}>
        {step === 0 && (
          <View>
            <CookingPot size={44} color={colors.green} />
            <Text style={[text.h1, { marginTop: 16 }]}>Ano'ng pangalan mo?</Text>
            <Text style={[text.muted, { marginTop: 6, marginBottom: 20 }]}>
              Just a first name or nickname so we can make your week feel personal.
            </Text>
            <TextInput
              value={settings.name || ''}
              onChangeText={(name) => patch({ name: name.slice(0, 32) })}
              onBlur={() => setNameTouched(true)}
              placeholder="Your name"
              placeholderTextColor={colors.muted}
              autoCapitalize="words"
              returnKeyType="done"
              maxLength={32}
              onSubmitEditing={advance}
              accessibilityLabel="Your name"
              accessibilityHint="Required to continue onboarding"
              accessibilityState={{ invalid: nameTouched && !settings.name?.trim() }}
              style={s.input}
            />
            {!settings.name?.trim() && !nameTouched && (
              <Text style={[text.muted, { marginTop: 6 }]}>
                Your name is required to continue.
              </Text>
            )}
            {nameTouched && !settings.name?.trim() && (
              <Text accessibilityRole="alert" style={s.error}>Please enter your name to continue.</Text>
            )}
            <Text style={[text.h2, { marginTop: 24 }]}>Choose a language</Text>
            <View style={s.wrap}>
              <OnboardingChip label="English" selected={(settings.language || 'en') === 'en'} onPress={() => patch({ language: 'en' })} />
              <OnboardingChip label="Filipino" selected={settings.language === 'fil'} onPress={() => patch({ language: 'fil' })} />
            </View>
            <Card style={{ marginTop: 20 }}>
              <Text style={text.body}>Kain na! Plan your week, shop once.</Text>
              <Text style={[text.muted, { marginTop: 6 }]}>
                Filipino comfort food for home and wherever life takes you.
              </Text>
            </Card>
          </View>
        )}

        {step === 1 && (
          <View>
            <Text style={text.h1}>Where are you from?</Text>
            <Text style={[text.muted, { marginTop: 6, marginBottom: 16 }]}>
              Choose your island group, then pick your region or province.
            </Text>
            <View style={s.wrap}>
              {HOME_ISLANDS.map((island, index) => (
                <Entrance key={island} index={index}>
                  <OnboardingChip
                    label={island}
                    selected={settings.homeIsland === island}
                    onPress={() => {
                      const regions = REGIONS_BY_ISLAND[island] || [];
                      patch({
                        homeIsland: island,
                        homeRegion: island === 'Mixed / not sure'
                          ? island
                          : regions.includes(settings.homeRegion) ? settings.homeRegion : regions[0],
                      });
                    }}
                  />
                </Entrance>
              ))}
            </View>
            {settings.homeIsland !== 'Mixed / not sure' && (
              <>
                <Text style={[text.h2, { marginTop: 18 }]}>
                  {settings.homeIsland ? `Pick a region or province in ${settings.homeIsland}` : 'Pick your region or province'}
                </Text>
                <View style={s.wrap}>
                  {(REGIONS_BY_ISLAND[settings.homeIsland] || []).map((region, index) => (
                    <Entrance key={region} index={index}>
                      <OnboardingChip
                        label={region}
                        selected={settings.homeRegion === region}
                        onPress={() => patch({ homeRegion: region })}
                      />
                    </Entrance>
                  ))}
                </View>
              </>
            )}
            {settings.homeIsland === 'Mixed / not sure' && (
              <Text style={[text.muted, { marginTop: 8 }]}>
                No worries—we'll mix Filipino regional recipes in your plan.
              </Text>
            )}
          </View>
        )}

        {step === 2 && (
          <View>
            <Text style={text.h1}>Where do you live now?</Text>
            <Text style={[text.muted, { marginTop: 6, marginBottom: 16 }]}>
              This sets your currency, shopping options and ingredient swaps.
            </Text>
            <View style={s.wrap}>
              <Entrance index={0}>
                <OnboardingChip
                  label={`${COUNTRY_FLAGS.philippines} I live in the Philippines`}
                  selected={!isAbroad}
                  onPress={() => setMarket(MARKETS[0])}
                />
              </Entrance>
              <Entrance index={1}>
                <OnboardingChip
                  label="I live abroad"
                  selected={isAbroad}
                  onPress={() => setMarket(MARKETS.find((market) => market.id === 'uk'))}
                />
              </Entrance>
            </View>

            {isAbroad && (
              <>
                <Text style={[text.h2, { marginTop: 18 }]}>Choose your country</Text>
                <TextInput
                  value={countryQuery}
                  onChangeText={setCountryQuery}
                  placeholder="Search countries"
                  placeholderTextColor={colors.muted}
                  accessibilityLabel="Search countries"
                  style={s.input}
                />
                <View style={[s.wrap, { marginTop: 12 }]}>
                  {countryOptions.map((country, index) => (
                    <Entrance key={country.id} index={index}>
                      <OnboardingChip
                        label={`${COUNTRY_FLAGS[country.id] || '🌍'} ${country.label} · ${country.currency}`}
                        selected={settings.market === country.id}
                        onPress={() => setMarket(country)}
                      />
                    </Entrance>
                  ))}
                </View>
              </>
            )}

            <Text style={[text.h2, { marginTop: 18 }]}>Where do you usually shop?</Text>
            <Text style={[text.muted, { marginBottom: 10 }]}>Choose all that apply.</Text>
            <View style={s.wrap}>
              {stores.map((store, index) => (
                <Entrance key={store.id} index={index}>
                  <OnboardingChip
                    label={store.label}
                    selected={chosenStores.includes(store.id)}
                    onPress={() => {
                      const next = chosenStores.includes(store.id)
                        ? chosenStores.filter((id) => id !== store.id)
                        : [...chosenStores, store.id];
                      patch({ stores: next, store: next[0] || settings.store });
                    }}
                  />
                </Entrance>
              ))}
            </View>
            <Text style={text.muted}>Budget estimates use {settings.currency || 'PHP'} and are not live prices.</Text>
          </View>
        )}

        {step === 3 && (
          <View>
            <Text style={text.h1}>Your household</Text>
            <Text style={[text.muted, { marginTop: 6, marginBottom: 14 }]}>
              We'll keep the plan realistic for your people, budget and kitchen.
            </Text>
            <Card>
              <Stepper
                label="People eating"
                value={settings.people}
                min={1}
                max={12}
                onChange={(people) => patch({ people, cookingForOne: people === 1 })}
              />
              <OnboardingChip
                label="Cooking for one"
                selected={settings.people === 1}
                onPress={() => patch({ people: 1, cookingForOne: true })}
              />
              <Text style={[text.muted, { marginBottom: 8 }]}>One person? Shared kitchen? This is your home base.</Text>
              <Stepper
                label="Weekly food budget"
                value={settings.budget}
                step={settings.market === 'philippines' ? 250 : 5}
                min={settings.market === 'philippines' ? 500 : 10}
                max={settings.market === 'philippines' ? 100000 : 10000}
                format={(amount) => formatMoney(amount, settings.market, settings.currency)}
                onChange={(budget) => patch({ budget })}
              />
              <OnboardingChip
                label="Add optional Merienda to my plan"
                selected={!!settings.includeMerienda}
                onPress={() => patch({ includeMerienda: !settings.includeMerienda })}
              />
            </Card>

            <Text style={text.h2}>Diet</Text>
            <View style={s.wrap}>
              {DIETS.map((diet) => (
                <OnboardingChip
                  key={diet.id}
                  label={diet.label}
                  selected={settings.diet === diet.id}
                  onPress={() => patch({ diet: diet.id })}
                />
              ))}
            </View>
            {settings.diet === 'halal' && (
              <Text style={[text.muted, { marginBottom: 10 }]}>
                No pork or alcohol-based ingredients. Check labels; we can't guarantee halal or allergen safety.
              </Text>
            )}

            <Text style={text.h2}>Allergies & avoidances</Text>
            <View style={s.wrap}>
              {ALLERGENS.map((allergen) => (
                <OnboardingChip
                  key={allergen.id}
                  label={allergen.label}
                  selected={(settings.allergens || []).includes(allergen.id)}
                  onPress={() => toggleArray('allergens', allergen.id)}
                />
              ))}
              <OnboardingChip
                label="Lactose-free"
                selected={(settings.allergens || []).includes('dairy')}
                onPress={() => toggleArray('allergens', 'dairy')}
              />
            </View>
            <Text style={[text.muted, { marginTop: 2, marginBottom: 14 }]}>
              Check labels. We can't guarantee allergen safety.
            </Text>

            <Text style={text.h2}>Kitchen kit</Text>
            <View style={s.wrap}>
              {EQUIPMENT.map((item) => (
                <OnboardingChip
                  key={item}
                  label={item}
                  selected={(settings.equipment || []).includes(item)}
                  onPress={() => toggleArray('equipment', item)}
                />
              ))}
            </View>

            <Text style={text.h2}>Food preferences</Text>
            <View style={s.wrap}>
              {FOOD_PREFERENCES.map((preference) => (
                <OnboardingChip
                  key={preference.id}
                  label={preference.label}
                  selected={(settings.preferences || []).includes(preference.id)}
                  onPress={() => toggleArray('preferences', preference.id)}
                />
              ))}
            </View>

            <Text style={text.h2}>What sounds good this week? Pick up to 3.</Text>
            <View style={s.wrap}>
              {VIBES.map((vibe) => {
                const selected = (settings.vibes || []).includes(vibe.id);
                return (
                  <OnboardingChip
                    key={vibe.id}
                    label={vibe.label}
                    selected={selected}
                    onPress={() => {
                      const current = settings.vibes || [];
                      if (selected && current.length > 1) toggleArray('vibes', vibe.id);
                      else if (current.length < 3) toggleArray('vibes', vibe.id);
                    }}
                  />
                );
              })}
            </View>
          </View>
        )}
        </Animated.View>
        {!!submitError && <Text accessibilityRole="alert" style={[text.muted, { color: colors.red, paddingHorizontal: 20 }]}>{submitError}</Text>}
      </ScrollView>

      <View style={s.footer}>
        {step > 0 && (
          <View style={{ flex: 1, marginRight: 8 }}>
            <Button
              title="Back"
              variant="secondary"
              animate
              onPress={() => {
                Keyboard.dismiss();
                setStep(step - 1);
              }}
              accessibilityLabel="Go to the previous onboarding step"
            />
          </View>
        )}
        <View style={{ flex: 2 }}>
          <Button
            title={busy ? 'Nag-iisip ng ulam…' : step === LAST ? 'Gawin na natin ang week mo' : 'Next'}
            disabled={busy}
            animate
            onPress={advance}
            accessibilityLabel={step === LAST ? 'Create my meal plan' : 'Go to the next onboarding step'}
          />
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

function makeStyles() {
  return StyleSheet.create({
  top: { paddingHorizontal: 20, paddingTop: 12 },
  stepLabel: { color: colors.muted, fontSize: 11, fontWeight: '800', letterSpacing: 1 },
  progressTrack: { height: 5, marginTop: 8, borderRadius: 3, backgroundColor: colors.border, overflow: 'hidden' },
  progress: { height: '100%', backgroundColor: colors.green, borderRadius: 3 },
  content: { padding: 20, paddingBottom: 24 },
  footer: { flexDirection: 'row', padding: 16, borderTopWidth: 1, borderTopColor: colors.border, backgroundColor: colors.bg },
  input: {
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.input,
    color: colors.text,
    fontSize: 16,
  },
  error: { marginTop: 6, marginLeft: 2, color: colors.red, fontSize: 13, fontWeight: '600' },
  wrap: { flexDirection: 'row', flexWrap: 'wrap' },
  });
}

function Entrance({ children, index = 0 }) {
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.timing(progress, {
      toValue: 1,
      duration: 260,
      delay: Math.min(index, 8) * 45,
      useNativeDriver: Platform.OS !== 'web',
    });
    animation.start();
    return () => animation.stop();
  }, [index, progress]);

  return (
    <Animated.View
      style={{
        opacity: progress,
      }}
    >
      {children}
    </Animated.View>
  );
}

function OnboardingChip(props) {
  return <Chip {...props} animate />;
}
