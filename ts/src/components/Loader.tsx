// Loading skeleton screen shown on startup
// Pattern from: terminal-ui-showcase/src/demos/loading-skeleton.tsx

import React, { useState, useEffect } from 'react';
import { Box, Text } from 'ink';
import { contact } from '../data.js';

const SHIMMER_CHARS = ['░', '▒', '▓', '█', '▓', '▒'];
const SHIMMER_COLORS = ['#1a1a24', '#22222e', '#2a2a3a', '#333346', '#2a2a3a', '#22222e'];

const GRADIENT_STOPS = ['#da7756', '#e8945a', '#fdb32a', '#e8945a', '#da7756'];

function gradientColor(stops: string[], t: number): string {
  if (stops.length === 1) return stops[0];
  const segment = t * (stops.length - 1);
  const idx = Math.min(Math.floor(segment), stops.length - 2);
  const local = segment - idx;
  const parse = (hex: string) => [parseInt(hex.slice(1, 3), 16), parseInt(hex.slice(3, 5), 16), parseInt(hex.slice(5, 7), 16)];
  const a = parse(stops[idx]);
  const b = parse(stops[idx + 1]);
  const r = Math.round(a[0] + (b[0] - a[0]) * local);
  const g = Math.round(a[1] + (b[1] - a[1]) * local);
  const bl = Math.round(a[2] + (b[2] - a[2]) * local);
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${bl.toString(16).padStart(2, '0')}`;
}

function SkeletonLine({ width, offset }: { width: number; offset: number }) {
  return (
    <Box>
      {Array.from({ length: width }, (_, i) => {
        const idx = (offset + i) % SHIMMER_CHARS.length;
        return <Text key={`s-${i}`} color={SHIMMER_COLORS[idx]}>{SHIMMER_CHARS[idx]}</Text>;
      })}
    </Box>
  );
}

interface LoaderProps {
  onDone: () => void;
}

export default function Loader({ onDone }: LoaderProps) {
  const [shimmerOffset, setShimmerOffset] = useState(0);
  const [phase, setPhase] = useState(0); // 0=skeleton, 1=name reveal, 2=done

  // Shimmer tick
  useEffect(() => {
    const timer = setInterval(() => setShimmerOffset(prev => prev + 1), 120);
    return () => clearInterval(timer);
  }, []);

  // Phase progression
  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 800),
      setTimeout(() => setPhase(2), 1600),
      setTimeout(() => onDone(), 2200),
    ];
    return () => timers.forEach(clearTimeout);
  }, [onDone]);

  return (
    <Box flexDirection="column" padding={1}>
      {/* Header skeleton / reveal */}
      {phase < 1 ? (
        <Box flexDirection="column" marginBottom={1}>
          <SkeletonLine width={14} offset={shimmerOffset} />
          <SkeletonLine width={20} offset={shimmerOffset + 3} />
          <SkeletonLine width={12} offset={shimmerOffset + 6} />
        </Box>
      ) : (
        <Box flexDirection="column" marginBottom={1}>
          <Box>
            {contact.name.split('').map((char, i) => {
              const t = ((i * 3 + shimmerOffset) % (contact.name.length * 4)) / (contact.name.length * 4);
              return <Text key={`n-${i}`} bold color={gradientColor(GRADIENT_STOPS, t)}>{char}</Text>;
            })}
          </Box>
          {phase >= 2 ? (
            <Text color="#58a6ff">{contact.title}</Text>
          ) : (
            <SkeletonLine width={20} offset={shimmerOffset + 3} />
          )}
          <Text color="gray">{contact.location}</Text>
        </Box>
      )}

      {/* Tab bar skeleton */}
      <Box gap={1} marginBottom={1}>
        {['About', 'Skills', 'Projects', 'Experience', 'Contact'].map((tab, i) => (
          phase >= 2 ? (
            <Text key={tab} color={i === 0 ? '#58a6ff' : '#30363d'}>{tab}</Text>
          ) : (
            <SkeletonLine key={tab} width={tab.length + 2} offset={shimmerOffset + i * 4} />
          )
        ))}
      </Box>

      {/* Content skeleton */}
      <Box flexDirection="column" borderStyle="round" borderColor={phase >= 2 ? '#58a6ff' : '#1a1a24'} paddingX={2} paddingY={1} minHeight={12}>
        <SkeletonLine width={40} offset={shimmerOffset} />
        <SkeletonLine width={45} offset={shimmerOffset + 2} />
        <SkeletonLine width={38} offset={shimmerOffset + 4} />
        <Box marginTop={1} />
        <SkeletonLine width={42} offset={shimmerOffset + 6} />
        <SkeletonLine width={35} offset={shimmerOffset + 8} />
        <Box marginTop={1} />
        <SkeletonLine width={30} offset={shimmerOffset + 10} />
        <SkeletonLine width={44} offset={shimmerOffset + 12} />
      </Box>

      {/* Footer skeleton */}
      <Box marginTop={1}>
        <SkeletonLine width={50} offset={shimmerOffset + 14} />
      </Box>
    </Box>
  );
}
