import React, { useEffect, useRef, useState } from 'react';
import { View, Text, PanResponder, Animated, StyleSheet, Dimensions } from 'react-native';
import Svg, { Path, Circle, Line, Text as SvgText, Defs, LinearGradient as SvgGradient, Stop, Rect } from 'react-native-svg';
import { Colors } from '../theme/colors';
import { Typography } from '../theme/typography';

const { width: SCREEN_W } = Dimensions.get('window');

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export default function InteractiveLineChart({
  data = [12, 18, 14, 24, 28, 22, 35, 40, 38, 45, 50, 58],
  label = 'Monthly Growth',
  color = '#00D4AA',
  unit = 'clients',
  width: chartW,
  height: chartH = 180,
}) {
  const W = chartW || SCREEN_W - 64;
  const H = chartH;
  const PAD = { top: 20, right: 16, bottom: 32, left: 36 };
  const innerW = W - PAD.left - PAD.right;
  const innerH = H - PAD.top - PAD.bottom;

  const [activeIndex, setActiveIndex] = useState(null);
  const tooltipOpacity = useRef(new Animated.Value(0)).current;
  const animProgress = useRef(new Animated.Value(0)).current;
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const listener = animProgress.addListener(({ value }) => setProgress(value));
    Animated.timing(animProgress, { toValue: 1, duration: 1200, useNativeDriver: false }).start();
    return () => animProgress.removeListener(listener);
  }, []);

  const minVal = Math.min(...data);
  const maxVal = Math.max(...data);
  const range = maxVal - minVal || 1;

  const getX = (i) => PAD.left + (i / (data.length - 1)) * innerW;
  const getY = (v) => PAD.top + innerH - ((v - minVal) / range) * innerH;

  // Build smooth bezier path up to current progress
  const buildPath = () => {
    const visibleCount = Math.max(2, Math.floor(progress * data.length));
    const pts = data.slice(0, visibleCount).map((v, i) => ({ x: getX(i), y: getY(v) }));
    if (pts.length < 2) return '';

    let d = `M ${pts[0].x} ${pts[0].y}`;
    for (let i = 1; i < pts.length; i++) {
      const cpX = (pts[i - 1].x + pts[i].x) / 2;
      d += ` C ${cpX} ${pts[i - 1].y}, ${cpX} ${pts[i].y}, ${pts[i].x} ${pts[i].y}`;
    }
    return d;
  };

  // Build area fill path
  const buildArea = () => {
    const linePath = buildPath();
    if (!linePath) return '';
    const visibleCount = Math.max(2, Math.floor(progress * data.length));
    const lastX = getX(visibleCount - 1);
    return `${linePath} L ${lastX} ${PAD.top + innerH} L ${PAD.left} ${PAD.top + innerH} Z`;
  };

  const panResponder = useRef(PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderGrant: (e) => handleTouch(e.nativeEvent.locationX),
    onPanResponderMove: (e) => handleTouch(e.nativeEvent.locationX),
    onPanResponderRelease: () => {
      Animated.timing(tooltipOpacity, { toValue: 0, duration: 300, useNativeDriver: true }).start(() => setActiveIndex(null));
    },
  })).current;

  const handleTouch = (touchX) => {
    const relX = touchX - PAD.left;
    const idx = Math.round((relX / innerW) * (data.length - 1));
    const clamped = Math.max(0, Math.min(data.length - 1, idx));
    setActiveIndex(clamped);
    Animated.timing(tooltipOpacity, { toValue: 1, duration: 150, useNativeDriver: true }).start();
  };

  const activeX = activeIndex !== null ? getX(activeIndex) : 0;
  const activeY = activeIndex !== null ? getY(data[activeIndex]) : 0;

  return (
    <View>
      <Text style={[Typography.label, { color: Colors.textSecondary, marginBottom: 8 }]}>
        {label}
      </Text>
      <View style={{ position: 'relative' }} {...panResponder.panHandlers}>
        <Svg width={W} height={H}>
          <Defs>
            <SvgGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0" stopColor={color} stopOpacity="0.25" />
              <Stop offset="1" stopColor={color} stopOpacity="0" />
            </SvgGradient>
          </Defs>

          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((t, i) => {
            const y = PAD.top + t * innerH;
            const val = Math.round(maxVal - t * range);
            return (
              <React.Fragment key={i}>
                <Line x1={PAD.left} y1={y} x2={W - PAD.right} y2={y} stroke="rgba(255,255,255,0.07)" strokeWidth={1} />
                <SvgText x={PAD.left - 4} y={y + 4} fontSize={9} fill="rgba(255,255,255,0.35)" textAnchor="end">{val}</SvgText>
              </React.Fragment>
            );
          })}

          {/* Month labels — only show every 3rd to avoid overlap */}
          {data.map((_, i) => {
            if (i % 3 !== 0 && i !== data.length - 1) return null;
            return (
              <SvgText key={i} x={getX(i)} y={H - 4} fontSize={8} fill="rgba(255,255,255,0.4)" textAnchor="middle">
                {MONTHS[i]}
              </SvgText>
            );
          })}

          {/* Area fill */}
          <Path d={buildArea()} fill="url(#areaGrad)" />

          {/* Line */}
          <Path d={buildPath()} stroke={color} strokeWidth={2.5} fill="none" strokeLinecap="round" strokeLinejoin="round" />

          {/* Data dots */}
          {data.map((v, i) => {
            if (Math.floor(progress * data.length) <= i) return null;
            return (
              <Circle
                key={i}
                cx={getX(i)}
                cy={getY(v)}
                r={activeIndex === i ? 6 : 3}
                fill={activeIndex === i ? '#fff' : color}
                stroke={color}
                strokeWidth={activeIndex === i ? 2 : 0}
              />
            );
          })}

          {/* Active vertical line */}
          {activeIndex !== null && (
            <>
              <Line x1={activeX} y1={PAD.top} x2={activeX} y2={PAD.top + innerH} stroke="rgba(255,255,255,0.3)" strokeWidth={1} strokeDasharray="4,3" />
              {/* Tooltip box */}
              <Rect x={Math.min(activeX - 28, W - PAD.right - 60)} y={PAD.top - 18} width={60} height={22} rx={6} fill={color} opacity={0.95} />
              <SvgText
                x={Math.min(activeX - 28, W - PAD.right - 60) + 30}
                y={PAD.top - 3}
                fontSize={10}
                fill="#fff"
                textAnchor="middle"
                fontWeight="700"
              >
                {data[activeIndex]} {unit}
              </SvgText>
            </>
          )}
        </Svg>
      </View>
    </View>
  );
}
