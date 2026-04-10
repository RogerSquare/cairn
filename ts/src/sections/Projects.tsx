// Projects section with selectable cards and scrolling
// Pattern from: terminal-ui-showcase/src/demos/scrollable-list.tsx, data-table.tsx

import React, { useState } from 'react';
import { Box, Text, useInput } from 'ink';
import { projects } from '../data.js';

const TECH_COLORS: Record<string, string> = {
  React: '#61dafb',
  Express: '#3fb950',
  SQLite: '#58a6ff',
  Python: '#3572A5',
  TypeScript: '#3178c6',
  'Node.js': '#3fb950',
  Ink: '#fdb32a',
  Swift: '#F05138',
  SwiftUI: '#F05138',
  'Replicate API': '#da7756',
  'Decky API': '#bc8cff',
  Go: '#00ADD8',
  'Bubble Tea': '#00ADD8',
  'Lip Gloss': '#bc8cff',
};

export default function ProjectsSection() {
  const [cursor, setCursor] = useState(0);

  useInput((input, key) => {
    if (key.upArrow || input === 'k') setCursor(prev => Math.max(0, prev - 1));
    else if (key.downArrow || input === 'j') setCursor(prev => Math.min(projects.length - 1, prev + 1));
  });

  return (
    <Box flexDirection="column">
      {projects.map((p, i) => {
        const isActive = i === cursor;
        return (
          <Box
            key={p.name}
            flexDirection="column"
            borderStyle={isActive ? 'round' : undefined}
            borderColor={isActive ? '#da7756' : undefined}
            paddingX={isActive ? 1 : 0}
            marginBottom={isActive ? 0 : 0}
          >
            <Box gap={1}>
              <Text color={isActive ? '#fdb32a' : '#30363d'}>{isActive ? '❯' : ' '}</Text>
              <Text color={isActive ? '#58a6ff' : '#8b949e'} bold={isActive}>{p.name}</Text>
            </Box>
            {isActive && (
              <Box flexDirection="column" marginLeft={2}>
                <Text color="#c9d1d9" wrap="wrap">{p.desc}</Text>
                <Box marginTop={0} gap={1}>
                  {p.tech.map(t => (
                    <Text key={t} color={TECH_COLORS[t] || '#8b949e'}>{t}</Text>
                  ))}
                </Box>
                <Text color="#30363d">{p.link}</Text>
              </Box>
            )}
          </Box>
        );
      })}
      <Box marginTop={1}>
        <Text color="gray" dimColor>↑↓ to browse projects ({cursor + 1}/{projects.length})</Text>
      </Box>
    </Box>
  );
}
