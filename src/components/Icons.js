import React from 'react';
import Svg, { Path, Circle, Rect, Line, Ellipse, Defs, LinearGradient as SvgGradient, Stop } from 'react-native-svg';

// Stroke-based icon set, 24x24 viewBox. Every icon reads crisply at 16–40px.
// Usage:
//   <Icon name="home" size={22} color="#fff" />
//   <Icon name="sparkles" size={22} gradient={['#00D4AA', '#7C3AED']} />

let gradSeq = 0;

const ICONS = {
  home: (p) => (
    <>
      <Path d="M3 10.5 12 3l9 7.5" {...p} />
      <Path d="M5 9.5V20a1 1 0 0 0 1 1h3.8v-6.2h4.4V21H18a1 1 0 0 0 1-1V9.5" {...p} />
    </>
  ),
  bolt: (p) => <Path d="M13 2 4.6 13.4h5.9L10.2 22l8.6-11.4h-6L13 2Z" {...p} strokeLinejoin="round" />,
  layers: (p) => (
    <>
      <Path d="M12 2.5 22 8l-10 5.5L2 8l10-5.5Z" {...p} strokeLinejoin="round" />
      <Path d="M2 12.5 12 18l10-5.5" {...p} />
      <Path d="M2 17 12 22.5 22 17" {...p} />
    </>
  ),
  sparkles: (p) => (
    <>
      <Path d="M12 4c.5 4.1 3.9 7.5 8 8-4.1.5-7.5 3.9-8 8-.5-4.1-3.9-7.5-8-8 4.1-.5 7.5-3.9 8-8Z" {...p} strokeLinejoin="round" />
      <Path d="M19 2.5c.15 1.2 1.15 2.2 2.35 2.35C20.15 5 19.15 6 19 7.2 18.85 6 17.85 5 16.65 4.85 17.85 4.7 18.85 3.7 19 2.5Z" {...p} strokeLinejoin="round" />
    </>
  ),
  chat: (p) => <Path d="M21 15a2 2 0 0 1-2 2H8l-5 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10Z" {...p} strokeLinejoin="round" />,
  settings: (p) => (
    <>
      <Line x1="4" y1="6" x2="20" y2="6" {...p} />
      <Circle cx="9" cy="6" r="2.2" {...p} fill="none" />
      <Line x1="4" y1="12" x2="20" y2="12" {...p} />
      <Circle cx="15" cy="12" r="2.2" {...p} fill="none" />
      <Line x1="4" y1="18" x2="20" y2="18" {...p} />
      <Circle cx="7.5" cy="18" r="2.2" {...p} fill="none" />
    </>
  ),
  globe: (p) => (
    <>
      <Circle cx="12" cy="12" r="9" {...p} fill="none" />
      <Ellipse cx="12" cy="12" rx="4" ry="9" {...p} fill="none" />
      <Line x1="3" y1="12" x2="21" y2="12" {...p} />
    </>
  ),
  lightbulb: (p) => (
    <>
      <Path d="M12 2a7 7 0 0 0-4.1 12.7c.7.5 1.1 1.3 1.1 2.1v.2h6v-.2c0-.8.4-1.6 1.1-2.1A7 7 0 0 0 12 2Z" {...p} strokeLinejoin="round" />
      <Line x1="9.5" y1="20" x2="14.5" y2="20" {...p} />
      <Line x1="10.5" y1="22.5" x2="13.5" y2="22.5" {...p} />
    </>
  ),
  smartphone: (p) => (
    <>
      <Rect x="7" y="2" width="10" height="20" rx="2.5" {...p} fill="none" />
      <Circle cx="12" cy="18" r="0.8" {...p} />
    </>
  ),
  rocket: (p) => (
    <>
      <Path d="M12 2.5c3 2 4.9 5.8 4.9 9.6L14.4 14.6H9.6L7.1 12.1c0-3.8 1.9-7.6 4.9-9.6Z" {...p} strokeLinejoin="round" />
      <Circle cx="12" cy="9" r="1.8" {...p} fill="none" />
      <Path d="M7.4 13.8 5 16.3c1.5.3 2.6 1.2 3.1 2.4" {...p} />
      <Path d="M16.6 13.8 19 16.3c-1.5.3-2.6 1.2-3.1 2.4" {...p} />
      <Path d="M11 19.5c0 1.2.3 2.2 1 3 .7-.8 1-1.8 1-3" {...p} />
    </>
  ),
  palette: (p) => (
    <>
      <Path d="M12 3a9 9 0 1 0 0 18c1.2 0 2-.9 2-2 0-.5-.2-1-.5-1.4-.3-.4-.5-.8-.5-1.3 0-1.1.9-2 2-2h2.2A2.8 2.8 0 0 0 20 11.5 9 9 0 0 0 12 3Z" {...p} strokeLinejoin="round" />
      <Circle cx="8" cy="9" r="1" {...p} />
      <Circle cx="12" cy="7" r="1" {...p} />
      <Circle cx="16" cy="9" r="1" {...p} />
      <Circle cx="7.5" cy="13.5" r="1" {...p} />
    </>
  ),
  chart: (p) => (
    <>
      <Line x1="5" y1="20" x2="5" y2="12" {...p} />
      <Line x1="12" y1="20" x2="12" y2="4" {...p} />
      <Line x1="19" y1="20" x2="19" y2="9" {...p} />
    </>
  ),
  trending: (p) => (
    <>
      <Path d="M3 17l6-6 4 4 8-8" {...p} />
      <Path d="M15 7h6v6" {...p} strokeLinejoin="round" />
    </>
  ),
  cloud: (p) => <Path d="M17.5 18.5H7a4.5 4.5 0 1 1 .9-8.9A6 6 0 0 1 19.4 11a4 4 0 0 1-1.9 7.5Z" {...p} strokeLinejoin="round" />,
  building: (p) => (
    <>
      <Rect x="5" y="3" width="14" height="18" rx="1.5" {...p} fill="none" />
      <Line x1="9" y1="7.5" x2="10.5" y2="7.5" {...p} />
      <Line x1="13.5" y1="7.5" x2="15" y2="7.5" {...p} />
      <Line x1="9" y1="11.5" x2="10.5" y2="11.5" {...p} />
      <Line x1="13.5" y1="11.5" x2="15" y2="11.5" {...p} />
      <Path d="M10 21v-4h4v4" {...p} strokeLinejoin="round" />
    </>
  ),
  heartPulse: (p) => (
    <>
      <Path d="M12 21C7.2 16.7 3.5 13.5 3.5 9.7A4.7 4.7 0 0 1 12 6.6a4.7 4.7 0 0 1 8.5 3.1c0 3.8-3.7 7-8.5 11.3Z" {...p} strokeLinejoin="round" />
      <Path d="M6 12h3l1.5-2.5 2.5 4L14.5 11H18" {...p} strokeLinejoin="round" />
    </>
  ),
  cart: (p) => (
    <>
      <Path d="M3 4h2.2l2.6 12.2a1.5 1.5 0 0 0 1.5 1.2h8.5a1.5 1.5 0 0 0 1.5-1.2L21 8H6" {...p} strokeLinejoin="round" />
      <Circle cx="9.8" cy="21" r="1.3" {...p} fill="none" />
      <Circle cx="17.4" cy="21" r="1.3" {...p} fill="none" />
    </>
  ),
  messageCircle: (p) => <Path d="M12 3a8.5 8.5 0 0 0-7.4 12.7L3 21l5.5-1.5A8.5 8.5 0 1 0 12 3Z" {...p} strokeLinejoin="round" />,
  phone: (p) => <Path d="M5 3h3.6l1.8 4.6-2.2 1.7a12.5 12.5 0 0 0 6.5 6.5l1.7-2.2L21 15.4V19a2 2 0 0 1-2.2 2A16.5 16.5 0 0 1 3 5.2 2 2 0 0 1 5 3Z" {...p} strokeLinejoin="round" />,
  mail: (p) => (
    <>
      <Rect x="3" y="5" width="18" height="14" rx="2" {...p} fill="none" />
      <Path d="m3.5 7 8.5 6 8.5-6" {...p} />
    </>
  ),
  camera: (p) => (
    <>
      <Rect x="3" y="3" width="18" height="18" rx="5" {...p} fill="none" />
      <Circle cx="12" cy="12" r="4" {...p} fill="none" />
      <Circle cx="17.3" cy="6.7" r="0.9" {...p} />
    </>
  ),
  briefcase: (p) => (
    <>
      <Rect x="3" y="7.5" width="18" height="13" rx="2" {...p} fill="none" />
      <Path d="M8.5 7.5V6a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v1.5" {...p} />
      <Line x1="3" y1="13" x2="21" y2="13" {...p} />
    </>
  ),
  arrowRight: (p) => (
    <>
      <Line x1="4" y1="12" x2="19" y2="12" {...p} />
      <Path d="m13 6 6 6-6 6" {...p} strokeLinejoin="round" />
    </>
  ),
  check: (p) => <Path d="m4.5 12.5 5 5L20 6.5" {...p} strokeLinejoin="round" />,
  sun: (p) => (
    <>
      <Circle cx="12" cy="12" r="4" {...p} fill="none" />
      <Line x1="12" y1="2.5" x2="12" y2="5" {...p} />
      <Line x1="12" y1="19" x2="12" y2="21.5" {...p} />
      <Line x1="2.5" y1="12" x2="5" y2="12" {...p} />
      <Line x1="19" y1="12" x2="21.5" y2="12" {...p} />
      <Line x1="5.3" y1="5.3" x2="7" y2="7" {...p} />
      <Line x1="17" y1="17" x2="18.7" y2="18.7" {...p} />
      <Line x1="5.3" y1="18.7" x2="7" y2="17" {...p} />
      <Line x1="17" y1="7" x2="18.7" y2="5.3" {...p} />
    </>
  ),
  moon: (p) => <Path d="M20.5 14.5A8.5 8.5 0 1 1 9.5 3.5a7 7 0 0 0 11 11Z" {...p} strokeLinejoin="round" />,
  cpu: (p) => (
    <>
      <Rect x="6" y="6" width="12" height="12" rx="2" {...p} fill="none" />
      <Rect x="10" y="10" width="4" height="4" rx="0.5" {...p} fill="none" />
      <Line x1="9" y1="2.5" x2="9" y2="6" {...p} />
      <Line x1="15" y1="2.5" x2="15" y2="6" {...p} />
      <Line x1="9" y1="18" x2="9" y2="21.5" {...p} />
      <Line x1="15" y1="18" x2="15" y2="21.5" {...p} />
      <Line x1="2.5" y1="9" x2="6" y2="9" {...p} />
      <Line x1="2.5" y1="15" x2="6" y2="15" {...p} />
      <Line x1="18" y1="9" x2="21.5" y2="9" {...p} />
      <Line x1="18" y1="15" x2="21.5" y2="15" {...p} />
    </>
  ),
  search: (p) => (
    <>
      <Circle cx="11" cy="11" r="7" {...p} fill="none" />
      <Line x1="16.5" y1="16.5" x2="21" y2="21" {...p} />
    </>
  ),
  database: (p) => (
    <>
      <Ellipse cx="12" cy="5.5" rx="8" ry="3" {...p} fill="none" />
      <Path d="M4 5.5v13c0 1.66 3.58 3 8 3s8-1.34 8-3v-13" {...p} />
      <Path d="M4 12c0 1.66 3.58 3 8 3s8-1.34 8-3" {...p} />
    </>
  ),
  fileText: (p) => (
    <>
      <Path d="M14 2H7a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7l-5-5Z" {...p} strokeLinejoin="round" />
      <Path d="M14 2v5h5" {...p} strokeLinejoin="round" />
      <Line x1="9" y1="12" x2="15" y2="12" {...p} />
      <Line x1="9" y1="16" x2="13" y2="16" {...p} />
    </>
  ),
  pin: (p) => (
    <>
      <Path d="M12 21.5S5 15.9 5 10.3a7 7 0 0 1 14 0c0 5.6-7 11.2-7 11.2Z" {...p} strokeLinejoin="round" />
      <Circle cx="12" cy="10" r="2.5" {...p} fill="none" />
    </>
  ),
  send: (p) => (
    <>
      <Path d="M22 2 11 13" {...p} />
      <Path d="M22 2 15 22l-4-9-9-4 20-7Z" {...p} strokeLinejoin="round" />
    </>
  ),
  shield: (p) => (
    <>
      <Path d="M12 2.5 20 6v5.5c0 5-3.4 8.7-8 10-4.6-1.3-8-5-8-10V6l8-3.5Z" {...p} strokeLinejoin="round" />
      <Path d="m8.8 11.8 2.2 2.2 4.2-4.5" {...p} strokeLinejoin="round" />
    </>
  ),
};

export const ICON_NAMES = Object.keys(ICONS);

export default function Icon({ name, size = 22, color = '#FFFFFF', gradient, strokeWidth = 1.8 }) {
  const renderFn = ICONS[name];
  if (!renderFn) return null;

  let stroke = color;
  let defs = null;
  if (gradient && gradient.length >= 2) {
    const id = `icg${++gradSeq}`;
    stroke = `url(#${id})`;
    defs = (
      <Defs>
        <SvgGradient id={id} x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor={gradient[0]} />
          <Stop offset="1" stopColor={gradient[gradient.length - 1]} />
        </SvgGradient>
      </Defs>
    );
  }

  const strokeProps = { stroke, strokeWidth, strokeLinecap: 'round', fill: 'none' };

  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      {defs}
      {renderFn(strokeProps)}
    </Svg>
  );
}
