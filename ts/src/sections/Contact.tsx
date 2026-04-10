// Contact section with selectable items and copy-to-clipboard
// Pattern from: terminal-ui-showcase/src/demos/select-menu.tsx, toast-notifications.tsx

import React, { useState, useEffect } from 'react';
import { Box, Text, useInput, useStdout } from 'ink';
import { contact } from '../data.js';

interface ContactItem {
  icon: string;
  label: string;
  value: string;
  color: string;
}

const ITEMS: ContactItem[] = [
  { icon: '✉', label: 'Email', value: contact.email, color: '#da7756' },
  { icon: '◆', label: 'GitHub', value: contact.github, color: '#58a6ff' },
  { icon: '◇', label: 'Website', value: contact.website, color: '#3fb950' },
  { icon: '⌂', label: 'Location', value: contact.location, color: '#d29922' },
];

export default function ContactSection() {
  const [cursor, setCursor] = useState(0);
  const [toast, setToast] = useState('');
  const { stdout } = useStdout();

  useInput((input, key) => {
    if (key.upArrow || input === 'k') setCursor(prev => Math.max(0, prev - 1));
    else if (key.downArrow || input === 'j') setCursor(prev => Math.min(ITEMS.length - 1, prev + 1));
    else if (key.return) {
      const item = ITEMS[cursor];
      // Use OSC 52 escape sequence to set the system clipboard
      // This works in most modern terminals (Windows Terminal, iTerm2, kitty, etc.)
      const encoded = Buffer.from(item.value).toString('base64');
      stdout?.write(`\x1b]52;c;${encoded}\x07`);
      setToast(`Copied: ${item.value}`);
    }
  });

  // Auto-dismiss toast
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(''), 2000);
    return () => clearTimeout(timer);
  }, [toast]);

  return (
    <Box flexDirection="column">
      <Text color="gray" dimColor>Get in touch:</Text>
      <Box marginTop={1} />

      {ITEMS.map((item, i) => {
        const isActive = i === cursor;
        return (
          <Box key={item.label} gap={1} marginBottom={0}>
            <Text color={isActive ? item.color : '#30363d'}>{isActive ? '❯' : ' '}</Text>
            <Text color={item.color}>{item.icon}</Text>
            <Text color={isActive ? 'white' : '#8b949e'} bold={isActive}>
              {item.label.padEnd(10)}
            </Text>
            <Text color={isActive ? 'white' : 'gray'}>{item.value}</Text>
            {isActive && <Text color="#30363d"> (Enter to copy)</Text>}
          </Box>
        );
      })}

      {/* Toast notification */}
      {toast && (
        <Box marginTop={1} borderStyle="round" borderColor="#3fb950" paddingX={1}>
          <Text color="#3fb950">✓ {toast}</Text>
        </Box>
      )}

      {!toast && <Box marginTop={1}><Text color="gray" dimColor>↑↓ select, Enter to copy</Text></Box>}
    </Box>
  );
}
