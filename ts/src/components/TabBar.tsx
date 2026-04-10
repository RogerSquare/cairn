// Tab bar navigation component
// Pattern from: terminal-ui-showcase/src/demos/tab-panels.tsx

import React from 'react';
import { Box, Text } from 'ink';

export interface TabDef {
  key: string;
  label: string;
  icon: string;
  color: string;
}

interface TabBarProps {
  tabs: TabDef[];
  activeIdx: number;
}

export default function TabBar({ tabs, activeIdx }: TabBarProps) {
  return (
    <Box>
      {tabs.map((tab, i) => {
        const isActive = i === activeIdx;
        const underChar = isActive ? '━' : '─';
        const underWidth = tab.label.length + tab.icon.length + 5;

        return (
          <Box key={tab.key} flexDirection="column">
            <Box paddingX={1} gap={1}>
              <Text color={isActive ? tab.color : '#30363d'}>{tab.icon}</Text>
              <Text color="gray" dimColor>{tab.key}</Text>
              <Text color={isActive ? tab.color : '#8b949e'} bold={isActive}>{tab.label}</Text>
            </Box>
            <Text color={isActive ? tab.color : '#21262d'}>
              {underChar.repeat(underWidth)}
            </Text>
          </Box>
        );
      })}
    </Box>
  );
}
