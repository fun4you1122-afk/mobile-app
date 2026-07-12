import React from 'react';
import Svg, { Path, Circle, Rect, Line, Ellipse } from 'react-native-svg';
import { useTheme } from '../context/AppContext';

// Flat minimalist vector scenes (Canva-illustration style) built from
// primitives, themed via the pastel palette. viewBox 160x140.

function useScenePalette() {
  const { colors } = useTheme();
  return {
    purple: colors.accentPurple,
    cyan: colors.accentCyan,
    pink: colors.accentPink,
    amber: colors.accentAmber,
    chipPurple: colors.chipPurple,
    chipCyan: colors.chipCyan,
    chipPink: colors.chipPink,
    chipAmber: colors.chipAmber,
    ink: colors.textPrimary,
    paper: colors.cardBg,
  };
}

// Laptop workspace: browser window with chart, books underneath,
// floating lightbulb — the "learning/building" scene.
export function SceneLaptop({ size = 150 }) {
  const p = useScenePalette();
  return (
    <Svg width={size} height={size * 0.875} viewBox="0 0 160 140">
      {/* backdrop blob */}
      <Path d="M80 8C118 4 148 28 146 62 150 96 124 126 84 124 46 128 14 106 16 70 12 36 42 12 80 8Z" fill={p.chipPurple} />
      {/* book stack */}
      <Rect x="34" y="104" width="92" height="12" rx="6" fill={p.pink} />
      <Rect x="42" y="92" width="76" height="12" rx="6" fill={p.amber} />
      {/* browser window */}
      <Rect x="38" y="30" width="84" height="62" rx="9" fill={p.paper} />
      <Rect x="38" y="30" width="84" height="16" rx="9" fill={p.purple} />
      <Rect x="38" y="38" width="84" height="8" fill={p.purple} />
      <Circle cx="47" cy="38" r="2.4" fill="#FFFFFF" opacity="0.9" />
      <Circle cx="55" cy="38" r="2.4" fill="#FFFFFF" opacity="0.6" />
      <Circle cx="63" cy="38" r="2.4" fill="#FFFFFF" opacity="0.35" />
      {/* chart bars */}
      <Rect x="50" y="66" width="9" height="18" rx="3" fill={p.cyan} />
      <Rect x="64" y="58" width="9" height="26" rx="3" fill={p.purple} />
      <Rect x="78" y="70" width="9" height="14" rx="3" fill={p.pink} />
      <Rect x="92" y="52" width="9" height="32" rx="3" fill={p.amber} />
      {/* trend line */}
      <Path d="M50 62 66 52 82 60 104 44" stroke={p.ink} strokeWidth="2.4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <Circle cx="104" cy="44" r="3.2" fill={p.ink} />
      {/* lightbulb */}
      <Circle cx="132" cy="26" r="11" fill={p.chipAmber} />
      <Circle cx="132" cy="24" r="6" fill={p.amber} />
      <Rect x="129" y="31" width="6" height="4" rx="1.5" fill={p.ink} opacity="0.7" />
      {/* doodles */}
      <Path d="M22 30c1 4.5 3.5 7 8 8-4.5 1-7 3.5-8 8-1-4.5-3.5-7-8-8 4.5-1 7-3.5 8-8Z" fill={p.pink} />
      <Circle cx="140" cy="82" r="7" stroke={p.cyan} strokeWidth="2.2" fill="none" strokeDasharray="3.5 4" />
      <Path d="M18 78c2.5-4 5-4 7.5 0s5 4 7.5 0" stroke={p.purple} strokeWidth="2.2" fill="none" strokeLinecap="round" />
    </Svg>
  );
}

// Rocket launch scene — growth, startups, "let's start".
export function SceneRocket({ size = 150 }) {
  const p = useScenePalette();
  return (
    <Svg width={size} height={size * 0.875} viewBox="0 0 160 140">
      {/* backdrop blob */}
      <Path d="M78 6C120 2 150 30 146 66 150 100 120 128 80 126 42 130 12 104 16 68 12 34 40 10 78 6Z" fill={p.chipCyan} />
      {/* moon arc */}
      <Path d="M28 108a52 52 0 0 1 104 0" stroke={p.purple} strokeWidth="3" fill="none" strokeLinecap="round" strokeDasharray="1 10" />
      {/* rocket body */}
      <Path d="M80 22c12 9 18 24 18 40l-8 12H70l-8-12c0-16 6-31 18-40Z" fill={p.purple} />
      <Circle cx="80" cy="52" r="9" fill={p.paper} />
      <Circle cx="80" cy="52" r="5.5" fill={p.cyan} />
      {/* fins */}
      <Path d="M62 62 50 76c6 1 10 4 12 9l6-10Z" fill={p.pink} />
      <Path d="M98 62l12 14c-6 1-10 4-12 9l-6-10Z" fill={p.pink} />
      {/* flame */}
      <Path d="M74 78c-1 8 1 14 6 20 5-6 7-12 6-20Z" fill={p.amber} />
      {/* stars */}
      <Path d="M34 34c.8 3.6 2.8 5.6 6.4 6.4-3.6.8-5.6 2.8-6.4 6.4-.8-3.6-2.8-5.6-6.4-6.4 3.6-.8 5.6-2.8 6.4-6.4Z" fill={p.amber} />
      <Path d="M126 36c.6 2.8 2.2 4.4 5 5-2.8.6-4.4 2.2-5 5-.6-2.8-2.2-4.4-5-5 2.8-.6 4.4-2.2 5-5Z" fill={p.pink} />
      <Circle cx="120" cy="96" r="3" fill={p.purple} />
      <Circle cx="40" cy="92" r="2.4" fill={p.cyan} />
    </Svg>
  );
}

