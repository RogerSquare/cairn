// Experience timeline with tree connectors and expandable descriptions
// Pattern from: terminal-ui-showcase/src/demos/tree-view.tsx

import React, { useState } from 'react';
import { Box, Text, useInput } from 'ink';
import { experience } from '../data.js';

export default function ExperienceSection() {
  const [cursor, setCursor] = useState(0);
  const [expanded, setExpanded] = useState<Set<number>>(new Set([0]));

  useInput((input, key) => {
    if (key.upArrow || input === 'k') setCursor(prev => Math.max(0, prev - 1));
    else if (key.downArrow || input === 'j') setCursor(prev => Math.min(experience.length - 1, prev + 1));
    else if (key.return || input === ' ') {
      setExpanded(prev => {
        const next = new Set(prev);
        if (next.has(cursor)) next.delete(cursor);
        else next.add(cursor);
        return next;
      });
    }
  });

  return (
    <Box flexDirection="column">
      {experience.map((exp, i) => {
        const isActive = i === cursor;
        const isExpanded = expanded.has(i);
        const isFirst = i === 0;
        const isLast = i === experience.length - 1;

        return (
          <Box key={exp.role} flexDirection="column">
            {/* Timeline connector + role header */}
            <Box gap={1}>
              {/* Timeline line */}
              <Box flexDirection="column" alignItems="center" width={3}>
                <Text color={isFirst ? '#fdb32a' : '#30363d'}>
                  {isFirst ? '●' : '○'}
                </Text>
              </Box>

              {/* Role info */}
              <Box flexDirection="column" flexGrow={1}>
                <Box gap={1}>
                  <Text color={isActive ? '#fdb32a' : '#30363d'}>{isActive ? '❯' : ' '}</Text>
                  <Text color={isActive ? 'white' : '#8b949e'} bold={isActive}>{exp.role}</Text>
                  <Text color={isExpanded ? '#d29922' : '#30363d'}>{isExpanded ? '▾' : '▸'}</Text>
                </Box>
                <Box marginLeft={2}>
                  <Text color="#58a6ff">{exp.company}</Text>
                  <Text color="#30363d"> · </Text>
                  <Text color="#8b949e">{exp.period}</Text>
                </Box>
              </Box>
            </Box>

            {/* Expanded description */}
            {isExpanded && (
              <Box marginLeft={4}>
                <Box flexDirection="column" marginLeft={2} paddingLeft={1} borderStyle={undefined}>
                  {exp.desc.map((d, j) => (
                    <Box key={`d-${j}`} gap={1}>
                      <Text color="#30363d">├─</Text>
                      <Text color="#c9d1d9">{d}</Text>
                    </Box>
                  ))}
                </Box>
              </Box>
            )}

            {/* Connector line between entries */}
            {!isLast && (
              <Box marginLeft={1}>
                <Text color="#30363d">│</Text>
              </Box>
            )}
          </Box>
        );
      })}

      <Box marginTop={1}>
        <Text color="gray" dimColor>↑↓ navigate, Enter/Space expand/collapse</Text>
      </Box>
    </Box>
  );
}
