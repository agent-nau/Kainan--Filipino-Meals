import React from 'react';
import { View, Text, Alert, Linking, TouchableOpacity, TextInput } from 'react-native';
import { Button, Card, Chip, text } from '../ui';
import { Screen } from '../layout';
import { MarketPicker, DietPicker, TargetsPicker, StorePicker } from '../pickers';
import { getMarket, HOME_REGIONS, MARKETS, FOOD_PREFERENCES, VIBES, EQUIPMENT } from '../planner';
import { APP_NAME, colors } from '../theme';
import { getResetCooldownRemaining } from '../firebaseProfile';

export default function SettingsScreen({
  settings,
  setSettings,
  onRebuild,
  onReset,
  firebaseSyncError,
  firebaseSyncing,
  onRetryFirebaseSync,
}) {
  const [profileName, setProfileName] = React.useState(settings.name || '');
  const [resetCooldown, setResetCooldown] = React.useState(null);
  const [resetting, setResetting] = React.useState(false);
  React.useEffect(() => setProfileName(settings.name || ''), [settings.name]);
  React.useEffect(() => {
    let active = true;
    getResetCooldownRemaining()
      .then((remaining) => active && setResetCooldown(remaining))
      .catch((error) => {
        console.error('Unable to check the reset cooldown.', error);
        Alert.alert('Could not check reset status', 'Please restart the app and try again.');
      });
    const timer = setInterval(() => {
      setResetCooldown((remaining) => remaining == null ? remaining : Math.max(0, remaining - 1000));
    }, 1000);
    return () => {
      active = false;
      clearInterval(timer);
    };
  }, []);
  const patch = (p) => setSettings({ ...settings, ...p });
  const selectMarket = (market) =>
    setSettings({
      ...settings,
      market: market.id,
      country: market.id,
      currency: market.currency,
      units: market.id === 'us' ? 'imperial' : 'metric',
      budget: market.budget,
      store: market.store,
      stores: [market.store],
    });

  const executeReset = async () => {
    setResetting(true);
    try {
      await onReset();
    } catch (error) {
      console.error('Unable to reset app data.', error);
      Alert.alert('Reset failed', error instanceof Error ? error.message : 'Please try again later.');
    } finally {
      setResetting(false);
    }
  };
  const confirmReset = () =>
    Alert.alert('Reset everything?', 'This deletes your Firebase onboarding profile and clears this device. Reset is limited to once per minute.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Reset', style: 'destructive', onPress: executeReset },
    ]);
  const cooldownLabel = resetCooldown == null
    ? 'Checking reset availability…'
    : resetCooldown > 0
      ? `Reset available in ${Math.ceil(resetCooldown / 1000)} seconds.`
      : 'You can reset your data once per minute.';

  const openPatreonPage = async () => {
    try {
      await Linking.openURL('https://www.patreon.com/15482793/join');
    } catch (error) {
      console.error('Unable to open the Patreon page.', error);
      Alert.alert('Could not open the link', 'Please try again later.');
    }
  };

  return (
    <Screen title="Settings" subtitle="Changes apply the next time you rebuild your plan.">
      <Card>
        <Text style={text.h2}>Account profile</Text>
        <Text style={[text.muted, { marginBottom: 12 }]}>Your profile is saved on this device.</Text>
        {!!firebaseSyncError && (
          <View style={{ marginBottom: 14 }}>
            <Text accessibilityRole="alert" style={[text.muted, { color: colors.red, marginBottom: 10 }]}>
              {firebaseSyncError}
            </Text>
            <Button
              title={firebaseSyncing ? 'Syncing…' : 'Retry Firebase sync'}
              variant="muted"
              disabled={firebaseSyncing}
              onPress={async () => {
                try {
                  await onRetryFirebaseSync();
                } catch (error) {
                  Alert.alert('Firebase sync failed', error instanceof Error ? error.message : 'Please try again.');
                }
              }}
            />
          </View>
        )}
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 14 }}>
          <View
            accessibilityLabel={`${profileName.trim() || 'Your'} profile`}
            style={{
              width: 52,
              height: 52,
              borderRadius: 26,
              backgroundColor: colors.greenBg,
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: 12,
            }}
          >
            <Text style={{ color: colors.muted, fontSize: 20, fontWeight: '800' }}>
              {(profileName.trim().split(/\s+/).map((part) => part[0]).join('').slice(0, 2) || '?').toUpperCase()}
            </Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[text.muted, { marginBottom: 4 }]}>Name</Text>
            <TextInput
              value={profileName}
              onChangeText={setProfileName}
              onSubmitEditing={() => {
                if (profileName.trim()) patch({ name: profileName.trim() });
              }}
              placeholder="Your name"
              placeholderTextColor={colors.muted}
              autoCapitalize="words"
              returnKeyType="done"
              maxLength={32}
              accessibilityLabel="Profile name"
              style={{
                color: colors.text,
                backgroundColor: colors.input,
                borderColor: colors.border,
                borderWidth: 1,
                borderRadius: 10,
                paddingHorizontal: 10,
                paddingVertical: 8,
                fontSize: 16,
              }}
            />
          </View>
        </View>
        <Button
          title="Save profile"
          variant="secondary"
          disabled={!profileName.trim() || profileName.trim() === (settings.name || '')}
          onPress={() => patch({ name: profileName.trim() })}
          style={{ marginBottom: 12 }}
        />
        <Text style={text.muted}>
          {getMarket(settings.market).label} · {settings.homeRegion || 'Mixed / not sure'} ·
          {' '}{settings.people} {settings.people === 1 ? 'person' : 'people'}
        </Text>
        <Text style={[text.h2, { marginTop: 16 }]}>Language</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
          <Chip label="English" selected={(settings.language || 'en') === 'en'} onPress={() => patch({ language: 'en' })} />
          <Chip label="Filipino" selected={settings.language === 'fil'} onPress={() => patch({ language: 'fil' })} />
        </View>
      </Card>
      <Card>
        <Text style={text.h2}>Enjoying Kainan?</Text>
        <Text style={[text.muted, { marginBottom: 12 }]}>Support Kainan on Patreon. Salamat!</Text>
        <TouchableOpacity
          onPress={openPatreonPage}
          accessibilityRole="link"
          accessibilityLabel="Support Kainan on Patreon"
          style={{
            alignSelf: 'flex-start',
            minHeight: 48,
            justifyContent: 'center',
            backgroundColor: '#8c4f48',
            borderRadius: 8,
            paddingHorizontal: 16,
            marginTop: 8,
          }}
        >
          <Text style={{ color: '#ffffff', fontWeight: '700', fontSize: 16 }}>Join me on Patreon</Text>
        </TouchableOpacity>
      </Card>
      <Card>
        <Text style={text.h2}>Home region</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
          {HOME_REGIONS.map((region) => (
            <Chip
              key={region}
              label={region}
              selected={settings.homeRegion === region}
              onPress={() => patch({ homeRegion: region })}
            />
          ))}
        </View>
      </Card>
      <Card>
        <MarketPicker value={settings.market} onChange={selectMarket} />
      </Card>
      <Card>
        <Text style={text.h2}>Display currency</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
          {Array.from(new Set(MARKETS.map((market) => market.currency))).map((currency) => (
            <Chip
              key={currency}
              label={currency}
              selected={(settings.currency || getMarket(settings.market).currency) === currency}
              onPress={() => patch({ currency })}
            />
          ))}
        </View>
        <Text style={text.muted}>Currency conversion is not automatic; estimates use your selected market.</Text>
      </Card>
      <Card>
        <Text style={text.h2}>Measurement units</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
          <Chip label="Metric (g, ml)" selected={settings.units !== 'imperial'} onPress={() => patch({ units: 'metric' })} />
          <Chip label="Imperial (oz, fl oz)" selected={settings.units === 'imperial'} onPress={() => patch({ units: 'imperial' })} />
        </View>
      </Card>
      <Card>
        <DietPicker diet={settings.diet} allergens={settings.allergens || []} onChange={patch} />
      </Card>
      <Card>
        <Text style={text.h2}>Food preferences</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
          {FOOD_PREFERENCES.map((preference) => (
            <Chip
              key={preference.id}
              label={preference.label}
              selected={(settings.preferences || []).includes(preference.id)}
              onPress={() => {
                const current = settings.preferences || [];
                patch({
                  preferences: current.includes(preference.id)
                    ? current.filter((value) => value !== preference.id)
                    : [...current, preference.id],
                });
              }}
            />
          ))}
        </View>
      </Card>
      <Card>
        <Text style={text.h2}>Meal vibes · choose up to 3</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
          {VIBES.map((vibe) => (
            <Chip
              key={vibe.id}
              label={vibe.label}
              selected={(settings.vibes || []).includes(vibe.id)}
              onPress={() => {
                const current = settings.vibes || [];
                if (current.includes(vibe.id)) {
                  if (current.length > 1) patch({ vibes: current.filter((value) => value !== vibe.id) });
                } else if (current.length < 3) {
                  patch({ vibes: [...current, vibe.id] });
                }
              }}
            />
          ))}
        </View>
      </Card>
      <Card>
        <Text style={text.h2}>Kitchen kit</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
          {EQUIPMENT.map((item) => (
            <Chip
              key={item}
              label={item}
              selected={(settings.equipment || []).includes(item)}
              onPress={() => {
                const current = settings.equipment || [];
                patch({
                  equipment: current.includes(item)
                    ? current.filter((value) => value !== item)
                    : [...current, item],
                });
              }}
            />
          ))}
          <Chip
            label="Include Merienda"
            selected={!!settings.includeMerienda}
            onPress={() => patch({ includeMerienda: !settings.includeMerienda })}
          />
        </View>
      </Card>
      <Card>
        <TargetsPicker value={settings} onChange={patch} />
      </Card>
      <Card>
        <StorePicker value={settings.store} stores={settings.stores} market={settings.market} onChange={patch} />
      </Card>

      <Button title="Rebuild my plan" onPress={onRebuild} style={{ marginBottom: 8 }} />
      <Card style={{ borderColor: colors.red, borderWidth: 1 }}>
        <Text style={[text.h2, { color: colors.red }]}>Danger zone</Text>
        <Text style={[text.muted, { marginTop: 6, marginBottom: 12 }]}>
          Reset deletes your onboarding profile from Firebase and clears your local app data. This cannot be undone.
        </Text>
        <Text style={[text.muted, { marginBottom: 12 }]}>{cooldownLabel}</Text>
        <Button
          title={resetting ? 'Resetting…' : 'Reset all data'}
          variant="danger"
          disabled={resetting || resetCooldown == null || resetCooldown > 0}
          onPress={confirmReset}
        />
      </Card>

      <View style={{ marginTop: 20 }}>
        <Text style={text.muted}>
          {APP_NAME} shares Filipino meal ideas for people in the {getMarket(settings.market).label}. Cost estimates are
          rough planning estimates, not live shelf prices. Check labels. We can't guarantee allergen safety. Not
          affiliated with any supermarket.
        </Text>
      </View>
    </Screen>
  );
}
