import React from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import { colors } from './theme';
import { text } from './ui';
import { Utensils } from 'lucide-react-native';

export function Screen({ title, subtitle, right, children }) {
  const l = makeStyles();
  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.bg }}
      contentContainerStyle={l.content}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      <View style={l.header}>
        <View style={{ flex: 1 }}>
          <Text style={text.h1}>{title}</Text>
          {!!subtitle && <Text style={[text.muted, { marginTop: 2 }]}>{subtitle}</Text>}
        </View>
        {right}
      </View>
      {children}
    </ScrollView>
  );
}

export function ProgressBar({ value, max }) {
  const l = makeStyles();
  const frac = max > 0 ? Math.min(1, Math.max(0, value / max)) : 0;
  const over = max > 0 && value > max;
  return (
    <View style={l.track}>
      <View style={[l.fill, { width: frac * 100 + '%', backgroundColor: over ? colors.red : colors.green }]} />
    </View>
  );
}

export function Empty({ icon: Icon = Utensils, title, body, children }) {
  const l = makeStyles();
  return (
    <View style={l.empty}>
      <Icon size={44} color={colors.primary} />
      <Text style={[text.h2, { marginTop: 8, textAlign: 'center' }]}>{title}</Text>
      {!!body && <Text style={[text.muted, { textAlign: 'center', marginBottom: 16 }]}>{body}</Text>}
      <View style={{ alignSelf: 'stretch' }}>{children}</View>
    </View>
  );
}

export function Pill({ label, tone = 'neutral' }) {
  const l = makeStyles();
  const good = tone === 'good';
  return (
    <View style={[l.pill, good && { backgroundColor: colors.greenBg }]}>
      <Text style={[l.pillText, good && { color: colors.green }]}>{label}</Text>
    </View>
  );
}

function makeStyles() {
  return StyleSheet.create({
  content: { padding: 16, paddingBottom: 32 },
  header: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 16 },
  track: { height: 8, borderRadius: 4, backgroundColor: colors.chip, overflow: 'hidden', marginTop: 10 },
  fill: { height: 8, borderRadius: 4 },
  empty: { alignItems: 'center', paddingVertical: 48, paddingHorizontal: 12 },
  pill: { alignSelf: 'flex-start', backgroundColor: colors.chip, borderRadius: 999, paddingVertical: 3, paddingHorizontal: 10 },
  pillText: { fontSize: 12, color: colors.muted, fontWeight: '600' },
  });
}
