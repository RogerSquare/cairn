// Minimal status bar -- single dim line

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
  Experience: '↑↓ navigate  enter expand  ←→ tabs',
  Contact: '↑↓ select  enter copy  ←→ tabs',
  Chat: 'type to chat  enter send  esc back',
};

export default function StatusBar({ section, sectionIdx, totalSections }: StatusBarProps) {
  const [clock, setClock] = useState('');

  useEffect(() => {
    const tick = () => setClock(new Date().toLocaleTimeString('en-US', { hour12: false }));
    tick();
    const timer = setInterval(tick, 1000);
    return () => clearInterval(timer);
  }, []);

  const hints = SECTION_HINTS[section] || '←→ tabs';

  return (
    <Box justifyContent="space-between">
      <Text color="#444">{section}  {sectionIdx + 1}/{totalSections}  {hints}  q quit</Text>
      <Text color="#333">{clock}</Text>
    </Box>
  );
}
