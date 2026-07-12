import React from 'react';
import { View } from 'react-native';
import Svg, { Path, Circle, Line } from 'react-native-svg';

// Canva-style minimalist doodle shapes, 24x24 viewBox.
// Filled shapes use `fill`, line shapes use stroke — both driven by `color`.

const SHAPES = {
  // four-point sparkle (filled)
  sparkle: (c) => (
    <Path d="M12 2C13 8 16 11 22 12 16 13 13 16 12 22 11 16 8 13 2 12 8 11 11 8 12 2Z" fill={c} />
  ),
  // five-point star (filled)
  star: (c) => (
    <Path d="M12 2 14.6 8.6 21.6 9 16.2 13.4 18 20.2 12 16.4 6 20.2 7.8 13.4 2.4 9 9.4 8.6Z" fill={c} />
  ),
  // wavy squiggle (stroke)
  squiggle: (c) => (
    <Path d="M2 14C5 8 8 8 11 14 14 20 17 20 20 14" stroke={c} strokeWidth={2.4} fill="none" strokeLinecap="round" />
  ),
  // dashed ring (stroke)
  ring: (c) => (
    <Circle cx="12" cy="12" r="8.5" stroke={c} strokeWidth={2} fill="none" strokeDasharray="4 5" strokeLinecap="round" />
  ),
  // solid ring (stroke)
  circle: (c) => (
    <Circle cx="12" cy="12" r="8.5" stroke={c} strokeWidth={2.4} fill="none" />
  ),
  // organic blob (filled)
  blob: (c) => (
    <Path d="M12 3C17 2 21 6 20.5 11 21.5 15 18 21 13 20.5 8 21.5 3.5 18 4 13 3 8 7 4 12 3Z" fill={c} />
  ),
  // plus / cross (stroke)
  plus: (c) => (
    <>
      <Line x1="12" y1="5" x2="12" y2="19" stroke={c} strokeWidth={2.6} strokeLinecap="round" />
      <Line x1="5" y1="12" x2="19" y2="12" stroke={c} strokeWidth={2.6} strokeLinecap="round" />
    </>
  ),
  // zigzag (stroke)
  zigzag: (c) => (
    <Path d="M2 16 7 9 12 16 17 9 22 16" stroke={c} strokeWidth={2.4} fill="none" strokeLinecap="round" strokeLinejoin="round" />
  ),
  // confetti dots (filled)
  dots: (c) => (
    <>
      <Circle cx="6" cy="7" r="1.9" fill={c} />
      <Circle cx="17" cy="5.5" r="1.5" fill={c} />
      <Circle cx="12" cy="13" r="1.7" fill={c} />
      <Circle cx="5.5" cy="18" r="1.4" fill={c} />
      <Circle cx="18" cy="17" r="2" fill={c} />
    </>
  ),
  // half arc (stroke)
  arc: (c) => (
    <Path d="M4 15a8 8 0 0 1 16 0" stroke={c} strokeWidth={2.4} fill="none" strokeLinecap="round" />
  ),
  // triangle outline (stroke)
  triangle: (c) => (
    <Path d="M12 4 20 19H4Z" stroke={c} strokeWidth={2.2} fill="none" strokeLinejoin="round" />
  ),
  // puzzle piece (filled)
  puzzle: (c) => (
    <Path d="M6 9h3.2c-.4-2.8 4.4-2.8 4 0H17a1 1 0 0 1 1 1v3.2c2.8-.4 2.8 4.4 0 4V20a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V9Z" fill={c} />
  ),
  // curved dashed arrow (stroke)
  arrow: (c) => (
    <>
      <Path d="M4 19C7 9 13 6 19 8" stroke={c} strokeWidth={2.2} fill="none" strokeLinecap="round" strokeDasharray="3.5 3.5" />
      <Path d="m19 8-4.4-.6M19 8l-1.6 4" stroke={c} strokeWidth={2.2} fill="none" strokeLinecap="round" />
    </>
  ),
  // crescent moon (filled)
  moon: (c) => (
    <Path d="M19 14.5A8 8 0 1 1 9.5 5a6.5 6.5 0 0 0 9.5 9.5Z" fill={c} />
  ),
};

export function Doodle({ name, size = 20, color = '#8B5CF6', rotate = 0, opacity = 1, style }) {
  const shape = SHAPES[name];
  if (!shape) return null;
  return (
    <View style={[{ transform: [{ rotate: `${rotate}deg` }], opacity }, style]}>
      <Svg width={size} height={size} viewBox="0 0 24 24">
        {shape(color)}
      </Svg>
    </View>
  );
}

// Absolutely-positioned scatter of doodles over a parent (which must be
// position: relative). items: [{ name, x, y, size, color, rotate, opacity }]
// x/y may be numbers (px) or percentage strings.
export function DecorField({ items, style }) {
  return (
    <View pointerEvents="none" style={[{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }, style]}>
      {items.map((d, i) => (
        <View key={i} style={{ position: 'absolute', left: d.x, top: d.y }}>
          <Doodle name={d.name} size={d.size} color={d.color} rotate={d.rotate || 0} opacity={d.opacity ?? 1} />
        </View>
      ))}
    </View>
  );
}

// Ready-made arrangement for screen headers: sparkles + ring + squiggle
// around the title area, using theme accent colors.
export function HeaderDecor({ colors }) {
  return (
    <DecorField items={[
      { name: 'sparkle', x: '86%', y: 6, size: 22, color: colors.accentAmber, rotate: 10 },
      { name: 'sparkle', x: '78%', y: 40, size: 12, color: colors.accentPink, rotate: -12 },
      { name: 'ring', x: '92%', y: 58, size: 26, color: colors.accentCyan, opacity: 0.8 },
      { name: 'squiggle', x: 2, y: -6, size: 26, color: colors.accentPurple, rotate: -14, opacity: 0.8 },
      { name: 'plus', x: '68%', y: -4, size: 13, color: colors.accentPurple, rotate: 18, opacity: 0.75 },
    ]} />
  );
}