// Chat / support scene — bubbles and sparkles.
export function SceneChat({ size = 150 }) {
  const p = useScenePalette();
  return (
    <Svg width={size} height={size * 0.875} viewBox="0 0 160 140">
      {/* backdrop blob */}
      <Path d="M80 8C120 4 148 30 144 64 148 98 120 126 82 124 44 128 14 104 18 68 14 34 42 12 80 8Z" fill={p.chipPink} />
      {/* big bubble */}
      <Path d="M36 38a14 14 0 0 1 14-14h52a14 14 0 0 1 14 14v26a14 14 0 0 1-14 14H68l-16 14V78h-2a14 14 0 0 1-14-14V38Z" fill={p.purple} />
      <Circle cx="62" cy="51" r="4.4" fill="#FFFFFF" opacity="0.95" />
      <Circle cx="78" cy="51" r="4.4" fill="#FFFFFF" opacity="0.7" />
      <Circle cx="94" cy="51" r="4.4" fill="#FFFFFF" opacity="0.45" />
      {/* small bubble */}
      <Path d="M96 88a11 11 0 0 1 11-11h20a11 11 0 0 1 11 11v8a11 11 0 0 1-11 11h-6l-10 9v-9h-4a11 11 0 0 1-11-11v-8Z" fill={p.cyan} />
      <Line x1="106" y1="90" x2="128" y2="90" stroke="#FFFFFF" strokeWidth="2.6" strokeLinecap="round" />
      <Line x1="106" y1="97" x2="122" y2="97" stroke="#FFFFFF" strokeWidth="2.6" strokeLinecap="round" opacity="0.7" />
      {/* doodles */}
      <Path d="M30 96c1 4.2 3.3 6.5 7.5 7.5-4.2 1-6.5 3.3-7.5 7.5-1-4.2-3.3-6.5-7.5-7.5 4.2-1 6.5-3.3 7.5-7.5Z" fill={p.amber} />
      <Circle cx="130" cy="30" r="7.5" stroke={p.pink} strokeWidth="2.2" fill="none" strokeDasharray="3.5 4" />
      <Path d="M20 26c2.5-4 5-4 7.5 0s5 4 7.5 0" stroke={p.cyan} strokeWidth="2.2" fill="none" strokeLinecap="round" />
    </Svg>
  );
}

// Trophy / results scene — for portfolio & success moments.
export function SceneTrophy({ size = 150 }) {
  const p = useScenePalette();
  return (
    <Svg width={size} height={size * 0.875} viewBox="0 0 160 140">
      <Path d="M80 8C118 4 146 28 144 62 148 96 122 124 82 122 44 126 14 104 18 68 14 34 42 12 80 8Z" fill={p.chipAmber} />
      {/* cup */}
      <Path d="M58 34h44v22a22 22 0 0 1-44 0V34Z" fill={p.amber} />
      {/* handles */}
      <Path d="M58 40H44a12 12 0 0 0 14 14M102 40h14a12 12 0 0 1-14 14" stroke={p.amber} strokeWidth="5" fill="none" strokeLinecap="round" />
      {/* star on cup */}
      <Path d="M80 42l2.6 5.6 6 .5-4.6 4 1.4 5.9-5.4-3.2-5.4 3.2 1.4-5.9-4.6-4 6-.5Z" fill="#FFFFFF" />
      {/* stem + base */}
      <Rect x="74" y="76" width="12" height="10" fill={p.amber} opacity="0.85" />
      <Rect x="60" y="86" width="40" height="9" rx="4.5" fill={p.purple} />
      {/* confetti */}
      <Circle cx="42" cy="28" r="3" fill={p.pink} />
      <Circle cx="122" cy="26" r="2.5" fill={p.cyan} />
      <Path d="M120 92c.8 3.4 2.7 5.3 6 6-3.3.8-5.2 2.7-6 6-.8-3.3-2.7-5.2-6-6 3.3-.7 5.2-2.6 6-6Z" fill={p.purple} />
      <Path d="M32 84l3-6M40 88l5-4M28 72l6 1" stroke={p.pink} strokeWidth="2.4" strokeLinecap="round" />
    </Svg>
  );
}
