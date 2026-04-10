// Skills section with animated sub-character progress bars
// Pattern from: terminal-ui-showcase/src/demos/progress-bar.tsx

import React, { useState, useEffect, useRef } from 'react';
import { Box, Text } from 'ink';
import { skills } from '../data.js';

const BLOCKS = [' ', '▏', '▎', '▍', '▌', '▋', '▊', '▉', '█'];
const BAR_WIDTH = 20;

const CATEGORY_COLORS = ['#58a6ff', '#3fb950', '#da7756', '#d29922', '#bc8cff'];

function renderBar(progress: number, width: number, color: string): React.ReactElement {
  const filled = progress * width;
  const fullBlocks = Math.floor(filled);
  const fractional = filled - fullBlocks;
  const fractIdx = Math.round(fractional * 8);
  const empty = width - fullBlocks - (fractIdx > 0 ? 1 : 0);

  const bar =
    '█'.repeat(fullBlocks) +
    (fractIdx > 0 ? BLOCKS[fractIdx] : '') +
    '░'.repeat(Math.max(0, empty));

  return (
    <Text>
      <Text color={color}>{bar}</Text>
      <Text color="gray"> {Math.round(progress * 100)}%</Text>
    </Text>
  );
}

export default function SkillsSection() {
  const [animProgress, setAnimProgress] = useState(0);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (hasAnimated.current) {
      setAnimProgress(1);
      return;
    }
    if (animProgress >= 1) {
      hasAnimated.current = true;
      return;
    }
    const timer = setTimeout(() => {
      setAnimProgress(prev => Math.min(1, prev + 0.04));
    }, 30);
    return () => clearTimeout(timer);
  }, [animProgress]);

  return (
    <Box flexDirection="column">
      {skills.map((cat, i) => {
        const color = CATEGORY_COLORS[i % CATEGORY_COLORS.length];
        const targetProgress = cat.level / 5;
        const currentProgress = Math.min(targetProgress, targetProgress * animProgress);

        return (
          <Box key={cat.name} flexDirection="column" marginBottom={1}>
            <Box gap={1}>
              <Text color={color} bold>{cat.name}</Text>
            </Box>
            {renderBar(currentProgress, BAR_WIDTH, color)}
            <Box marginTop={0}>
              <Text color="gray">
                {cat.items.map((item, j) => (
                  <Text key={`${cat.name}-${j}`}>
                    {j > 0 ? <Text color="#30363d"> · </Text> : null}
                    <Text color="#8b949e">{item}</Text>
                  </Text>
                ))}
              </Text>
            </Box>
          </Box>
        );
      })}
    </Box>
  );
}
