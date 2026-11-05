import React from 'react';
import { Animated, Platform, Text, TouchableOpacity, View, StyleSheet } from 'react-native';
import { colors, shadow } from './theme';

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

export function Button({ title, onPress, variant = 'primary', style, disabled, icon: Icon, animate = false }) {
  const s = makeStyles();
  const secondary = variant === 'secondary';
  const ghost = variant === 'ghost';
  const danger = variant === 'danger';
  const opacity = React.useRef(new Animated.Value(1)).current;
  const Wrapper = animate ? AnimatedTouchableOpacity : TouchableOpacity;
  const pressStyle = animate ? { opacity } : null;
  const animatePress = (toValue) => {
    if (animate) Animated.timing(opacity, { toValue, duration: 100, useNativeDriver: Platform.OS !== 'web' }).start();
  };
  return (
    <Wrapper
      activeOpacity={0.8}
      disabled={disabled}
      onPress={onPress}
      onPressIn={() => animatePress(0.72)}
      onPressOut={() => animatePress(1)}
      style={[s.btn, secondary && s.btnSecondary, ghost && s.btnGhost, danger && s.btnDanger, disabled && { opacity: 0.5 }, pressStyle, style]}
    >
      <View style={s.btnContent}>
        {Icon && <Icon size={18} color={colors.text} />}
        <Text style={s.btnText}>{title}</Text>
      </View>
    </Wrapper>
  );
}

export function Chip({ label, selected, onPress, style, icon: Icon, animate = false }) {
  const s = makeStyles();
  const selectionProgress = React.useRef(new Animated.Value(selected ? 1 : 0)).current;
  const selectionScale = React.useRef(new Animated.Value(1)).current;
  const wasSelected = React.useRef(selected);
  React.useEffect(() => {
    if (animate) {
      Animated.timing(selectionProgress, {
        toValue: selected ? 1 : 0,
        duration: 220,
        useNativeDriver: false,
      }).start();
      if (selected && !wasSelected.current) {
        Animated.sequence([
          Animated.timing(selectionScale, { toValue: 1.04, duration: 90, useNativeDriver: false }),
          Animated.timing(selectionScale, { toValue: 1, duration: 120, useNativeDriver: false }),
        ]).start();
      }
    } else {
      selectionProgress.setValue(selected ? 1 : 0);
    }
    wasSelected.current = selected;
  }, [animate, selected, selectionProgress, selectionScale]);
  return (
    <Animated.View style={animate && { transform: [{ scale: selectionScale }] }}>
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={onPress}
        accessibilityRole="button"
        accessibilityState={{ selected }}
        style={[s.chip, selected && !animate && s.chipOn, selected && animate && s.chipSelected, style]}
      >
        {animate && (
          <Animated.View
            pointerEvents="none"
            style={[s.chipSelectionFill, { opacity: selectionProgress }]}
          />
        )}
        <View style={[s.chipContent, animate && { zIndex: 1 }]}>
          {Icon && <Icon size={16} color={selected ? colors.text : colors.muted} />}
          <Text style={[s.chipText, animate && s.chipTextAnimated, selected && s.chipTextOn]}>{label}</Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

export function Card({ children, style }) {
  const s = makeStyles();
  return <View style={[s.card, style]}>{children}</View>;
}

export function Stepper({ label, value, onChange, step = 1, min = 0, max = 999999, format }) {
  const s = makeStyles();
  return (
    <View style={s.stepRow}>
      <Text style={s.stepLabel}>{label}</Text>
      <View style={s.stepCtl}>
        <TouchableOpacity style={s.stepBtn} onPress={() => onChange(Math.max(min, value - step))}>
          <Text style={s.stepBtnText}>−</Text>
        </TouchableOpacity>
        <Text style={s.stepVal}>{format ? format(value) : value}</Text>
        <TouchableOpacity style={s.stepBtn} onPress={() => onChange(Math.min(max, value + step))}>
          <Text style={s.stepBtnText}>+</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const textStyles = {
  h1: { fontSize: 26, fontWeight: '800', color: 'text' },
  h2: { fontSize: 18, fontWeight: '700', color: 'text', marginBottom: 8 },
  body: { fontSize: 15, color: 'text' },
  muted: { fontSize: 13, color: 'muted' },
};

export const text = new Proxy({}, {
  get(_target, key) {
    const style = textStyles[key];
    if (!style) return undefined;
    return StyleSheet.create({
      [key]: {
        ...style,
        color: colors[style.color],
      },
    })[key];
  },
});

function makeStyles() {
  return StyleSheet.create({
  btn: { backgroundColor: colors.primary, paddingVertical: 14, borderRadius: 14, alignItems: 'center' },
  btnContent: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  btnSecondary: { backgroundColor: colors.chip },
  btnGhost: { backgroundColor: 'transparent' },
  btnDanger: { backgroundColor: colors.red },
  btnText: { color: colors.text, fontWeight: '700', fontSize: 16 },
  chip: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 999,
    backgroundColor: colors.chip,
    borderWidth: 1,
    borderColor: colors.border,
    marginRight: 8,
    marginBottom: 8,
  },
  chipOn: { backgroundColor: colors.primary, borderColor: colors.primary },
  chipSelected: { borderColor: colors.primary },
  chipSelectionFill: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    borderRadius: 999,
    backgroundColor: colors.primary,
  },
  chipText: { color: colors.text, fontSize: 14 },
  chipTextAnimated: { fontWeight: '600' },
  chipTextOn: { color: colors.text, fontWeight: '600' },
  chipContent: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  card: { backgroundColor: colors.card, borderRadius: 16, padding: 14, marginBottom: 12, ...shadow },
  stepRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 10 },
  stepLabel: { fontSize: 16, color: colors.text, flex: 1 },
  stepCtl: { flexDirection: 'row', alignItems: 'center' },
  stepBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.chip,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepBtnText: { fontSize: 22, color: colors.primary, fontWeight: '700', marginTop: -2 },
  stepVal: { minWidth: 96, textAlign: 'center', fontSize: 16, fontWeight: '700', color: colors.text },
  });
}
