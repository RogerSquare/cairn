// Persistent status bar footer
// Pattern from: terminal-ui-showcase/src/demos/status-bar.tsx

import React, { useState, useEffect } from 'react';
import { Box, Text } from 'ink';

interface StatusBarProps {
  section: string;
  sectionColor: string;
  sectionIdx: number;
  totalSections: number;
}

const SECTION_HINTS: Record<string, string> = {
  About: '←→ tabs',
  Skills: '←→ tabs',
  Projects: '↑↓ browse  ←→ tabs',
  Experience: '↑↓ navigate  Enter expand  ←→ tabs',
  Contact: '↑↓ select  Enter copy  ←→ tabs',
};

export default function StatusBar({ section, sectionColor, sectionIdx, totalSections }: StatusBarProps) {
  const [clock, setClock] = useState('');

  useEffect(() => {
    const tick = () => setClock(new Date().toLocaleTimeString('en-US', { hour12: false }));
    tick();
    const timer = setInterval(tick, 1000);
    return () => clearInterval(timer);
  }, []);

  const hints = SECTION_HINTS[section] || '←→ tabs';

  return (
    <Box>
      {/* Section badge */}
      <Text backgroundColor={sectionColor} color="#0d1117" bold> {section} </Text>

      {/* Position */}
      <Text backgroundColor="#21262d" color="#8b949e"> {sectionIdx + 1}/{totalSections} </Text>

      {/* Keybind hints */}
      <Text backgroundColor="#161b22" color="#8b949e"> {hints} </Text>

      {/* Spacer */}
      <Box flexGrow={1}>
        <Text backgroundColor="#0d1117"> </Text>
      </Box>

      {/* Quit hint */}
      <Text backgroundColor="#161b22" color="#8b949e"> q quit </Text>

      {/* Clock */}
      <Text backgroundColor="#21262d" color="#c9d1d9"> {clock} </Text>
    </Box>
  );
}
